import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  quoteProvisionsSchema,
  quoteProvisionsRichSchema,
  MAX_UPLOAD_BYTES,
  type QuoteProvisionsRichValues,
} from "@/lib/schemas/quote-provisions";
import { quoteMarpolSchema } from "@/lib/schemas/quote-marpol";
import type { QuoteMarpolValues } from "@/lib/schemas/quote-marpol";
import { quoteTechnicalSchema } from "@/lib/schemas/quote-technical";
import type { QuoteTechnicalValues } from "@/lib/schemas/quote-technical";
import { quoteUnifiedSchema } from "@/lib/schemas/quote-unified";
import type { QuoteUnifiedValues } from "@/lib/schemas/quote-unified";
import { InternalQuoteEmail } from "@/lib/email-templates/internal-quote";
import { InternalTechnicalQuoteEmail } from "@/lib/email-templates/internal-technical-quote";
import { InternalUnifiedQuoteEmail } from "@/lib/email-templates/internal-unified-quote";
import {
  CustomerConfirmationEmail,
  customerConfirmationSubject,
} from "@/lib/email-templates/customer-confirmation";
// Excel builders imported dynamically to keep ExcelJS (3.8 MB) out of the
// initial module graph — only loaded when a quote actually needs Excel output.

export const runtime = "nodejs";

type QuoteType = "provisions" | "marpol" | "technical" | "unified";
type Locale = "es" | "en";

const DEFAULT_FROM = "De Jesús Ship Supply <cotizaciones@djshipsupply.com>";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "djss:cotizar",
});

const ALLOWED_UPLOAD_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
  "text/plain",
  "image/jpeg",
  "image/png",
]);

function isLocale(v: unknown): v is Locale {
  return v === "es" || v === "en";
}

function isType(v: unknown): v is QuoteType {
  return v === "provisions" || v === "marpol" || v === "technical" || v === "unified";
}

/** Strip CR/LF/tab from values placed into email header fields. */
function sanitizeHeaderValue(v: string): string {
  return v.replace(/[\r\n\t]/g, " ").trim();
}

/**
 * Verify that the file's magic bytes match the claimed MIME type.
 * Also rejects known executable signatures regardless of MIME.
 */
function validateFileMagicBytes(bytes: Buffer, mimeType: string): boolean {
  if (bytes.length < 4) return false;
  const b = bytes;

  // Reject executable signatures unconditionally
  if (b[0] === 0x4d && b[1] === 0x5a) return false;                                   // MZ (Windows exe/dll)
  if (b[0] === 0x7f && b[1] === 0x45 && b[2] === 0x4c && b[3] === 0x46) return false; // ELF
  if (b[0] === 0x23 && b[1] === 0x21) return false;                                    // #! shebang
  if (b[0] === 0xca && b[1] === 0xfe && b[2] === 0xba && b[3] === 0xbe) return false; // Java class

  if (mimeType === "application/pdf")
    return b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46; // %PDF

  if (mimeType === "application/vnd.ms-excel")
    return b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0; // OLE2

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04; // PK (ZIP)

  if (mimeType === "image/jpeg")
    return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;

  if (mimeType === "image/png")
    return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47; // \x89PNG

  if (mimeType === "text/csv" || mimeType === "text/plain") {
    // Reject if the first 32 bytes contain non-printable control chars (< 0x09)
    const sample = b.slice(0, Math.min(32, b.length));
    for (const byte of sample) if (byte < 0x09) return false;
    return true;
  }

  return false;
}

type ParsedRequest = {
  type: QuoteType;
  locale: Locale;
  rawPayload: unknown;
  /** Present only on multipart upload requests. */
  file?: { name: string; type: string; size: number; bytes: Buffer };
};

async function parseRequest(request: Request): Promise<
  | { ok: true; data: ParsedRequest }
  | { ok: false; status: number; body: Record<string, unknown> }
> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return {
        ok: false,
        status: 400,
        body: {
          ok: false,
          error: "INVALID_FORM",
          message: "Cuerpo inválido / Invalid body",
        },
      };
    }

    const typeRaw = form.get("type");
    const localeRaw = form.get("locale");
    const payloadRaw = form.get("payload");
    const fileRaw = form.get("file");

    if (!isType(typeRaw)) {
      return {
        ok: false,
        status: 400,
        body: {
          ok: false,
          error: "INVALID_TYPE",
          message: "Tipo inválido / Invalid type",
        },
      };
    }

    if (typeof payloadRaw !== "string") {
      return {
        ok: false,
        status: 400,
        body: {
          ok: false,
          error: "MISSING_PAYLOAD",
          message: "Payload faltante / Missing payload",
        },
      };
    }

    let parsedPayload: unknown;
    try {
      parsedPayload = JSON.parse(payloadRaw);
    } catch {
      return {
        ok: false,
        status: 400,
        body: {
          ok: false,
          error: "INVALID_JSON",
          message: "Payload inválido / Invalid payload",
        },
      };
    }

    let file: ParsedRequest["file"] | undefined;
    if (fileRaw && fileRaw instanceof File && fileRaw.size > 0) {
      if (fileRaw.size > MAX_UPLOAD_BYTES) {
        return {
          ok: false,
          status: 413,
          body: {
            ok: false,
            error: "FILE_TOO_LARGE",
            message: "Archivo supera 10 MB / File exceeds 10 MB",
          },
        };
      }
      const mimeType = fileRaw.type || "";
      if (mimeType && !ALLOWED_UPLOAD_TYPES.has(mimeType)) {
        return {
          ok: false,
          status: 415,
          body: {
            ok: false,
            error: "INVALID_FILE_TYPE",
            message: "Tipo de archivo no permitido / File type not allowed",
          },
        };
      }
      const safeName = fileRaw.name.replace(/[^a-zA-Z0-9._\-]/g, "_").slice(0, 200);
      const arrayBuf = await fileRaw.arrayBuffer();
      const fileBytes = Buffer.from(arrayBuf);

      if (mimeType && !validateFileMagicBytes(fileBytes, mimeType)) {
        return {
          ok: false,
          status: 415,
          body: {
            ok: false,
            error: "INVALID_FILE_CONTENT",
            message: "El contenido del archivo no coincide con su tipo declarado / File content does not match declared type",
          },
        };
      }

      file = {
        name: safeName,
        type: mimeType || "application/octet-stream",
        size: fileRaw.size,
        bytes: fileBytes,
      };
    }

    return {
      ok: true,
      data: {
        type: typeRaw,
        locale: isLocale(localeRaw) ? localeRaw : "es",
        rawPayload: parsedPayload,
        file,
      },
    };
  }

  // JSON path (legacy / catalog-only / marpol)
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return {
      ok: false,
      status: 400,
      body: {
        ok: false,
        error: "INVALID_JSON",
        message: "Cuerpo inválido / Invalid body",
      },
    };
  }
  const body = (json ?? {}) as {
    type?: unknown;
    payload?: unknown;
    locale?: unknown;
  };
  if (!isType(body.type)) {
    return {
      ok: false,
      status: 400,
      body: {
        ok: false,
        error: "INVALID_TYPE",
        message: "Tipo de solicitud inválido / Invalid request type",
      },
    };
  }
  return {
    ok: true,
    data: {
      type: body.type,
      locale: isLocale(body.locale) ? body.locale : "es",
      rawPayload: body.payload,
    },
  };
}

