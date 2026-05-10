export const PORTS = [
  "Caucedo",
  "Río Haina",
  "Santo Domingo",
  "Puerto Plata",
  "La Romana",
  "Boca Chica",
  "Manzanillo",
  "Barahona",
] as const;

export const VESSEL_TYPES = [
  "Cargo",
  "Tanker",
  "Cruise",
  "Container",
  "Bulk",
  "Other",
] as const;

export const CONTACT_ROLES = [
  "Captain",
  "Shipping agent",
  "Owner",
  "Other",
] as const;

export const CURRENCIES = ["USD", "EUR", "DOP"] as const;

export const PROVISION_CATEGORIES = [
  "Fresh",
  "Frozen",
  "Dry",
  "Bonded",
  "Fresh water",
  "Technical gases",
] as const;

export const WASTE_TYPES = [
  "Aguas oleosas / Oily water",
  "Lodos (sludge)",
  "Agua de sentina / Bilge water",
  "Otros oleosos / Other oily",
  "Basura doméstica / Domestic garbage",
  "Plásticos / Plastics",
  "Residuos alimenticios / Food waste",
  "Otros / Other",
] as const;

export const WASTE_MODES = ["Alongside", "Anchorage"] as const;

export const TECH_SERVICES = [
  "Chatarra y residuos / Scrap & Waste Management",
  "Navegación y electrónica / Navigation & Electronics Repair",
  "Sistemas eléctricos / Marine Electrical Services",
  "Refrigeración y climatización / Marine Refrigeration & HVAC",
] as const;
