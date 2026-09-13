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
  { id: 'centros', seccion: 'centros',
    slugs: { es: 'centros', en: 'locations', fr: 'centres',
             it: 'sedi', de: 'standorte', ca: 'centres' } },
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
  { id: 'storage', seccion: 'servicios',
    slugs: { es: 'storage-porsche', en: 'porsche-vehicle-storage', fr: 'stockage-porsche', it: 'rimessaggio-porsche', de: 'porsche-einlagerung', ca: 'emmagatzematge-porsche' } },

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

  // ── Landings de compra: una por generacion ──────────────────────────────
  // Los slugs de 997, 996 y 992 vienen de Squarespace y posicionan: no se tocan.
  // Los demas siguen el mismo patron. "segunda mano" y no "ocasion" porque
  // en Espana se busca nueve veces mas (Trends, 2026).
  { id: 'ocasion-356', seccion: 'coches',
    slugs: { es: 'porsche-356-de-segunda-mano', en: 'used-porsche-356', fr: 'porsche-356-occasion',
             it: 'porsche-356-usata', de: 'porsche-356-gebraucht', ca: 'porsche-356-de-segona-ma' } },
  { id: 'ocasion-911', seccion: 'coches',
    slugs: { es: 'porsche-911-clasico-de-segunda-mano', en: 'used-porsche-classic-911', fr: 'porsche-911-classique-occasion',
             it: 'porsche-911-classica-usata', de: 'porsche-911-klassiker-gebraucht', ca: 'porsche-911-classic-de-segona-ma' } },
  { id: 'ocasion-930', seccion: 'coches',
    slugs: { es: 'porsche-930-turbo-de-segunda-mano', en: 'used-porsche-930-turbo', fr: 'porsche-930-turbo-occasion',
             it: 'porsche-930-turbo-usata', de: 'porsche-930-turbo-gebraucht', ca: 'porsche-930-turbo-de-segona-ma' } },
  { id: 'ocasion-964', seccion: 'coches',
    slugs: { es: 'porsche-964-de-segunda-mano', en: 'used-porsche-964', fr: 'porsche-964-occasion',
             it: 'porsche-964-usata', de: 'porsche-964-gebraucht', ca: 'porsche-964-de-segona-ma' } },
  { id: 'ocasion-993', seccion: 'coches',
    slugs: { es: 'porsche-993-de-segunda-mano', en: 'used-porsche-993', fr: 'porsche-993-occasion',
             it: 'porsche-993-usata', de: 'porsche-993-gebraucht', ca: 'porsche-993-de-segona-ma' } },
  { id: 'ocasion-996', seccion: 'coches',
    slugs: { es: 'porsche-996-de-segunda-mano', en: 'used-porsche-996', fr: 'porsche-996-occasion',
             it: 'porsche-996-usata', de: 'porsche-996-gebraucht', ca: 'porsche-996-de-segona-ma' } },
  { id: 'ocasion-997', seccion: 'coches',
    slugs: { es: 'porsche-997-de-segunda-mano', en: 'used-porsche-997', fr: 'porsche-997-occasion',
             it: 'porsche-997-usata', de: 'porsche-997-gebraucht', ca: 'porsche-997-de-segona-ma' } },
  { id: 'ocasion-991', seccion: 'coches',
    slugs: { es: 'porsche-991-de-segunda-mano', en: 'used-porsche-991', fr: 'porsche-991-occasion',
             it: 'porsche-991-usata', de: 'porsche-991-gebraucht', ca: 'porsche-991-de-segona-ma' } },
  { id: 'ocasion-992', seccion: 'coches',
    slugs: { es: 'porsche-992-de-segunda-mano', en: 'used-porsche-992', fr: 'porsche-992-occasion',
             it: 'porsche-992-usata', de: 'porsche-992-gebraucht', ca: 'porsche-992-de-segona-ma' } },
  { id: 'ocasion-986', seccion: 'coches',
    slugs: { es: 'porsche-986-boxster-de-segunda-mano', en: 'used-porsche-986-boxster', fr: 'porsche-986-boxster-occasion',
             it: 'porsche-986-boxster-usata', de: 'porsche-986-boxster-gebraucht', ca: 'porsche-986-boxster-de-segona-ma' } },
  { id: 'ocasion-987', seccion: 'coches',
    slugs: { es: 'porsche-987-boxster-cayman-de-segunda-mano', en: 'used-porsche-987-boxster-cayman', fr: 'porsche-987-boxster-cayman-occasion',
             it: 'porsche-987-boxster-cayman-usata', de: 'porsche-987-boxster-cayman-gebraucht', ca: 'porsche-987-boxster-cayman-de-segona-ma' } },
  { id: 'ocasion-981', seccion: 'coches',
    slugs: { es: 'porsche-981-boxster-cayman-de-segunda-mano', en: 'used-porsche-981-boxster-cayman', fr: 'porsche-981-boxster-cayman-occasion',
             it: 'porsche-981-boxster-cayman-usata', de: 'porsche-981-boxster-cayman-gebraucht', ca: 'porsche-981-boxster-cayman-de-segona-ma' } },
  { id: 'ocasion-718', seccion: 'coches',
    slugs: { es: 'porsche-718-boxster-cayman-de-segunda-mano', en: 'used-porsche-718-boxster-cayman', fr: 'porsche-718-boxster-cayman-occasion',
             it: 'porsche-718-boxster-cayman-usata', de: 'porsche-718-boxster-cayman-gebraucht', ca: 'porsche-718-boxster-cayman-de-segona-ma' } },
  { id: 'ocasion-912', seccion: 'coches',
    slugs: { es: 'porsche-912-de-segunda-mano', en: 'used-porsche-912', fr: 'porsche-912-occasion',
             it: 'porsche-912-usata', de: 'porsche-912-gebraucht', ca: 'porsche-912-de-segona-ma' } },
  { id: 'ocasion-914', seccion: 'coches',
    slugs: { es: 'porsche-914-de-segunda-mano', en: 'used-porsche-914', fr: 'porsche-914-occasion',
             it: 'porsche-914-usata', de: 'porsche-914-gebraucht', ca: 'porsche-914-de-segona-ma' } },
  { id: 'ocasion-924', seccion: 'coches',
    slugs: { es: 'porsche-924-de-segunda-mano', en: 'used-porsche-924', fr: 'porsche-924-occasion',
             it: 'porsche-924-usata', de: 'porsche-924-gebraucht', ca: 'porsche-924-de-segona-ma' } },
  { id: 'ocasion-928', seccion: 'coches',
    slugs: { es: 'porsche-928-de-segunda-mano', en: 'used-porsche-928', fr: 'porsche-928-occasion',
             it: 'porsche-928-usata', de: 'porsche-928-gebraucht', ca: 'porsche-928-de-segona-ma' } },
  { id: 'ocasion-944', seccion: 'coches',
    slugs: { es: 'porsche-944-de-segunda-mano', en: 'used-porsche-944', fr: 'porsche-944-occasion',
             it: 'porsche-944-usata', de: 'porsche-944-gebraucht', ca: 'porsche-944-de-segona-ma' } },
  { id: 'ocasion-968', seccion: 'coches',
    slugs: { es: 'porsche-968-de-segunda-mano', en: 'used-porsche-968', fr: 'porsche-968-occasion',
             it: 'porsche-968-usata', de: 'porsche-968-gebraucht', ca: 'porsche-968-de-segona-ma' } },
  { id: 'ocasion-cayenne', seccion: 'coches',
    slugs: { es: 'porsche-cayenne-de-segunda-mano', en: 'used-porsche-cayenne', fr: 'porsche-cayenne-occasion',
             it: 'porsche-cayenne-usata', de: 'porsche-cayenne-gebraucht', ca: 'porsche-cayenne-de-segona-ma' } },
  { id: 'ocasion-macan', seccion: 'coches',
    slugs: { es: 'porsche-macan-de-segunda-mano', en: 'used-porsche-macan', fr: 'porsche-macan-occasion',
             it: 'porsche-macan-usata', de: 'porsche-macan-gebraucht', ca: 'porsche-macan-de-segona-ma' } },
  { id: 'ocasion-panamera', seccion: 'coches',
    slugs: { es: 'porsche-panamera-de-segunda-mano', en: 'used-porsche-panamera', fr: 'porsche-panamera-occasion',
             it: 'porsche-panamera-usata', de: 'porsche-panamera-gebraucht', ca: 'porsche-panamera-de-segona-ma' } },

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
  { id: 'evaluador-bore-scoring', seccion: 'herramientas',
    slugs: { es: 'herramientas/evaluador-bore-scoring-porsche',
             en: 'tools/porsche-bore-scoring-checker',
             fr: 'outils/evaluateur-bore-scoring-porsche',
             it: 'strumenti/valutatore-bore-scoring-porsche',
             de: 'werkzeuge/porsche-bore-scoring-check',
             ca: 'eines/avaluador-bore-scoring-porsche' } },

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