function validatePayload(
  type: QuoteType,
  rawPayload: unknown,
  hasFile: boolean
):
  | { ok: true; payload: unknown }
  | { ok: false; fieldErrors: Record<string, string[]> } {
  // For provisions: pick rich schema if it carries `method`, fallback to legacy.
  let schema;
  if (type === "marpol") {
    schema = quoteMarpolSchema;
  } else if (type === "technical") {
    schema = quoteTechnicalSchema;
  } else if (type === "unified") {
    schema = quoteUnifiedSchema;
  } else {
    const hasMethod =
      typeof rawPayload === "object" &&
      rawPayload !== null &&
      "method" in (rawPayload as Record<string, unknown>);
    schema = hasMethod ? quoteProvisionsRichSchema : quoteProvisionsSchema;
  }

  const parsed = schema.safeParse(rawPayload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_root";
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { ok: false, fieldErrors };
  }

  // Cross-validation: upload/template methods require a file.
  if (type === "provisions" || type === "unified") {
    const data = parsed.data as { provisionsMethod?: string; method?: string };
    const method = type === "unified" ? data.provisionsMethod : data.method;
    if ((method === "upload" || method === "template") && !hasFile) {
      return {
        ok: false,
        fieldErrors: { file: ["Archivo requerido / File required"] },
      };
    }
  }

  return { ok: true, payload: parsed.data };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const allowedOrigins = [siteUrl, "http://localhost:3000", "http://localhost:3001"].filter(Boolean);
  const isProd = process.env.NODE_ENV === "production";

  // In production, always require a valid Origin header (prevents server-side CSRF).
  // In development, only validate when Origin is present.
  if (isProd ? (!origin || !allowedOrigins.includes(origin)) : (origin !== null && !allowedOrigins.includes(origin))) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  // Prefer x-real-ip (set by Vercel edge, not spoofable by clients).
  // Fall back to x-forwarded-for only as a secondary option.
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "anonymous";
  const { success, remaining } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      {
        ok: false,
        error: "RATE_LIMIT",
        message:
          origin?.includes("djshipsupply.com") || !origin
            ? "Demasiadas solicitudes. Por favor espere una hora antes de intentar de nuevo."
            : "Too many requests. Please wait an hour before trying again.",
      },
      {
        status: 429,
        headers: { "Retry-After": "3600", "X-RateLimit-Remaining": String(remaining) },
      }
    );
  }

  const parsed = await parseRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const { type, locale, rawPayload, file } = parsed.data;

  const validation = validatePayload(type, rawPayload, !!file);
  if (!validation.ok) {
    console.error(
      `[cotizar] Validation failed — type: ${type}, fields: ${JSON.stringify(validation.fieldErrors)}`
    );
    return NextResponse.json(
      {
        ok: false,
        error: "VALIDATION_ERROR",
        message:
          locale === "es"
            ? "Hay campos inválidos en el formulario."
            : "Some form fields are invalid.",
        fieldErrors: validation.fieldErrors,
      },
      { status: 422 }
    );
  }

  const payload = validation.payload as {
    vesselName: string;
    port: string;
    contactName: string;
    email: string;
  };

  const submittedAt = new Date().toISOString();
  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.RESEND_TO_EMAIL;
  const fromAddress = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  const { renderToStaticMarkup } = await import("react-dom/server");

  let internalHtml: string;
  if (type === "technical") {
    internalHtml =
      "<!doctype html>" +
      renderToStaticMarkup(
        InternalTechnicalQuoteEmail({
          payload: payload as unknown as QuoteTechnicalValues,
          submittedAt,
          locale,
        })
      );
  } else if (type === "unified") {
    internalHtml =
      "<!doctype html>" +
      renderToStaticMarkup(
        InternalUnifiedQuoteEmail({
          payload: payload as unknown as QuoteUnifiedValues,
          submittedAt,
          locale,
          attachmentName: file?.name,
        })
      );
  } else {
    internalHtml =
      "<!doctype html>" +
      renderToStaticMarkup(
        InternalQuoteEmail({
          type: type as "provisions" | "marpol",
          payload: payload as never,
          submittedAt,
          locale,
          attachmentName: file?.name,
        })
      );
  }

  const customerHtml =
    "<!doctype html>" +
    renderToStaticMarkup(
      CustomerConfirmationEmail({
        locale,
        contactName: payload.contactName,
        type: type as "provisions" | "marpol" | "technical" | "unified",
      })
    );

  const internalSubjectBase =
    type === "provisions"
      ? "Nueva cotización — Provisiones"
      : type === "technical"
      ? "Nueva cotización — Suministros Técnicos"
      : type === "unified"
      ? "Nueva cotización — Combinada"
      : "Nueva cotización — Desechos MARPOL";
  const internalSubject = `${internalSubjectBase} · ${sanitizeHeaderValue(payload.vesselName)} · ${sanitizeHeaderValue(payload.port)}`;
  const customerSubject = customerConfirmationSubject(locale);

  // Generate Excel attachment (best-effort — failure doesn't block the email).
  // Dynamic import keeps ExcelJS (3.8 MB) out of the cold-start module graph.
  let excelBuffer: Buffer | null = null;
  let excelFilename = "cotizacion.xlsx";
  try {
    const safe = sanitizeHeaderValue(payload.vesselName).replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
    const dateStr = new Date().toISOString().slice(0, 10);
    const excel = await import("@/lib/excel/quote-excel");
    if (type === "technical") {
      excelBuffer = await excel.buildTechnicalExcel(payload as unknown as QuoteTechnicalValues);
      excelFilename = `DJSS_Tecnico_${safe}_${dateStr}.xlsx`;
    } else if (type === "provisions") {
      excelBuffer = await excel.buildProvisionsExcel(payload as unknown as QuoteProvisionsRichValues);
      excelFilename = `DJSS_Provisiones_${safe}_${dateStr}.xlsx`;
    } else if (type === "unified") {
      excelBuffer = await excel.buildUnifiedExcel(payload as unknown as QuoteUnifiedValues);
      excelFilename = `DJSS_Combinada_${safe}_${dateStr}.xlsx`;
    } else if (type === "marpol") {
      excelBuffer = await excel.buildMarpolExcel(payload as unknown as QuoteMarpolValues);
      excelFilename = `DJSS_Desechos_${safe}_${dateStr}.xlsx`;
    }
  } catch (excelErr) {
    console.error("[cotizar] Excel generation failed (non-fatal):", excelErr);
  }

  if (!apiKey || !toAddress) {
    if (process.env.NODE_ENV !== "production") {
      const p = payload as Record<string, unknown>;
      console.log("\n[cotizar] Simulation mode — email config missing");
      console.log("[cotizar] type:", type, "locale:", locale);
      console.log("[cotizar] vessel:", p.vesselName, "port:", p.port);
      if (file) {
        console.log("[cotizar] attachment:", file.name, `(${file.size} bytes)`);
      }
      return NextResponse.json({ ok: true, simulated: true });
    }
    return NextResponse.json(
      {
        ok: false,
        error: "EMAIL_NOT_CONFIGURED",
        message:
          locale === "es"
            ? "Servicio de correo no configurado."
            : "Email service is not configured.",
      },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const attachments: { filename: string; content: Buffer }[] = [];
    if (excelBuffer) {
      attachments.push({ filename: excelFilename, content: excelBuffer });
    }
    if (file) {
      attachments.push({ filename: file.name, content: file.bytes });
    }

    // Send both emails in parallel — internal first matters for error reporting,
    // but customer confirmation doesn't need to block on internal delivery.
    const [internalRes, customerRes] = await Promise.all([
      resend.emails.send({
        from: fromAddress,
        to: toAddress,
        replyTo: payload.email,
        subject: internalSubject,
        html: internalHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      }),
      resend.emails.send({
        from: fromAddress,
        to: payload.email,
        subject: customerSubject,
        html: customerHtml,
      }),
    ]);

    if (internalRes.error) {
      console.error("[cotizar] internal email error:", internalRes.error);
      return NextResponse.json(
        {
          ok: false,
          error: "EMAIL_SEND_FAILED",
          message:
            locale === "es"
              ? "No pudimos enviar la solicitud. Intente de nuevo o contáctenos por WhatsApp."
              : "We couldn't send your request. Please try again or contact us on WhatsApp.",
        },
        { status: 502 }
      );
    }

    if (customerRes.error) {
      console.error("[cotizar] customer confirmation error:", customerRes.error);
    }

    // ── Enviar lead al ERP (fire-and-forget, no bloquea) ────────────
    const erpUrl = process.env.ERP_URL ?? "https://dejesus-erp.vercel.app";
    const p = payload as Record<string, unknown>;
    fetch(`${erpUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre:     p.contactName      ?? null,
        empresa:    p.company          ?? null,
        email:      p.email            ?? null,
        telefono:   p.phone            ?? null,
        buque:      p.vesselName       ?? null,
        puerto:     p.port             ?? null,
        eta:        p.eta              ?? null,
        mensaje:    p.notes ?? p.additionalNotes ?? null,
        // Provisiones seleccionadas por el cliente
        categories:   Array.isArray(p.categories) ? p.categories : [],
        items:        Array.isArray(p.items) ? p.items : [],        // CartItem[] con cantidades
        customItems:  Array.isArray(p.customItems) ? p.customItems : [],
        method:       p.method ?? null,
        currency:     p.currency ?? null,
        quoteType:    type,
      }),
    }).catch((e) => console.error("[cotizar] ERP lead sync failed (non-fatal):", e));
    // ────────────────────────────────────────────────────────────────

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cotizar] unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL_ERROR",
        message:
          locale === "es"
            ? "Error inesperado al enviar la solicitud."
            : "Unexpected error while sending the request.",
      },
      { status: 500 }
    );
  }
}

// Type-only import to keep tree-shake clean.
export type { QuoteProvisionsRichValues };
