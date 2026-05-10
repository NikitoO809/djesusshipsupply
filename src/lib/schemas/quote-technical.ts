import { z } from "zod";
import { baseQuoteShape, CURRENCIES } from "./shared";

const required = "Requerido / Required";

export const technicalRfqItemSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  qty: z.number().int().positive(),
  unit: z.string().trim().min(1),
  note: z.string().trim().optional().or(z.literal("")),
  categoryId: z.string().trim().min(1),
  categoryTitleEs: z.string().trim().min(1),
});

export const quoteTechnicalSchema = z.object({
  kind: z.literal("technical"),
  ...baseQuoteShape,
  currency: z.enum(CURRENCIES, { message: required }),
  notes: z.string().trim().optional().or(z.literal("")),
  items: z
    .array(technicalRfqItemSchema)
    .min(1, { message: "Agregue al menos un producto / Add at least one product" }),
});

export type QuoteTechnicalInput = z.input<typeof quoteTechnicalSchema>;
export type QuoteTechnicalValues = z.output<typeof quoteTechnicalSchema>;
