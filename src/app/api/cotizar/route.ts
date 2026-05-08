import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  quoteProvisionsSchema,
  quoteProvisionsRichSchema,
  MAX_UPLOAD_BYTES,
  type QuoteProvisionsRichValues,
} from "@/lib/schemas/quote-provisions";
import { quoteMarpolSchema } from "@/lib/schemas/quote-marpol";
import { InternalQuoteEmail } from "@/lib/email-templates/internal-quote";
import {
  CustomerConfirmationEmail,
  customerConfirmationSubject,
} from "@/lib/email-templates/customer-confirmation";

export const runtime = "nodejs";

type QuoteType = "provisions" | "marpol";
type Locale = "es" | "en";

const DEFAULT_TO = "miguelcarmona809v@gmail.com";
const DEFAULT_FROM = "De Jesús Ship Supply <noreply@djesusshipsupply.com>";

function isLocale(v: unknown): v is Locale {
  return v === "es" || v === "en";
}

function isType(v: unknown): v is QuoteType {
  return v === "provisions" || v === "marpol";
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
      const arrayBuf = await fileRaw.arrayBuffer();
      file = {
        name: fileRaw.name,
        type: fileRaw.type || "application/octet-stream",
        size: fileRaw.size,
        bytes: Buffer.from(arrayBuf),
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
  if (type === "provisions") {
    const data = parsed.data as { method?: string };
    if (
      (data.method === "upload" || data.method === "template") &&
      !hasFile
    ) {
      return {
        ok: false,
        fieldErrors: { file: ["Archivo requerido / File required"] },
      };
    }
  }

  return { ok: true, payload: parsed.data };
}

export async function POST(request: Request) {
  const parsed = await parseRequest(request);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  const { type, locale, rawPayload, file } = parsed.data;

  const validation = validatePayload(type, rawPayload, !!file);
  if (!validation.ok) {
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
  const toAddress = process.env.RESEND_TO_EMAIL || DEFAULT_TO;
  const fromAddress = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  const { renderToStaticMarkup } = await import("react-dom/server");

  const internalHtml =
    "<!doctype html>" +
    renderToStaticMarkup(
      InternalQuoteEmail({
        type,
        payload: payload as never,
        submittedAt,
        locale,
        attachmentName: file?.name,
      })
    );

  const customerHtml =
    "<!doctype html>" +
    renderToStaticMarkup(
      CustomerConfirmationEmail({
        locale,
        contactName: payload.contactName,
        type,
      })
    );

  const internalSubjectBase =
    type === "provisions"
      ? "Nueva cotización — Provisiones"
      : "Nueva cotización — Desechos MARPOL";
  const internalSubject = `${internalSubjectBase} · ${payload.vesselName} · ${payload.port}`;
  const customerSubject = customerConfirmationSubject(locale);

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("\n[cotizar] RESEND_API_KEY missing — simulation mode");
      console.log("[cotizar] type:", type, "locale:", locale);
      console.log(
        "[cotizar] internal email →",
        toAddress,
        "|",
        internalSubject
      );
      console.log(
        "[cotizar] customer email →",
        payload.email,
        "|",
        customerSubject
      );
      console.log("[cotizar] payload:", JSON.stringify(payload, null, 2));
      if (file) {
        console.log(
          "[cotizar] attachment:",
          file.name,
          `(${file.size} bytes, ${file.type})`
        );
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
    const internalRes = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: payload.email,
      subject: internalSubject,
      html: internalHtml,
      attachments: file
        ? [{ filename: file.name, content: file.bytes }]
        : undefined,
    });

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

    const customerRes = await resend.emails.send({
      from: fromAddress,
      to: payload.email,
      subject: customerSubject,
      html: customerHtml,
    });

    if (customerRes.error) {
      console.error("[cotizar] customer confirmation error:", customerRes.error);
    }

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
