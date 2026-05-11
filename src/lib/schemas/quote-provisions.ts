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

/* ============================================================
 * Rich provisions schema — used by the new 3-method quote flow
 * (catalog, upload, template). Backwards compatible: the legacy
 * `quoteProvisionsSchema` above stays for any existing consumer.
 * ============================================================ */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const cartItemSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  unit: z.string().trim(),
  qty: z.number().int().positive(),
  category: z.string().trim().min(1),
  categoryName: z.string().trim().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const customItemSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1, { message: "Describa el producto / Describe the product" }).max(200),
  qty: z.number().positive({ message: "Cantidad inválida / Invalid quantity" }),
  unit: z.string().trim().max(30).default(""),
});

export type CustomItem = z.infer<typeof customItemSchema>;

const fileMetaShape = {
  fileName: z.string().trim().min(1, { message: required }),
  fileSize: z
    .number()
    .int()
    .nonnegative()
    .max(MAX_UPLOAD_BYTES, {
      message: "Archivo supera 10 MB / File exceeds 10 MB",
    }),
  fileType: z.string().trim().min(1, { message: required }),
};

const richBaseShape = {
  ...baseQuoteShape,
  currency: z.enum(CURRENCIES, { message: required }),
  notes: z.string().trim().optional().or(z.literal("")),
  customItems: z.array(customItemSchema).max(20).default([]),
};

const minOneItem = {
  message:
    "Agregue al menos un producto al carrito / Add at least one product to the cart",
};

export const quoteProvisionsRichSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("catalog"),
    items: z.array(cartItemSchema).min(1, minOneItem),
    ...richBaseShape,
  }),
  z.object({
    method: z.literal("upload"),
    ...fileMetaShape,
    extraItems: z.array(cartItemSchema).default([]),
    ...richBaseShape,
  }),
  z.object({
    method: z.literal("template"),
    ...fileMetaShape,
    extraItems: z.array(cartItemSchema).default([]),
    ...richBaseShape,
  }),
]);

export type QuoteProvisionsRichInput = z.input<typeof quoteProvisionsRichSchema>;
export type QuoteProvisionsRichValues = z.output<typeof quoteProvisionsRichSchema>;
