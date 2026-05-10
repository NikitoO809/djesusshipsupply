"use client";

import * as React from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

import {
  PORTS,
  VESSEL_TYPES,
  CONTACT_ROLES,
  CURRENCIES,
  PROVISION_CATEGORIES,
  WASTE_TYPES,
  WASTE_MODES,
  TECH_SERVICES,
} from "@/lib/form-constants";
import type { QuoteProvisionsInput } from "@/lib/schemas/quote-provisions";
import type { QuoteMarpolInput } from "@/lib/schemas/quote-marpol";

type Props =
  | { type: "provisions" }
  | { type: "marpol" };

type FormValues = QuoteProvisionsInput | QuoteMarpolInput;

const baseDefaults = {
  vesselName: "",
  flag: "",
  imo: "",
  vesselType: undefined,
  port: undefined,
  eta: "",
  etd: "",
  contactName: "",
  role: undefined,
  email: "",
  phone: "",
  company: "",
  consent: false,
};

const provisionsDefaults = {
  ...baseDefaults,
  categories: [] as string[],
  notes: "",
  currency: undefined,
} as unknown as QuoteProvisionsInput;

const marpolDefaults = {
  ...baseDefaults,
  wasteTypes: [] as string[],
  techServices: [] as string[],
  volume: "",
  mode: undefined,
  additionalNotes: "",
} as unknown as QuoteMarpolInput;

function makeResolver(isProvisions: boolean): Resolver<FormValues> {
  const req = "Required";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return async (values) => {
    const errors: Record<string, { type: string; message: string }> = {};
    const v = values as Record<string, unknown>;
    const miss = (k: string, msg = req) => { if (!v[k]) errors[k] = { type: "required", message: msg }; };
    miss("vesselName"); miss("flag"); miss("vesselType"); miss("port"); miss("eta"); miss("contactName"); miss("role");
    if (!v["email"]) errors["email"] = { type: "required", message: req };
    else if (!emailRe.test(v["email"] as string)) errors["email"] = { type: "pattern", message: "Invalid email" };
    if (!v["consent"]) errors["consent"] = { type: "required", message: req };
    if (isProvisions) {
      if (!(v["categories"] as string[] | undefined)?.length) errors["categories"] = { type: "required", message: req };
      miss("notes"); miss("currency");
    } else {
      const wasteCount = (v["wasteTypes"] as string[] | undefined)?.length ?? 0;
      const techCount = (v["techServices"] as string[] | undefined)?.length ?? 0;
      if (wasteCount === 0 && techCount === 0) {
        errors["wasteTypes"] = { type: "required", message: req };
      }
      if (wasteCount > 0) {
        miss("volume");
        miss("mode");
      }
    }
    return { values: Object.keys(errors).length ? {} : values, errors };
  };
}

