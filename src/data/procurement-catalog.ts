export type CatalogItemUnit = "ud" | "m" | "kg" | "L" | "caja" | "par" | "juego" | "rollo";

export type CatalogItem = {
  id: string;
  name: string;
  unit: CatalogItemUnit;
  /**
   * Image path relative to /public, derived from id by convention if absent.
   * Convention: `/procurement/<category-id>/<item-id>.webp`
   * (item-id already starts with the category-id, so we split it.)
   * If the file does not exist at runtime, the UI falls back to an initial avatar.
   */
  image?: string;
};

export type CatalogCategory = {
  id: string;
  icon: string;
  titleEn: string;
  titleEs: string;
  color: string;
  items: CatalogItem[];
};

/**
 * Build the conventional image path for a procurement item.
 * id "electricos-01" → "/procurement/electricos/electricos-01.webp"
 */
export function procurementItemImagePath(item: { id: string }): string {
  const dashIdx = item.id.indexOf("-");
  const categoryId = dashIdx > 0 ? item.id.slice(0, dashIdx) : item.id;
  return `/procurement/${categoryId}/${item.id}.webp`;
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: "electricos",
    icon: "Zap",
    titleEn: "Electrical & Marine Wiring",
    titleEs: "Eléctricos y Cableado Marino",
    color: "#F59E0B",
    items: [
      { id: "electricos-01", name: "Cable marino THW / THHN / multiconductor flexible", unit: "m" },
      { id: "electricos-02", name: "Breakers y disyuntores industriales", unit: "ud" },
      { id: "electricos-03", name: "Cinta aislante 3M (Super 33+, Super 88)", unit: "rollo" },
      { id: "electricos-04", name: "Terminales, conectores y prensaterminales", unit: "caja" },
      { id: "electricos-05", name: "Fusibles industriales Bussmann", unit: "ud" },
      { id: "electricos-06", name: "Interruptores y tomacorrientes industriales", unit: "ud" },
      { id: "electricos-07", name: "Tableros de distribución eléctrica", unit: "ud" },
      { id: "electricos-08", name: "Contactores y relés de control", unit: "ud" },
      { id: "electricos-09", name: "Arrancadores de motor", unit: "ud" },
      { id: "electricos-10", name: "Multímetros y pinzas amperimétricas Fluke", unit: "ud" },
      { id: "electricos-11", name: "Lámparas de emergencia y linternas LED", unit: "ud" },
      { id: "electricos-12", name: "Tubería conduit y accesorios", unit: "m" },
      { id: "electricos-13", name: "Transformadores de control", unit: "ud" },
      { id: "electricos-14", name: "Temporizadores y sensores industriales", unit: "ud" },
    ],
  },
  {
    id: "ferreteria",
    icon: "Wrench",
    titleEn: "Hardware & Deck Fittings",
    titleEs: "Ferretería y Herrajes de Cubierta",
    color: "#8B5CF6",
    items: [
      { id: "ferreteria-01", name: "Tornillería inoxidable (pernos, tuercas, arandelas)", unit: "caja" },
      { id: "ferreteria-02", name: "Cabos, sogas y amarres náuticos", unit: "m" },
      { id: "ferreteria-03", name: "Grilletes, ganchos y poleas", unit: "ud" },
      { id: "ferreteria-04", name: "Candados y cerraduras de alta seguridad", unit: "ud" },
      { id: "ferreteria-05", name: "Abrazaderas de acero inoxidable", unit: "caja" },
      { id: "ferreteria-06", name: "Cadenas galvanizadas y de acero inox", unit: "m" },
      { id: "ferreteria-07", name: "Cintas de teflón y selladores de rosca", unit: "ud" },
      { id: "ferreteria-08", name: "Silicón marino y adhesivos epóxicos", unit: "ud" },
      { id: "ferreteria-09", name: "Brocas HSS, discos de corte y discos de pulir", unit: "ud" },
      { id: "ferreteria-10", name: "Llaves ajustables y llaves de tubo", unit: "ud" },
      { id: "ferreteria-11", name: "Cuchillas, navajas y herramientas de mano", unit: "ud" },
      { id: "ferreteria-12", name: "Remaches y pop rivets inoxidables", unit: "caja" },
      { id: "ferreteria-13", name: "Graseras y aceiteras industriales", unit: "ud" },
    ],
  },
  {
    id: "seguridad",
    icon: "Shield",
    titleEn: "Safety & PPE (IMO Compliant)",
    titleEs: "Seguridad y EPP (Norma OMI)",
    color: "#EF4444",
    items: [
      { id: "seguridad-01", name: "Cascos de seguridad industrial", unit: "ud" },
      { id: "seguridad-02", name: "Guantes de trabajo (nitrilo, cuero, anticorte)", unit: "par" },
      { id: "seguridad-03", name: "Lentes y gafas de seguridad", unit: "ud" },
      { id: "seguridad-04", name: "Botas de seguridad punta de acero", unit: "par" },
      { id: "seguridad-05", name: "Arneses de cuerpo completo y líneas de vida", unit: "ud" },
      { id: "seguridad-06", name: "Protección auditiva (tapones y orejeras)", unit: "ud" },
      { id: "seguridad-07", name: "Mascarillas y respiradores 3M", unit: "ud" },
      { id: "seguridad-08", name: "Trajes Tyvek y overoles de trabajo", unit: "ud" },
      { id: "seguridad-09", name: "Conos, cintas de peligro y señalización", unit: "ud" },
      { id: "seguridad-10", name: "Extintores portátiles (CO₂, polvo químico)", unit: "ud" },
      { id: "seguridad-11", name: "Chalecos reflectivos de alta visibilidad", unit: "ud" },
      { id: "seguridad-12", name: "Botiquines de primeros auxilios", unit: "ud" },
      { id: "seguridad-13", name: "Detectores de gas portátiles", unit: "ud" },
    ],
  },
  {
    id: "pintura",
    icon: "Paintbrush",
    titleEn: "Marine Coatings & Paint",
    titleEs: "Pintura y Recubrimientos Marinos",
    color: "#3B82F6",
    items: [
      { id: "pintura-01", name: "Pintura anticorrosiva / primer epóxico", unit: "L" },
      { id: "pintura-02", name: "Pintura marina de acabado (esmalte industrial)", unit: "L" },
      { id: "pintura-03", name: "Pintura antideslizante para cubiertas", unit: "L" },
      { id: "pintura-04", name: "Brochas, rodillos y bandejas industriales", unit: "ud" },
      { id: "pintura-05", name: "Thinner y solventes industriales", unit: "L" },
      { id: "pintura-06", name: "Masking tape industrial 3M", unit: "rollo" },
      { id: "pintura-07", name: "Lijas de agua (grano 80 a 600)", unit: "ud" },
      { id: "pintura-08", name: "Lijas de banda para amoladora", unit: "ud" },
      { id: "pintura-09", name: "Removedores de pintura y óxido", unit: "L" },
      { id: "pintura-10", name: "Selladores y masillas marinas", unit: "ud" },
      { id: "pintura-11", name: "Spray anticorrosivo y penetrante", unit: "ud" },
      { id: "pintura-12", name: "Convertidor de óxido", unit: "L" },
    ],
  },
  {
    id: "refrigeracion",
    icon: "Snowflake",
    titleEn: "Refrigeration & HVAC",
    titleEs: "Refrigeración y Climatización",
    color: "#06B6D4",
    items: [
      { id: "refrigeracion-01", name: "Gas refrigerante (R-410A, R-134a, R-22)", unit: "kg" },
      { id: "refrigeracion-02", name: "Filtros de aire acondicionado", unit: "ud" },
      { id: "refrigeracion-03", name: "Termostatos digitales y analógicos", unit: "ud" },
      { id: "refrigeracion-04", name: "Mangueras y conexiones de refrigeración", unit: "m" },
      { id: "refrigeracion-05", name: "Compresores de reemplazo", unit: "ud" },
      { id: "refrigeracion-06", name: "Válvulas de servicio y expansión", unit: "ud" },
      { id: "refrigeracion-07", name: "Manómetros de refrigeración", unit: "ud" },
      { id: "refrigeracion-08", name: "Aislante térmico para tubería", unit: "m" },
      { id: "refrigeracion-09", name: "Ventiladores industriales", unit: "ud" },
      { id: "refrigeracion-10", name: "Controles de temperatura", unit: "ud" },
    ],
  },
  {
    id: "plomeria",
    icon: "Droplets",
    titleEn: "Plumbing & Piping",
    titleEs: "Plomería y Sistemas de Agua",
    color: "#10B981",
    items: [
      { id: "plomeria-01", name: "Válvulas de bola (bronce y acero inoxidable)", unit: "ud" },
      { id: "plomeria-02", name: "Llaves de paso industriales", unit: "ud" },
      { id: "plomeria-03", name: "Tubería PVC, CPVC y galvanizada", unit: "m" },
      { id: "plomeria-04", name: "Conectores, codos y tees galvanizados", unit: "ud" },
      { id: "plomeria-05", name: "Teflón industrial y sellador de roscas", unit: "ud" },
      { id: "plomeria-06", name: "Bombas de agua sumergibles", unit: "ud" },
      { id: "plomeria-07", name: "Mangueras industriales reforzadas", unit: "m" },
      { id: "plomeria-08", name: "Abrazaderas para manguera (tipo alemán)", unit: "caja" },
      { id: "plomeria-09", name: "Uniones universales y niples", unit: "ud" },
      { id: "plomeria-10", name: "Filtros de agua y sedimento", unit: "ud" },
    ],
  },
  {
    id: "iluminacion",
    icon: "Lightbulb",
    titleEn: "Lighting & Power",
    titleEs: "Iluminación y Energía",
    color: "#FBBF24",
    items: [
      { id: "iluminacion-01", name: "Bombillos LED industriales (E27, E40)", unit: "ud" },
      { id: "iluminacion-02", name: "Reflectores LED de alta potencia (cubierta y carga)", unit: "ud" },
      { id: "iluminacion-03", name: "Tubos LED T8 y T5", unit: "ud" },
      { id: "iluminacion-04", name: "Luminarias estancas IP65 (resistentes al agua)", unit: "ud" },
      { id: "iluminacion-05", name: "Lámparas de mano recargables", unit: "ud" },
      { id: "iluminacion-06", name: "Baterías alcalinas y recargables", unit: "ud" },
      { id: "iluminacion-07", name: "Extensiones eléctricas industriales", unit: "ud" },
      { id: "iluminacion-08", name: "Regletas y protectores de voltaje", unit: "ud" },
    ],
  },
  {
    id: "limpieza",
    icon: "Sparkles",
    titleEn: "Cleaning & Maintenance",
    titleEs: "Limpieza y Mantenimiento",
    color: "#14B8A6",
    items: [
      { id: "limpieza-01", name: "Desengrasantes industriales", unit: "L" },
      { id: "limpieza-02", name: "Jabón náutico / limpiador multiusos", unit: "L" },
      { id: "limpieza-03", name: "Escobas y cepillos industriales de cubierta", unit: "ud" },
      { id: "limpieza-04", name: "Trapeadores, mopas y baldes industriales", unit: "ud" },
      { id: "limpieza-05", name: "Guantes de limpieza (latex y nitrilo)", unit: "par" },
      { id: "limpieza-06", name: "Bolsas de basura industriales (calibre grueso)", unit: "caja" },
      { id: "limpieza-07", name: "Limpiador de acero inoxidable", unit: "ud" },
      { id: "limpieza-08", name: "Absorbentes para derrames de aceite", unit: "ud" },
      { id: "limpieza-09", name: "Paños industriales y estopa", unit: "kg" },
      { id: "limpieza-10", name: "Cloro y desinfectantes industriales", unit: "L" },
    ],
  },
  {
    id: "herramientas",
    icon: "Hammer",
    titleEn: "Power & Hand Tools",
    titleEs: "Herramientas Mecánicas y Eléctricas",
    color: "#F97316",
    items: [
      { id: "herramientas-01", name: "Juegos de llaves combinadas (mm e inglés)", unit: "juego" },
      { id: "herramientas-02", name: "Llaves de impacto neumáticas e inalámbricas", unit: "ud" },
      { id: "herramientas-03", name: "Taladros inalámbricos (Bosch, DeWalt)", unit: "ud" },
      { id: "herramientas-04", name: 'Amoladoras angulares 4½" y 7"', unit: "ud" },
      { id: "herramientas-05", name: "Prensas, sargentos y mordazas", unit: "ud" },
      { id: "herramientas-06", name: "Equipos de soldadura y electrodos (6011, 6013, 7018)", unit: "ud" },
      { id: "herramientas-07", name: "Pistolas de calor industrial", unit: "ud" },
      { id: "herramientas-08", name: "Sierra caladora y sierra circular", unit: "ud" },
      { id: "herramientas-09", name: "Juegos de destornilladores y puntas", unit: "juego" },
      { id: "herramientas-10", name: "Extractores de rodamiento", unit: "ud" },
      { id: "herramientas-11", name: "Gatos hidráulicos y tecles", unit: "ud" },
      { id: "herramientas-12", name: "Calibradores y micrómetros", unit: "ud" },
    ],
  },
];

export const TOTAL_PRODUCTS = catalogCategories.reduce(
  (sum, cat) => sum + cat.items.length,
  0
);
