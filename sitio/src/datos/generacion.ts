/**
 * Generaciones de Porsche y sus landings de compra.
 *
 * Quien busca "porsche 997 segunda mano" no quiere el catalogo entero: quiere
 * los 997. Cada generacion tiene su landing (`ocasion-997`, `ocasion-986`...)
 * y aqui se decide que coches son suyos.
 *
 * La generacion sale del slug del coche, no de un campo nuevo en 42 JSON. Un
 * slug de Valentin siempre lleva el tipo ("porsche-997-manual",
 * "porsche996coupecarreratiptronic", "997-ruf-kompressor", "porsche-981-
 * cayman-gts") o el nombre del modelo ("cayenne"). El RUF cuenta como 997:
 * lo es de base, y quien busca un 997 quiere verlo.
 */
import { RUTAS } from '../i18n/routes';
import { POR_DEFECTO, type Idioma } from '../i18n/config';
import { cochesDe, cochePorSlug, idiomasDeCoche, type Coche } from './coche';
import { VENDIDOS, type Vendido } from './vendido';

/* Tipos de fabrica con landing propia. El 911 va aparte: un 964 o un 997
   tambien son 911, asi que "911" solo se asigna si no hay un tipo mas concreto
   en el slug. El 718 es el tipo 982 en la documentacion de Porsche. */
const TIPOS = ['356', '912', '914', '924', '928', '930', '944', '964', '968',
               '981', '986', '987', '991', '992', '993', '996', '997'];
const ALIAS: Record<string, string> = { '718': '718', '982': '718' };
const NOMBRES = ['cayenne', 'macan', 'panamera'];

export function generacionDe(slug: string): string | undefined {
  const s = slug.toLowerCase();
  // Un numero de tres cifras que no forma parte de otro numero ("1960" no cuela).
  for (const m of s.matchAll(/(?:^|\D)(\d{3})(?!\d)/g)) {
    const n = m[1];
    if (TIPOS.includes(n)) return n;
    if (ALIAS[n]) return ALIAS[n];
  }
  for (const n of NOMBRES) if (s.includes(n)) return n;
  if (/(?:^|\D)911(?!\d)/.test(s)) return '911';
  return undefined;
}

/** Landings de compra que existen en el manifiesto: `ocasion-997` -> "997". */
export const GENERACIONES_CON_LANDING: { generacion: string; rutaId: string }[] =
  RUTAS.filter((r) => r.id.startsWith('ocasion-'))
       .map((r) => ({ generacion: r.id.slice('ocasion-'.length), rutaId: r.id }));

export const landingDeGeneracion = (generacion: string | undefined): string | undefined =>
  GENERACIONES_CON_LANDING.find((g) => g.generacion === generacion)?.rutaId;

/** La landing que corresponde a un coche por su slug, si la hay. */
export const landingDeCoche = (slug: string): string | undefined =>
  landingDeGeneracion(generacionDe(slug));

/** Un coche con ficha, en el idioma pedido o, si no esta traducido, en espanol. */
export interface CocheEnIdioma { coche: Coche; idioma: Idioma; }

/**
 * Todo lo que ha pasado por la casa de una generacion: lo que esta a la venta,
 * lo reservado y lo vendido. Se listan los coches del catalogo espanol, que es
 * el completo, y cada uno enlaza a su ficha traducida si existe. Una landing
 * alemana que dijera "no tenemos ningun 997" con tres en el catalogo espanol
 * estaria mintiendo.
 */
export function unidadesDeGeneracion(generacion: string, idioma: Idioma): {
  disponibles: CocheEnIdioma[];
  vendidos: CocheEnIdioma[];
  sinFicha: Vendido[];
} {
  const propios = cochesDe(POR_DEFECTO).filter((c) => generacionDe(c.slug) === generacion);
  const enIdioma = (c: Coche): CocheEnIdioma => {
    const traducido = idiomasDeCoche(c.slug).includes(idioma);
    return { coche: traducido ? (cochePorSlug(c.slug, idioma) ?? c) : c,
             idioma: traducido ? idioma : POR_DEFECTO };
  };
  return {
    disponibles: propios.filter((c) => c.catalogo?.estado !== 'vendido').map(enIdioma),
    vendidos: propios.filter((c) => c.catalogo?.estado === 'vendido').map(enIdioma),
    sinFicha: VENDIDOS.filter((v) => generacionDe(v.slug) === generacion),
  };
}

/* ── Lo que necesitan el pie y el Magazine ─────────────────────────────── */
import { url } from '../i18n/routes';
import { idiomasDe, paginaPorRuta } from './pagina';

/** Enlace a la landing de una generacion en el idioma pedido (o en espanol si
 *  no esta traducida), con su nombre legible. `undefined` si no hay landing. */
export function enlaceLanding(generacion: string | undefined, idioma: Idioma) {
  const rutaId = landingDeGeneracion(generacion);
  if (!rutaId) return undefined;
  const propio = idiomasDe(rutaId).includes(idioma);
  const p = paginaPorRuta(rutaId, propio ? idioma : POR_DEFECTO);
  if (!p) return undefined;
  return {
    rutaId, generacion: generacion!,
    href: url(rutaId, propio ? idioma : POR_DEFECTO),
    lang: propio ? undefined : POR_DEFECTO,
    nombre: p.menu ?? p.h1,
    /* "997", "911 clasico", "930 Turbo": sin la marca ni el "Boxster y
       Cayman", que en una linea de ocho enlaces se repetiria cuatro veces. */
    corto: (p.menu ?? p.h1).replace(/^Porsche /, '').replace(/ Boxster.*$/, ''),
  };
}

/** La landing que corresponde a una guia de modelo del Magazine, por su slug. */
export const enlaceLandingDeGuia = (slugFinal: string, idioma: Idioma) =>
  enlaceLanding(generacionDe(slugFinal), idioma);

/** Familias para el indice del pie: cinco lineas legibles, no veintidos filas. */
export const FAMILIAS: { id: string; generaciones: string[] }[] = [
  { id: '911',      generaciones: ['911', '930', '964', '993', '996', '997', '991', '992'] },
  { id: 'boxster',  generaciones: ['986', '987', '981', '718'] },
  { id: 'transaxle', generaciones: ['924', '944', '968', '928'] },
  { id: 'clasicos', generaciones: ['356', '912', '914'] },
  { id: 'suv',      generaciones: ['cayenne', 'macan', 'panamera'] },
];
