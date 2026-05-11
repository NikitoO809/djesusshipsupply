"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  PORTS,
  VESSEL_TYPES,
  CONTACT_ROLES,
  CURRENCIES,
} from "@/lib/form-constants";
import {
  PROVISION_CATALOG,
  PROVISION_PRODUCT_COUNT,
} from "@/lib/catalog/provisions";
import type { CartItem } from "@/lib/schemas/quote-provisions";
import { useUnifiedCart } from "@/components/unified-cart/UnifiedCartContext";
import { useRfq } from "@/components/procurement/rfq/useRfq";
import type { RfqEntry } from "@/components/procurement/rfq/RfqContext";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

import {
  emptyVessel,
  initialFlowState,
  type ProvisionsMethod,
  type FlowState,
  type VesselContactData,
} from "./types";

// =============================================================
// MAIN ORCHESTRATOR
// =============================================================

export function ProvisionsQuoteFlow() {
  const t = useTranslations("forms.provisiones.flow");
  const tBase = useTranslations("forms");
  const tUnified = useTranslations("forms.unifiedCart");
  const locale = useLocale() as "es" | "en";

  const {
    provisionsItems,
    provisionsCount,
    addProvision,
    removeProvision,
    updateProvisionQty,
    clearProvisions,
  } = useUnifiedCart();

  const rfq = useRfq();

  const [state, setState] = React.useState<FlowState>(initialFlowState);
  const [vesselDraft, setVesselDraft] =
    React.useState<VesselContactData>(emptyVessel);
  const [vesselErrors, setVesselErrors] = React.useState<
    Partial<Record<keyof VesselContactData, string>>
  >({});

  // ----- Step 1: vessel form -----
  const handleVesselSubmit = () => {
    const errors: Partial<Record<keyof VesselContactData, string>> = {};
    const required: Array<keyof VesselContactData> = [
      "vesselName",
      "flag",
      "vesselType",
      "port",
      "eta",
      "contactName",
      "role",
      "email",
    ];
    for (const k of required) {
      if (!vesselDraft[k]) errors[k] = "Required";
    }
    if (vesselDraft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vesselDraft.email)) {
      errors.email = "Invalid email";
    }
    setVesselErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error(tBase("errors.validation"));
      return;
    }
    setState((s) => ({ ...s, vessel: vesselDraft, step: 3 }));
  };

  // ----- Step 2: method + sub-views -----
  const goBackToMethods = () =>
    setState((s) => ({ ...s, view: "methods", method: null, file: null }));

  const selectMethod = (method: ProvisionsMethod) => {
    const view: FlowState["view"] =
      method === "catalog"
        ? "catalog"
        : method === "template"
        ? "template"
        : "upload";
    setState((s) => ({ ...s, method, view }));
  };

  const cartItems = Object.values(provisionsItems);
  const cartCount = provisionsCount;

  // Cart operations delegated to UnifiedCartContext
  const addToCart = (item: CartItem) => addProvision(item);
  const removeFromCart = (id: string) => removeProvision(id);
  const updateQty = (id: string, qty: number) => updateProvisionQty(id, qty);

  const setFile = (file: File | null) => setState((s) => ({ ...s, file }));

  // Step 1 → Step 2 transition (cart validated, go to vessel form)
  const proceedToVessel = () => {
    if (state.method === "catalog" && cartCount === 0) {
      toast.error(t("catalog.cart.emptyTitle"));
      return;
    }
    if ((state.method === "upload" || state.method === "template") && !state.file) {
      toast.error(t("upload.fileTooLarge"));
      return;
    }
    setState((s) => ({ ...s, step: 2 }));
  };

  // Derive technical items from rfq entries for unified submit
  const technicalItems = Object.values(rfq.entries).map((e: RfqEntry) => ({
    id: e.item.id,
    name: e.item.name,
    qty: e.qty,
    unit: e.item.unit,
    note: e.note,
    categoryId: e.categoryId,
    categoryTitleEs: e.categoryTitleEs,
  }));
  const isUnified = rfq.count > 0;

  // Step 3: submit
  const submit = async () => {
    if (!state.vessel || !state.method) return;
    if (!state.consent) {
      toast.error(tBase("errors.validation"));
      return;
    }
    if (!state.currency) {
      toast.error(tBase("errors.validation"));
      return;
    }

    setState((s) => ({ ...s, submitting: true }));

    try {
      const baseData = {
        ...state.vessel,
        consent: true as const,
        currency: state.currency as "USD" | "EUR" | "DOP",
        notes: state.notes || "",
      };

      let res: Response;

      if (isUnified) {
        // Unified quote: technical + provisions in one request
        const payload = {
          kind: "unified",
          ...baseData,
          technicalItems,
          provisionsMethod: state.method,
          provisionsItems: cartItems,
          ...(state.file
            ? {
                fileName: state.file.name,
                fileSize: state.file.size,
                fileType: state.file.type || "application/octet-stream",
              }
            : {}),
        };

        if (state.file) {
          const fd = new FormData();
          fd.append("type", "unified");
          fd.append("locale", locale);
          fd.append("payload", JSON.stringify(payload));
          fd.append("file", state.file);
          res = await fetch("/api/cotizar", { method: "POST", body: fd });
        } else {
          res = await fetch("/api/cotizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "unified", locale, payload }),
          });
        }
      } else {
        // Provisions-only submit
        let payload: unknown;
        let useMultipart = false;

        if (state.method === "catalog") {
          payload = { ...baseData, method: "catalog", items: cartItems };
        } else {
          const file = state.file!;
          payload = {
            ...baseData,
            method: state.method,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || "application/octet-stream",
            extraItems: cartItems,
          };
          useMultipart = true;
        }

        if (useMultipart) {
          const fd = new FormData();
          fd.append("type", "provisions");
          fd.append("locale", locale);
          fd.append("payload", JSON.stringify(payload));
          fd.append("file", state.file!);
          res = await fetch("/api/cotizar", { method: "POST", body: fd });
        } else {
          res = await fetch("/api/cotizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "provisions", locale, payload }),
          });
        }
      }

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        toast.error(data.message || tBase("errors.generic"));
        setState((s) => ({ ...s, submitting: false }));
        return;
      }

      // Success — clear both carts
      clearProvisions();
      if (isUnified) rfq.clear();
      setState((s) => ({ ...s, submitting: false, submitted: true }));
    } catch {
      toast.error(tBase("errors.network"));
      setState((s) => ({ ...s, submitting: false }));
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (state.submitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="space-y-8">
      {/* Banner: technical supplies already in cart */}
      {isUnified && (
        <div className="mx-auto max-w-2xl rounded-md border border-gold/40 bg-gold/5 px-5 py-4 flex items-start gap-3">
          <div className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-gold text-navy flex items-center justify-center text-[10px] font-bold">
            {rfq.count}
          </div>
          <div className="text-sm">
            <strong className="block text-navy font-semibold">
              {tUnified("flowTechnicalBanner.title", { count: rfq.count })}
            </strong>
            <span className="text-charcoal/70 font-light">
              {tUnified("flowTechnicalBanner.body")}
            </span>
          </div>
        </div>
      )}

      <Stepper step={state.step} />

      {state.step === 1 && (
        <StepMethod
          state={state}
          cart={provisionsItems}
          onSelectMethod={selectMethod}
          onBackToMethods={goBackToMethods}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onUpdateQty={updateQty}
          onSetFile={setFile}
          onProceed={proceedToVessel}
        />
      )}

      {state.step === 2 && (
        <StepVessel
          data={vesselDraft}
          errors={vesselErrors}
          onChange={setVesselDraft}
          onSubmit={handleVesselSubmit}
          onBack={() => setState((s) => ({ ...s, step: 1 }))}
        />
      )}

      {state.step === 3 && (
        <StepReview
          state={state}
          cart={provisionsItems}
          rfqEntries={isUnified ? rfq.entries : {}}
          onChangeNotes={(notes) => setState((s) => ({ ...s, notes }))}
          onChangeCurrency={(currency) =>
            setState((s) => ({ ...s, currency }))
          }
          onChangeConsent={(consent) => setState((s) => ({ ...s, consent }))}
          onBack={() => setState((s) => ({ ...s, step: 2 }))}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

// =============================================================
// STEPPER
// =============================================================

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const t = useTranslations("forms.provisiones.flow.stepper");
  const labels = [t("order"), t("vessel"), t("review")];
  const widthPct = step === 1 ? 0 : step === 2 ? 50 : 100;

  return (
    <div className="relative mx-auto max-w-2xl px-2 py-4">
      <div className="absolute inset-x-6 top-[34px] h-px bg-border" />
      <div
        className="absolute left-6 top-[34px] h-px bg-gold transition-all duration-500"
        style={{ width: `calc(${widthPct}% - ${widthPct === 0 ? 0 : 24}px)` }}
      />
      <div className="relative grid grid-cols-3 gap-2">
        {labels.map((label, idx) => {
          const n = idx + 1;
          const isActive = n === step;
          const isComplete = n < step;
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 font-serif text-base transition-all",
                  isComplete
                    ? "border-navy bg-navy text-cream"
                    : isActive
                    ? "border-gold bg-gold text-navy shadow-[0_0_0_6px_rgba(201,169,97,0.15)]"
                    : "border-border bg-background text-charcoal/60",
                ].join(" ")}
              >
                {isComplete ? "✓" : n}
              </div>
              <div
                className={[
                  "text-center text-[10px] uppercase tracking-[0.18em] font-mono",
                  isActive
                    ? "text-navy font-bold"
                    : isComplete
                    ? "text-gold"
                    : "text-charcoal/60",
                ].join(" ")}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================
// STEP 1: VESSEL FORM
// =============================================================

function StepVessel({
  data,
  errors,
  onChange,
  onSubmit,
  onBack,
}: {
  data: VesselContactData;
  errors: Partial<Record<keyof VesselContactData, string>>;
  onChange: (data: VesselContactData) => void;
  onSubmit: () => void;
  onBack?: () => void;
}) {
  const t = useTranslations("forms.fields");
  const tSec = useTranslations("forms.sections");
  const tPlace = useTranslations("forms.placeholders");
  const tCommon = useTranslations("forms.provisiones.flow.common");

  const set = <K extends keyof VesselContactData>(
    key: K,
    val: VesselContactData[K]
  ) => onChange({ ...data, [key]: val });

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Section title={tSec("vessel")}>
        <Grid>
          <Field label={t("vesselName")} required error={errors.vesselName}>
            <Input
              value={data.vesselName}
              onChange={(e) => set("vesselName", e.target.value)}
            />
          </Field>
          <Field label={t("flag")} required error={errors.flag}>
            <Input
              value={data.flag}
              onChange={(e) => set("flag", e.target.value)}
            />
          </Field>
          <Field label={t("imo")}>
            <Input
              value={data.imo}
              onChange={(e) => set("imo", e.target.value)}
            />
          </Field>
          <Field label={t("vesselType")} required error={errors.vesselType}>
            <Select
              value={data.vesselType}
              onValueChange={(v) => set("vesselType", v ?? "")}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder={tPlace("select")} />
              </SelectTrigger>
              <SelectContent>
                {VESSEL_TYPES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Grid>
      </Section>

      <Section title={tSec("portCall")}>
        <Grid>
          <Field label={t("port")} required error={errors.port}>
            <Select value={data.port} onValueChange={(v) => set("port", v ?? "")}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder={tPlace("select")} />
              </SelectTrigger>
              <SelectContent>
                {PORTS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("eta")} required error={errors.eta}>
            <Input
              type="date"
              value={data.eta}
              onChange={(e) => set("eta", e.target.value)}
            />
          </Field>
          <Field label={t("etd")}>
            <Input
              type="date"
              value={data.etd}
              onChange={(e) => set("etd", e.target.value)}
            />
          </Field>
        </Grid>
      </Section>

      <Section title={tSec("contact")}>
        <Grid>
          <Field
            label={t("contactName")}
            required
            error={errors.contactName}
          >
            <Input
              value={data.contactName}
              onChange={(e) => set("contactName", e.target.value)}
            />
          </Field>
          <Field label={t("role")} required error={errors.role}>
            <Select value={data.role} onValueChange={(v) => set("role", v ?? "")}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder={tPlace("select")} />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t("email")} required error={errors.email}>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label={t("phone")}>
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label={t("company")}>
            <Input
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </Field>
        </Grid>
      </Section>

      <div className="flex justify-between gap-3">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            ← {tCommon("back")}
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg" className="min-w-44">
          {tCommon("next")} →
        </Button>
      </div>
    </form>
  );
}

// =============================================================
// STEP 2: METHOD SELECTION + SUB-VIEWS
// =============================================================

function StepMethod({
  state,
  cart,
  onSelectMethod,
  onBackToMethods,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQty,
  onSetFile,
  onProceed,
}: {
  state: FlowState;
  cart: Record<string, CartItem>;
  onSelectMethod: (m: ProvisionsMethod) => void;
  onBackToMethods: () => void;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onSetFile: (file: File | null) => void;
  onProceed: () => void;
}) {
  if (state.view === "methods") {
    return (
      <MethodPicker onSelect={onSelectMethod} />
    );
  }
  if (state.view === "catalog") {
    return (
      <CatalogView
        cart={cart}
        onBack={onBackToMethods}
        onAdd={onAddToCart}
        onRemove={onRemoveFromCart}
        onUpdateQty={onUpdateQty}
        onProceed={onProceed}
      />
    );
  }
  if (state.view === "template") {
    return (
      <TemplateView
        file={state.file}
        onBack={onBackToMethods}
        onFile={onSetFile}
        onSwitchToUpload={() => onSelectMethod("upload")}
        onProceed={onProceed}
      />
    );
  }
  return (
    <UploadView
      file={state.file}
      onBack={onBackToMethods}
      onFile={onSetFile}
      onSwitchToCatalog={() => onSelectMethod("catalog")}
      onProceed={onProceed}
    />
  );
}

// ---------- Method Picker (3 cards) ----------

function MethodPicker({
  onSelect,
}: {
  onSelect: (m: ProvisionsMethod) => void;
}) {
  const t = useTranslations("forms.provisiones.flow.methods");

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-serif text-3xl md:text-4xl text-navy">
          {t("title")} <em className="not-italic text-gold italic">{t("titleEm")}</em>?
        </h2>
        <p className="mx-auto max-w-2xl text-charcoal/70 font-light">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MethodCard
          recommended
          badge={t("recommended")}
          icon={<IconCart />}
          title={t("catalog.title")}
          titleEm={t("catalog.titleEm")}
          subtitle={t("catalog.subtitle")}
          desc={t("catalog.desc")}
          time={t("catalog.time")}
          cta={t("catalog.cta")}
          onClick={() => onSelect("catalog")}
        />
        <MethodCard
          icon={<IconDownload />}
          title={t("template.title")}
          titleEm={t("template.titleEm")}
          subtitle={t("template.subtitle")}
          desc={t("template.desc")}
          time={t("template.time")}
          cta={t("template.cta")}
          onClick={() => onSelect("template")}
        />
        <MethodCard
          icon={<IconUpload />}
          title={t("upload.title")}
          titleEm={t("upload.titleEm")}
          subtitle={t("upload.subtitle")}
          desc={t("upload.desc")}
          time={t("upload.time")}
          cta={t("upload.cta")}
          onClick={() => onSelect("upload")}
        />
      </div>

      <div className="mx-auto max-w-2xl flex items-center gap-4 rounded-md border border-border border-l-[3px] border-l-gold bg-background p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <div className="text-sm text-charcoal/80 font-light">
          <strong className="block text-navy font-semibold mb-1">
            {t("combineTitle")}
          </strong>
          {t("combineBody")}
        </div>
      </div>
    </div>
  );
}

function MethodCard({
  recommended,
  badge,
  icon,
  title,
  titleEm,
  subtitle,
  desc,
  time,
  cta,
  onClick,
}: {
  recommended?: boolean;
  badge?: string;
  icon: React.ReactNode;
  title: string;
  titleEm: string;
  subtitle: string;
  desc: string;
  time: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex flex-col items-start text-left rounded-md border p-7 transition-all overflow-hidden",
        recommended
          ? "border-gold bg-gradient-to-b from-background to-cream/30"
          : "border-border bg-background hover:-translate-y-1 hover:border-gold hover:shadow-lg",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-0 right-0 top-0 h-[3px] bg-gold origin-left transition-transform",
          recommended ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        ].join(" ")}
      />
      {recommended && badge ? (
        <span className="absolute right-3 top-3 rounded-sm bg-gold px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-navy">
          {badge}
        </span>
      ) : null}
      <div
        className={[
          "mb-5 flex h-14 w-14 items-center justify-center rounded-md transition-all",
          recommended
            ? "bg-navy text-gold-light"
            : "bg-cream text-navy group-hover:bg-navy group-hover:text-gold-light group-hover:scale-105",
        ].join(" ")}
      >
        {icon}
      </div>
      <h3 className="font-serif text-2xl text-navy mb-1">
        {title}{" "}
        <em className="not-italic text-gold italic">{titleEm}</em>
      </h3>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-3">
        {subtitle}
      </div>
      <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-5 flex-1">
        {desc}
      </p>
      <div className="w-full border-t border-border pt-3 mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/60">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-gold">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {time}
      </div>
      <span className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-navy px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-cream group-hover:bg-gold group-hover:text-navy transition-colors">
        {cta}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </button>
  );
}

// ---------- Catalog View (with cart sidebar) ----------

function CatalogView({
  cart,
  onBack,
  onAdd,
  onRemove,
  onUpdateQty,
  onProceed,
}: {
  cart: Record<string, CartItem>;
  onBack: () => void;
  onAdd: (item: CartItem) => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onProceed: () => void;
}) {
  const t = useTranslations("forms.provisiones.flow.catalog");
  const tCommon = useTranslations("forms.provisiones.flow.common");

  const [activeKey, setActiveKey] = React.useState(PROVISION_CATALOG[0].key);
  const [search, setSearch] = React.useState("");

  const activeCategory = PROVISION_CATALOG.find((c) => c.key === activeKey)!;

  const visibleProducts = React.useMemo(() => {
    if (!search.trim()) {
      return activeCategory.products.map((p) => ({
        ...p,
        category: activeCategory.key,
        categoryName: activeCategory.name.es,
      }));
    }
    const q = search.toLowerCase();
    const out: Array<
      (typeof activeCategory.products)[number] & {
        category: string;
        categoryName: string;
      }
    > = [];
    for (const cat of PROVISION_CATALOG) {
      for (const p of cat.products) {
        if (p.name.toLowerCase().includes(q)) {
          out.push({
            ...p,
            category: cat.key,
            categoryName: cat.name.es,
          });
        }
      }
    }
    return out;
  }, [activeCategory, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackRow onClick={onBack} label={tCommon("changeMethod")} />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
        <div className="space-y-5 min-w-0">
          <div>
            <Eyebrow>
              {t("eyebrow", { count: PROVISION_PRODUCT_COUNT })}
            </Eyebrow>
            <h2 className="font-serif text-3xl text-navy mt-2">
              {t("title")} <em className="not-italic text-gold italic">{t("titleEm")}</em>
            </h2>
            <p className="text-charcoal/70 font-light mt-1">{t("subtitle")}</p>
          </div>

          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/50"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <Input
              className="h-11 pl-10"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {!search.trim() && (
            <div className="flex gap-1 overflow-x-auto rounded-md border border-border bg-background p-1">
              {PROVISION_CATALOG.map((cat) => {
                const isActive = cat.key === activeKey;
                const inCart = Object.values(cart).filter(
                  (i) => i.category === cat.key
                ).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveKey(cat.key)}
                    className={[
                      "shrink-0 inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-navy text-gold-light"
                        : "text-charcoal/70 hover:bg-cream hover:text-navy",
                    ].join(" ")}
                  >
                    <span>{cat.name.es}</span>
                    <span
                      className={[
                        "font-mono text-[10px] rounded-sm px-1.5 py-0.5",
                        isActive ? "bg-white/10" : "bg-cream",
                      ].join(" ")}
                    >
                      {cat.products.length}
                    </span>
                    {inCart > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {visibleProducts.length === 0 ? (
            <div className="rounded-md border border-border bg-background p-10 text-center">
              <p className="text-sm text-charcoal/60 font-light">
                {t("noResults")} &ldquo;<strong>{search}</strong>&rdquo;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {visibleProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  cartItem={cart[p.id]}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onUpdateQty={onUpdateQty}
                />
              ))}
            </div>
          )}
        </div>

        <CartSidebar
          cart={cart}
          onRemove={onRemove}
          onProceed={onProceed}
        />
      </div>
    </div>
  );
}

function ProductCard({
  product,
  cartItem,
  onAdd,
  onRemove,
  onUpdateQty,
}: {
  product: { id: string; name: string; unit: string; category: string; categoryName: string };
  cartItem?: CartItem;
  onAdd: (item: CartItem) => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  const t = useTranslations("forms.provisiones.flow.catalog");
  const [draftQty, setDraftQty] = React.useState(1);
  const inCart = !!cartItem;
  const qty = cartItem?.qty ?? draftQty;

  const handleToggle = () => {
    if (inCart) onRemove(product.id);
    else
      onAdd({
        id: product.id,
        name: product.name,
        unit: product.unit,
        qty: draftQty,
        category: product.category,
        categoryName: product.categoryName,
      });
  };

  const setQty = (val: number) => {
    if (inCart) onUpdateQty(product.id, val);
    else setDraftQty(Math.max(1, val));
  };

  return (
    <div
      className={[
        "rounded-md border p-4 flex flex-col gap-3 transition-all relative",
        inCart
          ? "border-gold bg-gradient-to-b from-background to-cream/30"
          : "border-border bg-background hover:border-gold hover:shadow-md hover:-translate-y-0.5",
      ].join(" ")}
    >
      {inCart && (
        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-navy">
          ✓
        </span>
      )}
      <div className="pr-6">
        <div className="text-sm font-semibold text-navy leading-tight">
          {product.name}
        </div>
        {product.unit ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-charcoal/60 mt-1">
            {product.unit}
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <div className="flex items-center bg-cream border border-border rounded-sm overflow-hidden flex-1">
          <button
            type="button"
            className="h-9 w-9 hover:bg-gold/15 text-navy font-bold"
            onClick={() => setQty(qty - 1)}
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            className="flex-1 w-full bg-transparent text-center text-sm font-semibold text-navy outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            className="h-9 w-9 hover:bg-gold/15 text-navy font-bold"
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={[
            "h-9 px-4 rounded-sm font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors whitespace-nowrap",
            inCart
              ? "bg-emerald-700 text-white"
              : "bg-gold text-navy hover:bg-gold-light",
          ].join(" ")}
        >
          {inCart ? "✓" : t("addBtn")}
        </button>
      </div>
    </div>
  );
}

function CartSidebar({
  cart,
  onRemove,
  onProceed,
}: {
  cart: Record<string, CartItem>;
  onRemove: (id: string) => void;
  onProceed: () => void;
}) {
  const t = useTranslations("forms.provisiones.flow.catalog.cart");

  const items = Object.values(cart);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const cats = new Set(items.map((i) => i.category));

  // Group by category
  const groups = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    (acc[item.categoryName] ??= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="lg:sticky lg:top-24 rounded-md border border-border bg-background overflow-hidden flex flex-col max-h-[calc(100vh-7rem)]">
      <div className="bg-navy text-cream px-5 py-4 border-b-2 border-gold">
        <div className="font-serif text-xl">
          {t("title")}{" "}
          <em className="not-italic text-gold-light italic">{t("titleEm")}</em>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mt-1">
          {t("count", { products: items.length, categories: cats.size })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 max-h-96 lg:max-h-none">
        {items.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border text-navy/50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-sm font-light text-charcoal/70">
              <strong className="block text-navy font-semibold mb-1">
                {t("emptyTitle")}
              </strong>
              {t("emptyBody")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groups).map(([catName, list]) => (
              <div key={catName}>
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold border-b border-border pb-1.5 mb-1.5">
                  {catName} · {list.length}
                </div>
                {list.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-navy truncate">
                        {it.name}
                      </div>
                      <div className="font-mono text-[10px] text-charcoal/60">
                        <strong className="text-gold">{it.qty}</strong>{" "}
                        {it.unit}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(it.id)}
                      className="p-1.5 text-charcoal/50 hover:text-red-600 transition-colors"
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-cream/50 border-t border-border px-5 py-4">
        <div className="flex items-baseline justify-between border-b border-border pb-3 mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/60">
            {t("total")}
          </span>
          <span className="font-serif text-2xl text-navy">
            <em className="text-gold not-italic italic">{totalQty}</em>
          </span>
        </div>
        <Button
          type="button"
          onClick={onProceed}
          disabled={items.length === 0}
          className="w-full"
          size="lg"
        >
          {t("review")} →
        </Button>
        <p className="text-[11px] text-charcoal/60 text-center mt-3 italic font-light">
          {t("note")}
        </p>
      </div>
    </aside>
  );
}

// ---------- Template View ----------

function TemplateView({
  file,
  onBack,
  onFile,
  onSwitchToUpload,
  onProceed,
}: {
  file: File | null;
  onBack: () => void;
  onFile: (file: File | null) => void;
  onSwitchToUpload: () => void;
  onProceed: () => void;
}) {
  const t = useTranslations("forms.provisiones.flow.template");
  const tCommon = useTranslations("forms.provisiones.flow.common");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <BackRow onClick={onBack} label={tCommon("changeMethod")} />

      <div className="text-center space-y-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-serif text-3xl text-navy">
          {t("title")} <em className="not-italic text-gold italic">{t("titleEm")}</em>
        </h2>
        <p className="text-charcoal/70 font-light">{t("subtitle")}</p>
      </div>

      <div className="rounded-md border border-border bg-background p-10 text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-md bg-navy text-gold-light flex items-center justify-center">
          <IconExcel />
        </div>
        <h3 className="font-serif text-2xl text-navy mb-2">
          {t("cardTitle")}{" "}
          <em className="not-italic text-gold italic">{t("cardTitleEm")}</em>
        </h3>
        <p className="text-sm text-charcoal/70 font-light max-w-md mx-auto mb-6">
          {t("cardDesc")}
        </p>

        <div className="grid grid-cols-3 gap-3 my-6">
          <Stat n={String(PROVISION_CATALOG.length)} label={t("stats.categories")} />
          <Stat n={String(PROVISION_PRODUCT_COUNT)} label={t("stats.products")} />
          <Stat n={String(PROVISION_CATALOG.length + 2)} label={t("stats.sheets")} />
        </div>

        <div className="text-left bg-cream/50 rounded-sm border border-border p-5 my-6 space-y-2">
          <Step n={1} text={t("steps.s1")} />
          <Step n={2} text={t("steps.s2")} />
          <Step n={3} text={t("steps.s3")} />
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <a
            href="/plantilla-provisiones.xlsx"
            download
            className={buttonVariants({ size: "lg" }) + " min-w-44"}
          >
            <IconDownload /> {t("downloadBtn")}
          </a>
          <Button
            size="lg"
            variant="outline"
            className="border-gold text-navy hover:bg-gold hover:text-navy"
            onClick={onSwitchToUpload}
          >
            {t("alreadyHaveBtn")} →
          </Button>
        </div>
      </div>

      <Dropzone file={file} onFile={onFile} onProceed={onProceed} />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-background rounded-sm border border-border p-4">
      <div className="font-serif text-3xl text-gold leading-none">{n}</div>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-charcoal/60 mt-1.5">
        {label}
      </div>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="shrink-0 h-6 w-6 rounded-full bg-gold text-navy font-mono text-[11px] font-bold flex items-center justify-center">
        {n}
      </div>
      <div className="text-sm text-charcoal/80 font-light leading-snug">
        {text}
      </div>
    </div>
  );
}

// ---------- Upload View ----------

function UploadView({
  file,
  onBack,
  onFile,
  onSwitchToCatalog,
  onProceed,
}: {
  file: File | null;
  onBack: () => void;
  onFile: (file: File | null) => void;
  onSwitchToCatalog: () => void;
  onProceed: () => void;
}) {
  const t = useTranslations("forms.provisiones.flow.upload");
  const tCommon = useTranslations("forms.provisiones.flow.common");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <BackRow onClick={onBack} label={tCommon("changeMethod")} />

      <div className="text-center space-y-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-serif text-3xl text-navy">
          {t("title")} <em className="not-italic text-gold italic">{t("titleEm")}</em>
        </h2>
        <p className="text-charcoal/70 font-light">{t("subtitle")}</p>
      </div>

      <Dropzone file={file} onFile={onFile} onProceed={onProceed} variant="full" />

      <div className="rounded-md border border-border border-l-[3px] border-l-gold bg-background p-5 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="text-sm font-semibold text-navy mb-1">
            {t("combineTitle")}
          </div>
          <div className="text-sm text-charcoal/70 font-light">
            {t("combineDesc")}
          </div>
        </div>
        <Button
          variant="outline"
          className="border-gold text-navy hover:bg-gold hover:text-navy"
          onClick={onSwitchToCatalog}
        >
          {t("combineBtn")}
        </Button>
      </div>

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          ← {tCommon("back")}
        </Button>
        <Button
          size="lg"
          disabled={!file}
          onClick={onProceed}
          className="min-w-44"
        >
          {tCommon("next")} →
        </Button>
      </div>
    </div>
  );
}

// ---------- Dropzone (shared) ----------

function Dropzone({
  file,
  onFile,
  variant = "compact",
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  onProceed?: () => void;
  variant?: "compact" | "full";
}) {
  const t = useTranslations("forms.provisiones.flow.upload");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState(false);

  const handle = (f: File | null | undefined) => {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      toast.error(t("fileTooLarge"));
      return;
    }
    onFile(f);
  };

  const formats = [".xlsx", ".xls", ".pdf", ".docx", ".csv", ".jpg", ".png"];

  if (file) {
    const sizeKB = file.size / 1024;
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${sizeKB.toFixed(0)} KB`;
    return (
      <div className="rounded-md border border-gold bg-background p-5 flex items-center gap-4">
        <div className="shrink-0 h-12 w-12 rounded-md bg-gold/15 text-gold flex items-center justify-center">
          <IconFile />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-navy truncate">
            {file.name}
          </div>
          <div className="font-mono text-xs text-charcoal/60 mt-0.5">
            {sizeStr}{" "}
            <span className="mx-2 opacity-40">·</span>
            <span className="text-emerald-700 font-semibold">
              ✓ {t("received")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            {t("changeBtn")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover:border-red-600 hover:text-red-600"
            onClick={() => onFile(null)}
          >
            {t("removeBtn")}
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={formats.join(",")}
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files?.[0]);
        }}
        className={[
          "w-full block rounded-md border-2 border-dashed text-center transition-all",
          variant === "full" ? "py-16 px-10" : "py-10 px-6",
          drag
            ? "border-gold bg-cream/40 scale-[1.01]"
            : "border-border bg-background hover:border-gold hover:bg-cream/30",
        ].join(" ")}
      >
        <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-cream flex items-center justify-center text-navy">
          <IconUpload size={28} />
        </div>
        <h3 className="font-serif text-2xl text-navy mb-1">
          {t("dropzoneTitle")}{" "}
          <em className="not-italic text-gold italic">{t("dropzoneTitleEm")}</em>
        </h3>
        <p className="text-sm text-charcoal/70 font-light mb-4">
          {t("dropzoneSub")}
        </p>
        <div className="flex flex-wrap gap-1.5 justify-center mt-4">
          {formats.map((f) => (
            <span
              key={f}
              className="font-mono text-[10px] tracking-[0.1em] text-navy/70 bg-cream border border-border rounded-sm px-2 py-1"
            >
              {f}
            </span>
          ))}
        </div>
        <div className="font-mono text-[10px] tracking-[0.1em] text-charcoal/60 mt-3">
          {t("dropzoneLimit")}
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={formats.join(",")}
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </>
  );
}

// =============================================================
// STEP 3: REVIEW
// =============================================================

function StepReview({
  state,
  cart,
  rfqEntries,
  onChangeNotes,
  onChangeCurrency,
  onChangeConsent,
  onBack,
  onSubmit,
}: {
  state: FlowState;
  cart: Record<string, CartItem>;
  rfqEntries: Record<string, RfqEntry>;
  onChangeNotes: (s: string) => void;
  onChangeCurrency: (c: "USD" | "EUR" | "DOP") => void;
  onChangeConsent: (b: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const t = useTranslations("forms.provisiones.flow.review");
  const tCommon = useTranslations("forms.provisiones.flow.common");
  const tPlace = useTranslations("forms.placeholders");
  const tBaseFields = useTranslations("forms.fields");
  const tUpload = useTranslations("forms.provisiones.flow.upload");
  const tUnified = useTranslations("forms.unifiedCart");

  if (!state.vessel || !state.method) return null;
  const v = state.vessel;
  const items = Object.values(cart);
  const rfqItems = Object.values(rfqEntries);
  const isUnified = rfqItems.length > 0;

  const methodLabel =
    state.method === "catalog"
      ? t("methodCatalog")
      : state.method === "template"
      ? t("methodTemplate")
      : t("methodUpload");

  // Group rfq items by category for the review
  const rfqGroups = rfqItems.reduce<Record<string, RfqEntry[]>>((acc, e) => {
    (acc[e.categoryTitleEs] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="font-serif text-3xl text-navy">
          {t("title")} <em className="not-italic text-gold italic">{t("titleEm")}</em>
        </h2>
        <p className="text-charcoal/70 font-light">{t("subtitle")}</p>
      </div>

      {isUnified && (
        <div className="rounded-md border border-gold/40 bg-gold/5 px-5 py-3 text-sm text-charcoal/80 font-light">
          {tUnified("reviewCombinedNote")}
        </div>
      )}

      {/* Vessel summary */}
      <ReviewBlock
        title={t("vesselSection")}
        rows={[
          [tBaseFields("vesselName"), v.vesselName],
          [tBaseFields("flag"), v.flag],
          [tBaseFields("vesselType"), v.vesselType],
          [tBaseFields("port"), v.port],
          [tBaseFields("eta"), v.eta],
          [tBaseFields("contactName"), v.contactName],
          [tBaseFields("email"), v.email],
        ]}
      />

      {/* Technical supplies section (unified only) */}
      {isUnified && (
        <div className="rounded-md border border-border bg-background overflow-hidden">
          <div className="bg-navy/5 px-5 py-3 border-b border-border">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
              {tUnified("reviewTechnicalSection")}
            </h3>
          </div>
          <div className="px-5 py-4 space-y-4">
            {Object.entries(rfqGroups).map(([catName, entries]) => (
              <div key={catName}>
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-charcoal/60 border-b border-border pb-1.5 mb-1.5">
                  {catName} · {entries.length}
                </div>
                <div className="border border-border rounded-sm divide-y divide-border">
                  {entries.map((e) => (
                    <div
                      key={e.item.id}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span className="text-navy">{e.item.name}</span>
                      <span className="font-mono text-xs text-charcoal/70">
                        <strong className="text-gold">{e.qty}</strong>{" "}
                        {e.item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provisions / Order summary */}
      <div className="rounded-md border border-border bg-background overflow-hidden">
        <div className="bg-cream/50 px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
            {isUnified ? tUnified("reviewProvisionsSection") : t("orderSection")}
          </h3>
          <span className="font-mono text-[10px] text-charcoal/60">
            {methodLabel}
          </span>
        </div>
        <div className="px-5 py-4 space-y-3">
          {(state.method === "upload" || state.method === "template") &&
            state.file && (
              <div className="flex items-center gap-3 rounded-sm bg-cream/40 border border-border p-3">
                <IconFile />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/60">
                    {t("fileLabel")}
                  </div>
                  <div className="text-sm font-semibold text-navy truncate">
                    {state.file.name}
                  </div>
                </div>
              </div>
            )}

          {items.length > 0 && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/60 mb-2">
                {state.method === "catalog"
                  ? t("itemsLabel")
                  : t("extraItemsLabel")}{" "}
                · {items.length}
              </div>
              <div className="border border-border rounded-sm divide-y divide-border max-h-64 overflow-y-auto">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span className="text-navy">{it.name}</span>
                    <span className="font-mono text-xs text-charcoal/70">
                      <strong className="text-gold">{it.qty}</strong> {it.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Currency + notes */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>
            {t("currencyLabel")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Select
            value={state.currency}
            onValueChange={(v) => {
              if (v) onChangeCurrency(v as "USD" | "EUR" | "DOP");
            }}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder={tPlace("select")} />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("notesLabel")}</Label>
          <Textarea
            rows={3}
            value={state.notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder={tUpload("extrasPlaceholder")}
          />
        </div>
      </div>

      {/* Consent */}
      <div className="rounded-md border border-border bg-cream/40 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={state.consent}
            onCheckedChange={(c) => onChangeConsent(c === true)}
          />
          <Label className="text-charcoal text-sm font-light">
            {tBaseFields("consent")}
          </Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-2">
        <Button variant="outline" onClick={onBack} disabled={state.submitting}>
          ← {tCommon("back")}
        </Button>
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={state.submitting || !state.consent || !state.currency}
          className="min-w-48"
        >
          {state.submitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> {tCommon("submitting")}
            </span>
          ) : (
            <>
              {tCommon("submit")} →
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ReviewBlock({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <div className="rounded-md border border-border bg-background overflow-hidden">
      <div className="bg-cream/50 px-5 py-3 border-b border-border">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
          {title}
        </h3>
      </div>
      <dl className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/60">
              {label}
            </dt>
            <dd className="text-navy font-medium">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// =============================================================
// SUCCESS
// =============================================================

function SuccessScreen() {
  const t = useTranslations("forms.provisiones.flow.review");
  return (
    <div className="rounded-md border border-gold/40 bg-cream/40 p-12 text-center max-w-2xl mx-auto">
      <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gold/15 text-gold flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl text-navy">{t("successTitle")}</h2>
      <p className="mt-3 mx-auto max-w-prose text-charcoal/80 font-light">
        {t("successBody")}
      </p>
    </div>
  );
}

// =============================================================
// HELPERS / SHARED ATOMS
// =============================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-gold font-semibold">
        {title}
      </h2>
      <div className="space-y-5 rounded-md border border-border bg-background p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
      {children}
    </div>
  );
}

function BackRow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-charcoal/70 hover:border-gold hover:text-navy transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

// ---------- icons ----------

function IconCart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconUpload({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function IconExcel() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}
