import { IDIOMAS, POR_DEFECTO, DOMINIO, prefijo, type Idioma } from './config.ts';

/**
 * Manifiesto de rutas: la fuente unica de verdad de las URLs del sitio.
 *
 * De aqui salen a la vez el getStaticPaths, las alternantes hreflang, el
 * selector de idioma, el sitemap y las migas de pan. Si un slug cambia, cambia
 * en los seis sitios a la vez.
 *
 * REGLA INVIOLABLE: los slugs `es` son los que hoy posicionan en Google. No se
 * corrigen, no se embellecen, no se les anaden tildes. Los que se ven raros
 * (`-taller-1`, `poltica-de-privacidad`) estan asi a proposito.
 */
export interface Ruta {
  /** Identificador estable, independiente del idioma. */
  id: string;
  /** Slug completo por idioma, sin barra inicial. */
  slugs: Record<Idioma, string>;
  /** Seccion a la que pertenece, para migas de pan y navegacion. */
  seccion?: string;
}

/** Segmentos que se repiten dentro de rutas dinamicas. */
export const SEGMENTOS = {
  magazine: { es: 'magazine', en: 'magazine', fr: 'magazine', it: 'magazine', de: 'magazine', ca: 'magazine' },
  categoria: { es: 'category', en: 'category', fr: 'categorie', it: 'categoria', de: 'kategorie', ca: 'categoria' },
  coches: {
    es: 'porsche-en-venta', en: 'porsche-for-sale', fr: 'porsche-a-vendre',
    it: 'porsche-in-vendita', de: 'porsche-kaufen', ca: 'porsche-en-venda',
  },
  vendidos: {
    es: 'vendidos', en: 'sold', fr: 'vendues', it: 'vendute', de: 'verkauft', ca: 'venuts',
  },
} satisfies Record<string, Record<Idioma, string>>;

