import { z } from "zod";
import {
  baseQuoteShape,
  WASTE_TYPES,
  WASTE_MODES,
  TECH_SERVICES,
} from "./shared";

const required = "Requerido / Required";

export const quoteMarpolSchema = z
  .object({
    ...baseQuoteShape,
    wasteTypes: z.array(z.enum(WASTE_TYPES)).default([]),
    techServices: z.array(z.enum(TECH_SERVICES)).default([]),
    volume: z.string().trim().optional().or(z.literal("")),
    mode: z.enum(WASTE_MODES).optional().or(z.literal("")),
    additionalNotes: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasWaste = (data.wasteTypes ?? []).length > 0;
    const hasTech = (data.techServices ?? []).length > 0;
    if (!hasWaste && !hasTech) {
      ctx.addIssue({
        code: "custom",
        path: ["wasteTypes"],
        message:
          "Seleccione al menos un servicio o tipo de residuo / Select at least one service or waste type",
      });
    }
    if (hasWaste) {
      if (!data.volume || !data.volume.trim()) {
        ctx.addIssue({ code: "custom", path: ["volume"], message: required });
      }
      if (!data.mode) {
        ctx.addIssue({ code: "custom", path: ["mode"], message: required });
      }
    }
  });

export type QuoteMarpolInput = z.input<typeof quoteMarpolSchema>;
export type QuoteMarpolValues = z.output<typeof quoteMarpolSchema>;
