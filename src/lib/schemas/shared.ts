import { z } from "zod";

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

export {
  PORTS,
  VESSEL_TYPES,
  CONTACT_ROLES,
  CURRENCIES,
  PROVISION_CATEGORIES,
  WASTE_TYPES,
  WASTE_MODES,
  TECH_SERVICES,
};

const required = "Requerido / Required";
const invalidEmail = "Correo no válido / Invalid email";
const invalidDate = "Fecha no válida / Invalid date";
const pastDate = "La fecha no puede estar en el pasado / Date cannot be in the past";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const isoDate = z
  .string({ message: required })
  .min(1, { message: required })
  .refine((v) => !Number.isNaN(Date.parse(v)), { message: invalidDate });

const isoDateNotPast = isoDate.refine(
  (v) => {
    const d = new Date(v);
    return d.getTime() >= todayStart().getTime();
  },
  { message: pastDate }
);

const isoDateOptional = z
  .string()
  .optional()
  .refine((v) => !v || !Number.isNaN(Date.parse(v)), { message: invalidDate });

export const vesselSchema = z.object({
  vesselName: z.string({ message: required }).trim().min(1, { message: required }),
  flag: z.string({ message: required }).trim().min(1, { message: required }),
  imo: z.string().trim().optional().or(z.literal("")),
  vesselType: z.enum(VESSEL_TYPES, { message: required }),
});

export const portCallSchema = z.object({
  port: z.enum(PORTS, { message: required }),
  eta: isoDateNotPast,
  etd: isoDateOptional,
});

export const contactSchema = z.object({
  contactName: z
    .string({ message: required })
    .trim()
    .min(1, { message: required }),
  role: z.enum(CONTACT_ROLES, { message: required }),
  email: z
    .string({ message: required })
    .trim()
    .min(1, { message: required })
    .email({ message: invalidEmail }),
  phone: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
});

export const consentSchema = z.object({
  consent: z.literal(true, {
    message:
      "Debe aceptar el uso de datos / You must accept data processing",
  }),
});

export const baseQuoteShape = {
  ...vesselSchema.shape,
  ...portCallSchema.shape,
  ...contactSchema.shape,
  ...consentSchema.shape,
};