export const RUTAS: Ruta[] = [
  { id: 'home', seccion: 'home',
    slugs: { es: '', en: '', fr: '', it: '', de: '', ca: '' } },

  // ── Coches en venta ─────────────────────────────────────────────────────
  { id: 'coches', seccion: 'coches',
    slugs: SEGMENTOS.coches },

  // ── Centros ─────────────────────────────────────────────────────────────
  { id: 'barcelona', seccion: 'centros',
    slugs: { es: 'barcelona', en: 'barcelona', fr: 'barcelona', it: 'barcelona', de: 'barcelona', ca: 'barcelona' } },
  { id: 'madrid', seccion: 'centros',
    slugs: { es: 'madrid', en: 'madrid', fr: 'madrid', it: 'madrid', de: 'madrid', ca: 'madrid' } },

  // ── Servicios ───────────────────────────────────────────────────────────
  { id: 'taller', seccion: 'servicios',
    slugs: { es: 'taller-porsche', en: 'porsche-workshop', fr: 'atelier-porsche',
             it: 'officina-porsche', de: 'porsche-werkstatt', ca: 'taller-porsche' } },
  { id: 'sala-motores', seccion: 'servicios',
    slugs: { es: 'sala-motores', en: 'engine-room', fr: 'salle-des-moteurs',
             it: 'sala-motori', de: 'motorenraum', ca: 'sala-de-motors' } },
  { id: 'restauraciones', seccion: 'servicios',
    slugs: { es: 'restauraciones', en: 'porsche-restoration', fr: 'restauration-porsche',
             it: 'restauro-porsche', de: 'porsche-restaurierung', ca: 'restauracions' } },
  { id: 'competicion', seccion: 'servicios',
    slugs: { es: 'competicion', en: 'motorsport', fr: 'competition',
             it: 'competizione', de: 'motorsport', ca: 'competicio' } },

  // ── Tarifas de mantenimiento ────────────────────────────────────────────
  { id: 'tarifa-911', seccion: 'tarifas',
    slugs: { es: 'porsche-911-mantenimiento-taller', en: 'porsche-911-servicing',
             fr: 'entretien-porsche-911', it: 'manutenzione-porsche-911',
             de: 'porsche-911-wartung', ca: 'manteniment-porsche-911' } },
  { id: 'tarifa-cayman', seccion: 'tarifas',
    slugs: { es: 'porsche-cayman-boxster-mantenimiento-taller', en: 'porsche-cayman-boxster-servicing',
             fr: 'entretien-porsche-cayman-boxster', it: 'manutenzione-porsche-cayman-boxster',
             de: 'porsche-cayman-boxster-wartung', ca: 'manteniment-porsche-cayman-boxster' } },
  { id: 'tarifa-cayenne-macan', seccion: 'tarifas',
    slugs: { es: 'porsche-cayenne-macan-mantenimiento-taller-1', en: 'porsche-cayenne-macan-servicing',
             fr: 'entretien-porsche-cayenne-macan', it: 'manutenzione-porsche-cayenne-macan',
             de: 'porsche-cayenne-macan-wartung', ca: 'manteniment-porsche-cayenne-macan' } },
  { id: 'tarifa-gt', seccion: 'tarifas',
    slugs: { es: 'porsche-gt-mantenimiento-taller', en: 'porsche-gt-servicing',
             fr: 'entretien-porsche-gt', it: 'manutenzione-porsche-gt',
             de: 'porsche-gt-wartung', ca: 'manteniment-porsche-gt' } },
  { id: 'tarifa-turbo', seccion: 'tarifas',
    slugs: { es: 'porsche-turbo-mantenimiento-taller', en: 'porsche-turbo-servicing',
             fr: 'entretien-porsche-turbo', it: 'manutenzione-porsche-turbo',
             de: 'porsche-turbo-wartung', ca: 'manteniment-porsche-turbo' } },
  { id: 'tarifa-transaxle', seccion: 'tarifas',
    slugs: { es: 'porsche-transaxle-mantenimiento-taller', en: 'porsche-transaxle-servicing',
             fr: 'entretien-porsche-transaxle', it: 'manutenzione-porsche-transaxle',
             de: 'porsche-transaxle-wartung', ca: 'manteniment-porsche-transaxle' } },

  // ── Servicios del taller ────────────────────────────────────────────────
  { id: 'taller-mantenimiento', seccion: 'taller',
    slugs: { es: 'taller-porsche/mantenimiento', en: 'porsche-workshop/servicing', fr: 'atelier-porsche/entretien', it: 'officina-porsche/manutenzione', de: 'porsche-werkstatt/wartung', ca: 'taller-porsche/manteniment' } },
  { id: 'taller-tarifas', seccion: 'taller',
    slugs: { es: 'taller-porsche/tarifas', en: 'porsche-workshop/prices', fr: 'atelier-porsche/tarifs', it: 'officina-porsche/tariffe', de: 'porsche-werkstatt/preise', ca: 'taller-porsche/tarifes' } },
  { id: 'taller-ims', seccion: 'taller',
    slugs: { es: 'taller-porsche/reparacion-ims', en: 'porsche-workshop/ims-repair', fr: 'atelier-porsche/reparation-ims', it: 'officina-porsche/riparazione-ims', de: 'porsche-werkstatt/ims-reparatur', ca: 'taller-porsche/reparacio-ims' } },
  { id: 'taller-bore-scoring', seccion: 'taller',
    slugs: { es: 'taller-porsche/bore-scoring', en: 'porsche-workshop/bore-scoring', fr: 'atelier-porsche/bore-scoring', it: 'officina-porsche/bore-scoring', de: 'porsche-werkstatt/bore-scoring', ca: 'taller-porsche/bore-scoring' } },
  { id: 'taller-motores', seccion: 'taller',
    slugs: { es: 'taller-porsche/motores', en: 'porsche-workshop/engines', fr: 'atelier-porsche/moteurs', it: 'officina-porsche/motori', de: 'porsche-werkstatt/motoren', ca: 'taller-porsche/motors' } },
  { id: 'taller-cajas', seccion: 'taller',
    slugs: { es: 'taller-porsche/cajas-de-cambio', en: 'porsche-workshop/gearboxes', fr: 'atelier-porsche/boites-de-vitesses', it: 'officina-porsche/cambi', de: 'porsche-werkstatt/getriebe', ca: 'taller-porsche/caixes-de-canvi' } },
  { id: 'taller-pintura', seccion: 'taller',
    slugs: { es: 'taller-porsche/pintura-carroceria', en: 'porsche-workshop/paint-bodywork', fr: 'atelier-porsche/peinture-carrosserie', it: 'officina-porsche/verniciatura-carrozzeria', de: 'porsche-werkstatt/lack-karosserie', ca: 'taller-porsche/pintura-carrosseria' } },
  { id: 'taller-pre-compra', seccion: 'taller',
    slugs: { es: 'taller-porsche/inspeccion-pre-compra', en: 'porsche-workshop/pre-purchase-inspection', fr: 'atelier-porsche/inspection-avant-achat', it: 'officina-porsche/ispezione-pre-acquisto', de: 'porsche-werkstatt/ankaufsuntersuchung', ca: 'taller-porsche/inspeccio-pre-compra' } },
  { id: 'taller-servicio-tecnico', seccion: 'taller',
    slugs: { es: 'taller-porsche/servicio-tecnico', en: 'porsche-workshop/technical-service', fr: 'atelier-porsche/service-technique', it: 'officina-porsche/servizio-tecnico', de: 'porsche-werkstatt/technischer-service', ca: 'taller-porsche/servei-tecnic' } },
  { id: 'taller-storage', seccion: 'taller',
    slugs: { es: 'taller-porsche/storage', en: 'porsche-workshop/vehicle-storage', fr: 'atelier-porsche/stockage', it: 'officina-porsche/rimessaggio', de: 'porsche-werkstatt/einlagerung', ca: 'taller-porsche/emmagatzematge' } },

  // ── Proyectos y restauracion ────────────────────────────────────────────
  { id: 'restauraciones-integrales', seccion: 'servicios',
    slugs: { es: 'restauraciones/integrales', en: 'porsche-restoration/full-restoration', fr: 'restauration-porsche/integrale', it: 'restauro-porsche/integrale', de: 'porsche-restaurierung/komplettrestaurierung', ca: 'restauracions/integrals' } },
  { id: 'restauraciones-backdating', seccion: 'servicios',
    slugs: { es: 'restauraciones/backdating', en: 'porsche-restoration/backdating', fr: 'restauration-porsche/backdating', it: 'restauro-porsche/backdating', de: 'porsche-restaurierung/backdating', ca: 'restauracions/backdating' } },
  { id: 'restauraciones-restomod', seccion: 'servicios',
    slugs: { es: 'restauraciones/restomod', en: 'porsche-restoration/restomod', fr: 'restauration-porsche/restomod', it: 'restauro-porsche/restomod', de: 'porsche-restaurierung/restomod', ca: 'restauracions/restomod' } },
  { id: 'restauraciones-personalizacion', seccion: 'servicios',
    slugs: { es: 'restauraciones/personalizacion', en: 'porsche-restoration/customisation', fr: 'restauration-porsche/personnalisation', it: 'restauro-porsche/personalizzazione', de: 'porsche-restaurierung/individualisierung', ca: 'restauracions/personalitzacio' } },
  { id: 'restauraciones-proyectos', seccion: 'servicios',
    slugs: { es: 'restauraciones/proyectos-y-diseno', en: 'porsche-restoration/projects-design', fr: 'restauration-porsche/projets-design', it: 'restauro-porsche/progetti-design', de: 'porsche-restaurierung/projekte-design', ca: 'restauracions/projectes-i-disseny' } },

  // ── Builds: los Porsche construidos enteros por la casa ─────────────────
  { id: 'builds', seccion: 'builds',
    slugs: { es: 'builds', en: 'builds', fr: 'builds', it: 'builds', de: 'builds', ca: 'builds' } },
  { id: 'build-pa10-01', seccion: 'builds',
    slugs: { es: 'builds/pa10-01', en: 'builds/pa10-01', fr: 'builds/pa10-01', it: 'builds/pa10-01', de: 'builds/pa10-01', ca: 'builds/pa10-01' } },

  // ── Landings de compra ──────────────────────────────────────────────────
  { id: 'ocasion-997', seccion: 'coches',
    slugs: { es: 'porsche-997-de-segunda-mano', en: 'used-porsche-997', fr: 'porsche-997-occasion',
             it: 'porsche-997-usata', de: 'porsche-997-gebraucht', ca: 'porsche-997-de-segona-ma' } },
  { id: 'ocasion-996', seccion: 'coches',
    slugs: { es: 'porsche-996-de-segunda-mano', en: 'used-porsche-996', fr: 'porsche-996-occasion',
             it: 'porsche-996-usata', de: 'porsche-996-gebraucht', ca: 'porsche-996-de-segona-ma' } },
  { id: 'ocasion-992', seccion: 'coches',
    slugs: { es: 'porsche-992-de-segunda-mano', en: 'used-porsche-992', fr: 'porsche-992-occasion',
             it: 'porsche-992-usata', de: 'porsche-992-gebraucht', ca: 'porsche-992-de-segona-ma' } },

  // ── Institucional ───────────────────────────────────────────────────────
  { id: 'quienes-somos', seccion: 'empresa',
    slugs: { es: 'quienes-somos', en: 'about-us', fr: 'a-propos',
             it: 'chi-siamo', de: 'ueber-uns', ca: 'qui-som' } },
  { id: 'contacto', seccion: 'empresa',
    slugs: { es: 'contacto', en: 'contact', fr: 'contact',
             it: 'contatti', de: 'kontakt', ca: 'contacte' } },
  { id: 'vende', seccion: 'empresa',
    slugs: { es: 'vende-tu-porsche', en: 'sell-your-porsche', fr: 'vendez-votre-porsche',
             it: 'vendi-la-tua-porsche', de: 'porsche-verkaufen', ca: 'ven-el-teu-porsche' } },
  { id: 'magazine', seccion: 'magazine',
    slugs: SEGMENTOS.magazine },

  // ── Herramientas ────────────────────────────────────────────────────────
  // La v1 de la calculadora esta solo en castellano (los textos viven en
  // logica/ims/textos.es.ts). Los slugs de los otros cinco idiomas ya estan
  // aqui para cuando se traduzca, pero esas paginas NO se generan todavia y
  // el menu no las ofrece: ver Nav.astro.
  { id: 'herramientas', seccion: 'herramientas',
    slugs: { es: 'herramientas', en: 'tools', fr: 'outils',
             it: 'strumenti', de: 'werkzeuge', ca: 'eines' } },
  { id: 'calculadora-ims', seccion: 'herramientas',
    slugs: { es: 'herramientas/calculadora-ims-porsche', en: 'tools/porsche-ims-calculator',
             fr: 'outils/calculateur-ims-porsche', it: 'strumenti/calcolatore-ims-porsche',
             de: 'werkzeuge/porsche-ims-rechner', ca: 'eines/calculadora-ims-porsche' } },

  // ── Legales ─────────────────────────────────────────────────────────────
  { id: 'aviso-legal', seccion: 'legal',
    slugs: { es: 'aviso-legal', en: 'legal-notice', fr: 'mentions-legales',
             it: 'note-legali', de: 'impressum', ca: 'avis-legal' } },
  { id: 'privacidad', seccion: 'legal',
    slugs: { es: 'politica-de-privacidad', en: 'privacy-policy', fr: 'politique-de-confidentialite',
             it: 'informativa-privacy', de: 'datenschutz', ca: 'politica-de-privacitat' } },
  { id: 'cookies', seccion: 'legal',
    slugs: { es: 'politica-de-cookies', en: 'cookie-policy', fr: 'politique-de-cookies',
             it: 'informativa-cookie', de: 'cookie-richtlinie', ca: 'politica-de-cookies' } },
];

