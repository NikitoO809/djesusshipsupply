export interface PortData {
  slug: string;
  nameEs: string;
  nameEn: string;
  lat: number;
  lon: number;
  types: string[];
}

export const PORTS: PortData[] = [
  {
    slug: "caucedo",
    nameEs: "Puerto de Caucedo",
    nameEn: "Port of Caucedo",
    lat: 18.4328,
    lon: -69.6219,
    types: ["container", "cargo"],
  },
  {
    slug: "rio-haina",
    nameEs: "Puerto Río Haina",
    nameEn: "Port of Río Haina",
    lat: 18.4167,
    lon: -70.0167,
    types: ["industrial", "multipurpose"],
  },
  {
    slug: "boca-chica",
    nameEs: "Puerto de Boca Chica",
    nameEn: "Port of Boca Chica",
    lat: 18.4489,
    lon: -69.6106,
    types: ["small craft", "fishing"],
  },
  {
    slug: "puerto-plata",
    nameEs: "Puerto Plata",
    nameEn: "Puerto Plata Port",
    lat: 19.7957,
    lon: -70.6894,
    types: ["cruise", "cargo"],
  },
  {
    slug: "samana",
    nameEs: "Puerto de Samaná",
    nameEn: "Port of Samaná",
    lat: 19.2067,
    lon: -69.3364,
    types: ["cruise", "ferry"],
  },
  {
    slug: "la-romana",
    nameEs: "Puerto de La Romana",
    nameEn: "Port of La Romana",
    lat: 18.4275,
    lon: -68.9711,
    types: ["sugar", "cruise"],
  },
  {
    slug: "san-pedro-de-macoris",
    nameEs: "Puerto de San Pedro de Macorís",
    nameEn: "Port of San Pedro de Macorís",
    lat: 18.4522,
    lon: -69.2939,
    types: ["industrial"],
  },
  {
    slug: "manzanillo",
    nameEs: "Puerto de Manzanillo",
    nameEn: "Port of Manzanillo",
    lat: 19.6978,
    lon: -71.7417,
    types: ["banana", "cargo"],
  },
];

export function getPort(slug: string): PortData | undefined {
  return PORTS.find((p) => p.slug === slug);
}
