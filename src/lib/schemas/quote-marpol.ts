import { z } from "zod";
import {
  baseQuoteShape,
  WASTE_TYPES,
  WASTE_MODES,
} from "./shared";

const required = "Requerido / Required";

export const quoteMarpolSchema = z.object({
  ...baseQuoteShape,
  wasteTypes: z
    .array(z.enum(WASTE_TYPES), {
      message: "Seleccione al menos un tipo de residuo / Select at least one waste type",
    })
    .min(1, { message: "Seleccione al menos un tipo de residuo / Select at least one waste type" }),
  volume: z
    .string({ message: required })
    .trim()
    .min(1, { message: required }),
  mode: z.enum(WASTE_MODES, { message: required }),
  additionalNotes: z.string().trim().optional().or(z.literal("")),
});

export type QuoteMarpolInput = z.input<typeof quoteMarpolSchema>;
export type QuoteMarpolValues = z.output<typeof quoteMarpolSchema>;
