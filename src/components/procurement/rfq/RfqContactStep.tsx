"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { useRfq } from "./useRfq";
import type { RfqEntry } from "./RfqContext";
import { useUnifiedCart } from "@/components/unified-cart/UnifiedCartContext";
import {
  PORTS,
  VESSEL_TYPES,
  CONTACT_ROLES,
  CURRENCIES,
} from "@/lib/form-constants";

type FormState = {
  vesselName: string;
  flag: string;
  imo: string;
  vesselType: string;
  port: string;
  eta: string;
  etd: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  company: string;
  currency: string;
  notes: string;
  consent: boolean;
};

const emptyForm: FormState = {
  vesselName: "",
  flag: "",
  imo: "",
  vesselType: "",
  port: "",
  eta: "",
  etd: "",
  contactName: "",
  role: "",
  email: "",
  phone: "",
  company: "",
  currency: "USD",
  notes: "",
  consent: false,
};

type FieldErrors = Partial<Record<keyof FormState | "_root", string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.vesselName.trim()) errors.vesselName = "Requerido";
  if (!form.flag.trim()) errors.flag = "Requerido";
  if (!form.vesselType) errors.vesselType = "Requerido";
  if (!form.port) errors.port = "Requerido";
  if (!form.eta) errors.eta = "Requerido";
  if (!form.contactName.trim()) errors.contactName = "Requerido";
  if (!form.role) errors.role = "Requerido";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Email no válido";
  if (!form.currency) errors.currency = "Requerido";
  if (!form.consent) errors.consent = "Debe aceptar el uso de sus datos";
  return errors;
}