export function QuoteForm({ type }: Props) {
  const t = useTranslations("forms");
  const locale = useLocale() as "es" | "en";
  const [submitted, setSubmitted] = React.useState(false);

  const defaults = type === "provisions" ? provisionsDefaults : marpolDefaults;

  const form = useForm<FormValues>({
    resolver: makeResolver(type === "provisions"),
    defaultValues: defaults as FormValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload: values, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: Record<string, string[]>;
      };
      if (!res.ok || !data.ok) {
        if (res.status === 422 && data.fieldErrors) {
          for (const [path, messages] of Object.entries(data.fieldErrors)) {
            form.setError(path as keyof FormValues & string, {
              type: "server",
              message: messages[0],
            });
          }
          toast.error(t("errors.validation"));
          return;
        }
        toast.error(data.message || t("errors.generic"));
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error(t("errors.network"));
    }
  };

  if (submitted) {
    return (
      <Card className="border-gold/30 bg-cream/40">
        <CardContent className="py-12 text-center">
          <h2 className="text-2xl font-serif text-navy">{t("success.title")}</h2>
          <p className="mt-3 mx-auto max-w-prose text-charcoal/80">
            {t("success.body")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <Section title={t("sections.vessel")}>
          <Grid>
            <TextFieldRHF name="vesselName" label={t("fields.vesselName")} required />
            <TextFieldRHF name="flag" label={t("fields.flag")} required />
            <TextFieldRHF name="imo" label={t("fields.imo")} />
            <SelectFieldRHF
              name="vesselType"
              label={t("fields.vesselType")}
              required
              placeholder={t("placeholders.select")}
              options={VESSEL_TYPES.map((v) => ({ value: v, label: v }))}
            />
          </Grid>
        </Section>

        <Section title={t("sections.portCall")}>
          <Grid>
            <SelectFieldRHF
              name="port"
              label={t("fields.port")}
              required
              placeholder={t("placeholders.select")}
              options={PORTS.map((p) => ({ value: p, label: p }))}
            />
            <TextFieldRHF name="eta" label={t("fields.eta")} type="date" required />
            <TextFieldRHF name="etd" label={t("fields.etd")} type="date" />
          </Grid>
        </Section>

        <Section title={t("sections.contact")}>
          <Grid>
            <TextFieldRHF
              name="contactName"
              label={t("fields.contactName")}
              required
            />
            <SelectFieldRHF
              name="role"
              label={t("fields.role")}
              required
              placeholder={t("placeholders.select")}
              options={CONTACT_ROLES.map((r) => ({ value: r, label: r }))}
            />
            <TextFieldRHF
              name="email"
              label={t("fields.email")}
              type="email"
              required
            />
            <TextFieldRHF name="phone" label={t("fields.phone")} type="tel" />
            <TextFieldRHF name="company" label={t("fields.company")} />
          </Grid>
        </Section>

        {type === "provisions" ? (
          <Section title={t("sections.provisionsDetail")}>
            <CheckboxGroupRHF
              name="categories"
              label={t("fields.categories")}
              required
              options={PROVISION_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <TextareaFieldRHF
              name="notes"
              label={t("fields.notes")}
              placeholder={t("fields.notesPlaceholder")}
              required
              rows={8}
            />
            <div className="max-w-xs">
              <SelectFieldRHF
                name="currency"
                label={t("fields.currency")}
                required
                placeholder={t("placeholders.select")}
                options={CURRENCIES.map((c) => ({ value: c, label: c }))}
              />
            </div>
          </Section>
        ) : (
          <Section title={t("sections.wasteDetail")}>
            <CheckboxGroupRHF
              name="techServices"
              label={t("fields.techServices")}
              options={TECH_SERVICES.map((s) => ({ value: s, label: s }))}
            />
            <CheckboxGroupRHF
              name="wasteTypes"
              label={t("fields.wasteTypes")}
              options={WASTE_TYPES.map((w) => ({ value: w, label: w }))}
            />
            <Grid>
              <TextFieldRHF
                name="volume"
                label={t("fields.volume")}
                placeholder={t("fields.volumePlaceholder")}
              />
              <SelectFieldRHF
                name="mode"
                label={t("fields.mode")}
                placeholder={t("placeholders.select")}
                options={WASTE_MODES.map((m) => ({ value: m, label: m }))}
              />
            </Grid>
            <TextareaFieldRHF
              name="additionalNotes"
              label={t("fields.additionalNotes")}
              rows={5}
            />
          </Section>
        )}

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="rounded-lg border border-border bg-cream/40 p-4">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                </FormControl>
                <div className="grid gap-1">
                  <FormLabel className="text-charcoal">
                    {t("fields.consent")}
                  </FormLabel>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="min-w-44"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> {t("actions.submitting")}
              </span>
            ) : (
              t("actions.submit")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">
        {title}
      </h2>
      <div className="space-y-5 rounded-xl border border-border bg-background p-6 shadow-sm">
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

type RHFNameProvisions = keyof QuoteProvisionsInput;
type RHFNameMarpol = keyof QuoteMarpolInput;
type RHFName = RHFNameProvisions | RHFNameMarpol;

function TextFieldRHF({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: RHFName;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <FormField
      name={name as string}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="h-10"
              {...field}
              value={(field.value as string | undefined) ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TextareaFieldRHF({
  name,
  label,
  placeholder,
  required,
  rows = 5,
}: {
  name: RHFName;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <FormField
      name={name as string}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              {...field}
              value={(field.value as string | undefined) ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SelectFieldRHF({
  name,
  label,
  options,
  placeholder,
  required,
}: {
  name: RHFName;
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <FormField
      name={name as string}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <Select
              value={(field.value as string | undefined) ?? ""}
              onValueChange={(v) => field.onChange(v ?? "")}
            >
              <SelectTrigger
                className="h-10 w-full justify-between"
                aria-invalid={!!fieldState.error}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CheckboxGroupRHF({
  name,
  label,
  options,
  required,
}: {
  name: RHFName;
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <FormField
      name={name as string}
      render={() => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {options.map((opt) => (
                <Controller
                  key={opt.value}
                  name={name as string}
                  render={({ field }) => {
                    const arr = (field.value as string[] | undefined) ?? [];
                    const checked = arr.includes(opt.value);
                    return (
                      <label
                        htmlFor={`${name}-${opt.value}`}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-cream/40"
                      >
                        <Checkbox
                          id={`${name}-${opt.value}`}
                          checked={checked}
                          onCheckedChange={(c) => {
                            const isChecked = c === true;
                            const next = isChecked
                              ? [...arr, opt.value]
                              : arr.filter((v) => v !== opt.value);
                            field.onChange(next);
                          }}
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  }}
                />
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
