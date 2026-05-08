import type { CartItem } from "@/lib/schemas/quote-provisions";

export type VesselContactData = {
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
};

export type FlowMethod = "catalog" | "upload" | "template";
export type FlowView = "methods" | "catalog" | "template" | "upload";
export type FlowStep = 1 | 2 | 3;

export type FlowState = {
  step: FlowStep;
  view: FlowView;
  vessel: VesselContactData | null;
  method: FlowMethod | null;
  cart: Record<string, CartItem>;
  file: File | null;
  notes: string;
  currency: "USD" | "EUR" | "DOP" | "";
  consent: boolean;
  submitting: boolean;
  submitted: boolean;
};

export const emptyVessel: VesselContactData = {
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
};

export const initialFlowState: FlowState = {
  step: 1,
  view: "methods",
  vessel: null,
  method: null,
  cart: {},
  file: null,
  notes: "",
  currency: "",
  consent: false,
  submitting: false,
  submitted: false,
};