export function RfqContactStep() {
  const { contactOpen, closeContact, entries, clear, customItems } = useRfq();
  const { provisionsItems, provisionsCount, clearProvisions } = useUnifiedCart();
  const locale = useLocale() as "es" | "en";

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");


  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contactOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeContact();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [contactOpen, closeContact]);

  useEffect(() => {
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [contactOpen]);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setServerError("");

    const technicalItems = Object.values(entries).map((e: RfqEntry) => ({
      id: e.item.id,
      name: e.item.name,
      qty: e.qty,
      unit: e.item.unit,
      note: e.note || "",
      categoryId: e.categoryId,
      categoryTitleEs: e.categoryTitleEs,
    }));

    const isUnified = provisionsCount > 0;

    const baseData = {
      vesselName: form.vesselName.trim(),
      flag: form.flag.trim(),
      imo: form.imo.trim() || undefined,
      vesselType: form.vesselType,
      port: form.port,
      eta: form.eta,
      etd: form.etd || undefined,
      contactName: form.contactName.trim(),
      role: form.role,
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      currency: form.currency,
      notes: form.notes.trim() || undefined,
      consent: true as const,
    };

    const validCustomItems = customItems.filter((i) => i.name.trim());

    const payload = isUnified
      ? {
          kind: "unified",
          ...baseData,
          technicalItems,
          provisionsMethod: "catalog" as const,
          provisionsItems: Object.values(provisionsItems),
          customItems: validCustomItems,
        }
      : {
          kind: "technical",
          ...baseData,
          items: technicalItems,
          customItems: validCustomItems,
        };

    const quoteType = isUnified ? "unified" : "technical";

    try {
      const res = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: quoteType, locale, payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setServerError(
          locale === "es"
            ? "Error al enviar. Intente de nuevo o contáctenos por WhatsApp."
            : "Send error. Please try again or contact us on WhatsApp."
        );
      } else {
        setSubmitted(true);
        clear();
        if (isUnified) clearProvisions();
        setForm(emptyForm);
      }
    } catch {
      setServerError(
        locale === "es"
          ? "Error de red. Verifique su conexión."
          : "Network error. Check your connection."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!contactOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={closeContact}
        style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(5,21,41,0.8)" }}
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Datos para cotización"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 51,
          width: "min(560px, calc(100vw - 2rem))",
          maxHeight: "calc(100vh - 4rem)",
          overflowY: "auto",
          background: "#071e38",
          border: "1px solid rgba(201,169,97,0.2)",
          borderRadius: "6px",
          padding: "1.75rem 2rem 2rem",
        }}
      >
        <button
          type="button"
          onClick={closeContact}
          aria-label="Cerrar"
          style={{ position: "absolute", top: "1rem", right: "1rem", color: "rgba(255,255,255,0.4)", padding: "4px" }}
          className="hover:text-cream transition-colors"
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gold" strokeWidth={1.5} />
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#f5f0e8", marginBottom: "0.5rem" }}>
              {locale === "es" ? "Solicitud enviada" : "Request sent"}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              {locale === "es"
                ? "Un coordinador le responderá con la cotización en menos de 2 horas al correo indicado."
                : "A coordinator will respond with pricing within 2 hours to the email provided."}
            </p>
            <button
              type="button"
              onClick={() => { setSubmitted(false); closeContact(); }}
              className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-sm bg-gold text-navy text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-gold-light transition-colors"
            >
              {locale === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.22em", color: "#C9A961", marginBottom: "4px" }}>
                {locale === "es"
                  ? (provisionsCount > 0 ? "Solicitar cotización combinada" : "Solicitar cotización técnica")
                  : (provisionsCount > 0 ? "Request combined quote" : "Request technical quote")}
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#f5f0e8" }}>
                {locale === "es" ? "Datos del buque y contacto" : "Vessel and contact details"}
              </h2>
              {provisionsCount > 0 && (
                <div style={{ marginTop: "0.5rem", fontSize: "12px", color: "rgba(255,255,255,0.5)", background: "rgba(201,169,97,0.06)", border: "1px solid rgba(201,169,97,0.18)", borderRadius: "4px", padding: "0.4rem 0.6rem" }}>
                  {locale === "es"
                    ? `Esta solicitud incluirá ${provisionsCount} producto${provisionsCount !== 1 ? "s" : ""} de provisiones.`
                    : `This request will include ${provisionsCount} provisions product${provisionsCount !== 1 ? "s" : ""}.`}
                </div>
              )}
            </div>

            <Section label={locale === "es" ? "Datos del buque" : "Vessel details"}>
              <Row label={locale === "es" ? "Nombre del buque *" : "Vessel name *"} error={errors.vesselName}>
                <FormInput value={form.vesselName} onChange={(v) => set("vesselName", v)} placeholder="MV Example" />
              </Row>
              <Row label={locale === "es" ? "Bandera *" : "Flag *"} error={errors.flag}>
                <FormInput value={form.flag} onChange={(v) => set("flag", v)} placeholder="Panama" />
              </Row>
              <Row label="IMO" error={errors.imo}>
                <FormInput value={form.imo} onChange={(v) => set("imo", v)} placeholder="9123456 (opcional)" />
              </Row>
              <Row label={locale === "es" ? "Tipo de buque *" : "Vessel type *"} error={errors.vesselType}>
                <FormSelect
                  value={form.vesselType}
                  onChange={(v) => set("vesselType", v)}
                  options={[{ value: "", label: locale === "es" ? "Seleccione…" : "Select…" }, ...VESSEL_TYPES.map((t) => ({ value: t, label: t }))]}
                />
              </Row>
            </Section>

            <Section label={locale === "es" ? "Escala" : "Port call"}>
              <Row label={locale === "es" ? "Puerto *" : "Port *"} error={errors.port}>
                <FormSelect
                  value={form.port}
                  onChange={(v) => set("port", v)}
                  options={[{ value: "", label: locale === "es" ? "Seleccione…" : "Select…" }, ...PORTS.map((p) => ({ value: p, label: p }))]}
                />
              </Row>
              <Row label="ETA *" error={errors.eta}>
                <FormInput type="date" value={form.eta} onChange={(v) => set("eta", v)} />
              </Row>
              <Row label={locale === "es" ? "ETD (opcional)" : "ETD (optional)"} error={errors.etd}>
                <FormInput type="date" value={form.etd} onChange={(v) => set("etd", v)} />
              </Row>
            </Section>

            <Section label={locale === "es" ? "Contacto" : "Contact"}>
              <Row label={locale === "es" ? "Nombre *" : "Name *"} error={errors.contactName}>
                <FormInput value={form.contactName} onChange={(v) => set("contactName", v)} placeholder="John Smith" />
              </Row>
              <Row label={locale === "es" ? "Cargo *" : "Role *"} error={errors.role}>
                <FormSelect
                  value={form.role}
                  onChange={(v) => set("role", v)}
                  options={[{ value: "", label: locale === "es" ? "Seleccione…" : "Select…" }, ...CONTACT_ROLES.map((r) => ({ value: r, label: r }))]}
                />
              </Row>
              <Row label="Email *" error={errors.email}>
                <FormInput type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="captain@vessel.com" />
              </Row>
              <Row label={locale === "es" ? "Teléfono (opcional)" : "Phone (optional)"} error={errors.phone}>
                <FormInput value={form.phone} onChange={(v) => set("phone", v)} placeholder="+1 849 000 0000" />
              </Row>
              <Row label={locale === "es" ? "Empresa (opcional)" : "Company (optional)"} error={errors.company}>
                <FormInput value={form.company} onChange={(v) => set("company", v)} placeholder="Shipping Co." />
              </Row>
            </Section>

            <Section label={locale === "es" ? "Preferencias" : "Preferences"}>
              <Row label={locale === "es" ? "Moneda *" : "Currency *"} error={errors.currency}>
                <FormSelect
                  value={form.currency}
                  onChange={(v) => set("currency", v)}
                  options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                />
              </Row>
              <Row label={locale === "es" ? "Notas adicionales" : "Additional notes"} error={errors.notes}>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder={locale === "es" ? "Instrucciones especiales, urgencias, referencias…" : "Special instructions, urgencies, references…"}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.625rem",
                    fontSize: "13px",
                    color: "#f5f0e8",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "4px",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </Row>
            </Section>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
                marginTop: "1rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                style={{ marginTop: "2px", accentColor: "#C9A961", flexShrink: 0 }}
              />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                {locale === "es"
                  ? "Acepto que mis datos sean usados para procesar esta solicitud de cotización."
                  : "I accept my data being used to process this quote request."}
              </span>
            </label>
            {errors.consent && (
              <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errors.consent}</p>
            )}

            {serverError && (
              <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "0.75rem", textAlign: "center" }}>
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group mt-5 w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-sm bg-gold text-navy hover:bg-gold-light disabled:opacity-60 transition-colors text-[11px] uppercase tracking-[0.22em] font-semibold"
            >
              {submitting
                ? (locale === "es" ? "Enviando…" : "Sending…")
                : (locale === "es" ? "Enviar solicitud" : "Send request")}
              {!submitting && (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.6} />
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "#C9A961",
          fontWeight: 600,
          marginBottom: "0.5rem",
          paddingBottom: "0.35rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "3px" }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "3px" }}>{error}</p>}
    </div>
  );
}

function FormInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        height: "36px",
        padding: "0 0.625rem",
        fontSize: "13px",
        color: "#f5f0e8",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "4px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function FormSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        height: "36px",
        padding: "0 0.625rem",
        fontSize: "13px",
        color: value ? "#f5f0e8" : "rgba(255,255,255,0.35)",
        background: "#071e38",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "4px",
        outline: "none",
        boxSizing: "border-box",
        appearance: "auto",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
