/** Dirección a la que llegan las solicitudes de cotización (reenvía al Gmail de la empresa). */
export const QUOTE_EMAIL = "ops@djshipsupply.com";

/** Enlace mailto con asunto y cuerpo ya escritos (plantilla de la solicitud). */
export function mailtoUrl(subject: string, body: string): string {
  return `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
