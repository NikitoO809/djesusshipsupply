import { z } from "zod";
import {
  baseQuoteShape,
  PROVISION_CATEGORIES,
  CURRENCIES,
} from "./shared";

const required = "Requerido / Required";

export const quoteProvisionsSchema = z.object({
  ...baseQuoteShape,
  categories: z
    .array(z.enum(PROVISION_CATEGORIES), {
      message: "Seleccione al menos una categoría / Select at least one category",
    })
    .min(1, { message: "Seleccione al menos una categoría / Select at least one category" }),
  notes: z
    .string({ message: required })
    .trim()
    .min(5, { message: "Describa la solicitud (mínimo 5 caracteres) / Describe the request (min 5 chars)" }),
  currency: z.enum(CURRENCIES, { message: required }),
});

export type QuoteProvisionsInput = z.input<typeof quoteProvisionsSchema>;
export type QuoteProvisionsValues = z.output<typeof quoteProvisionsSchema>;