const POR_ID = new Map(RUTAS.map((r) => [r.id, r]));

export function ruta(id: string): Ruta {
  const r = POR_ID.get(id);
  if (!r) throw new Error(`Ruta desconocida: "${id}". Anadela a src/i18n/routes.ts.`);
  return r;
}

/** URL absoluta desde la raiz. `extra` son segmentos ya traducidos. */
export function url(id: string, idioma: Idioma, ...extra: string[]): string {
  const base = ruta(id).slugs[idioma];
  const partes = [prefijo(idioma), base, ...extra].filter(Boolean);
  return partes.length ? `/${partes.join('/').replace(/^\/+/, '')}` : '/';
}

export const urlAbsoluta = (id: string, idioma: Idioma, ...extra: string[]): string =>
  DOMINIO + url(id, idioma, ...extra);

/**
 * Alternantes hreflang de una pagina. `idiomas` limita el resultado a los que
 * existen de verdad: nunca se declara un hreflang hacia una pagina que no se
 * ha publicado.
 */
export function alternantes(
  id: string, idiomas: readonly Idioma[] = IDIOMAS, ...extra: string[]
): { idioma: Idioma; href: string }[] {
  return idiomas.map((i) => ({ idioma: i, href: urlAbsoluta(id, i, ...extra) }));
}

/** x-default apunta siempre al espanol, que es el idioma de origen. */
export const xDefault = (id: string, ...extra: string[]): string =>
  urlAbsoluta(id, POR_DEFECTO, ...extra);