/* ── Enlaces internos escritos en castellano ───────────────────────────────
   Los textos de src/datos y del Magazine se escriben una vez, en castellano, y
   se traducen despues. Sus `href` internos se quedan en castellano en las seis
   versiones, porque pedirle a quien traduce que ademas resuelva el slug de cada
   ruta es pedirle que mantenga a mano una copia del manifiesto.

   Asi que se resuelven al pintar: un enlace a /taller-porsche dentro de la
   pagina alemana sale como /de/porsche-werkstatt. Antes salia tal cual y mandaba
   al lector aleman a la version espanola. */
const POR_URL_ES = new Map(RUTAS.map((r) => [`/${r.slugs[POR_DEFECTO]}`, r.id]));

/** El Magazine no esta en el manifiesto: sus articulos son contenido. */
const MAGAZINE_ES = `/${SEGMENTOS.magazine[POR_DEFECTO]}/`;

/** Reescribe al idioma dado los `href` internos de un fragmento de HTML. */
export function enlazaEnIdioma(html: string, idioma: Idioma): string {
  if (idioma === POR_DEFECTO) return html;
  return html.replace(/href="(\/[^"#?]*)((?:[#?][^"]*)?)"/g, (todo, ruta: string, cola: string) => {
    const id = POR_URL_ES.get(ruta);
    if (id) return `href="${url(id, idioma)}${cola}"`;
    if (ruta.startsWith(MAGAZINE_ES)) {
      const slug = ruta.slice(MAGAZINE_ES.length);
      return `href="${url('magazine', idioma, slug)}${cola}"`;
    }
    return todo;
  });
}

/** x-default apunta siempre al espanol, que es el idioma de origen. */
export const xDefault = (id: string, ...extra: string[]): string =>
  urlAbsoluta(id, POR_DEFECTO, ...extra);
