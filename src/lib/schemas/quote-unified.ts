import { z } from "zod";
import { baseQuoteShape, CURRENCIES } from "./shared";
import { technicalRfqItemSchema } from "./quote-technical";
import { cartItemSchema, customItemSchema } from "./quote-provisions";

const required = "Requerido / Required";

export const quoteUnifiedSchema = z
  .object({
    kind: z.literal("unified"),
    ...baseQuoteShape,
    currency: z.enum(CURRENCIES, { message: required }),
    notes: z.string().trim().optional().or(z.literal("")),
    technicalItems: z.array(technicalRfqItemSchema).default([]),
    provisionsMethod: z.enum(["catalog", "upload", "template"]).optional(),
    provisionsItems: z.array(cartItemSchema).default([]),
    customItems: z.array(customItemSchema).max(20).default([]),
    fileName: z.string().trim().optional(),
    fileSize: z.number().int().nonnegative().optional(),
    fileType: z.string().trim().optional(),
  })
  .refine(
    (d) => d.technicalItems.length > 0 || d.provisionsItems.length > 0 || d.customItems.length > 0,
    {
      message:
        "Se requiere al menos un producto / At least one product is required",
    }
  );

export type QuoteUnifiedInput = z.input<typeof quoteUnifiedSchema>;
export type QuoteUnifiedValues = z.output<typeof quoteUnifiedSchema>;
