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

export type CustomItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
};

export type ProvisionsMethod = "catalog" | "upload" | "template";
export type ProvisionsView = "methods" | "catalog" | "template" | "upload";
export type ProvisionsStep = 1 | 2 | 3;

export type FlowState = {
  step: ProvisionsStep;
  view: ProvisionsView;
  vessel: VesselContactData | null;
  method: ProvisionsMethod | null;
  file: File | null;
  notes: string;
  currency: "USD" | "EUR" | "DOP" | "";
  consent: boolean;
  submitting: boolean;
  submitted: boolean;
  customItems: CustomItem[];
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
  file: null,
  notes: "",
  currency: "USD",
  consent: false,
  submitting: false,
  submitted: false,
  customItems: [],
};
