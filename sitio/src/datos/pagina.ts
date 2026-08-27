/** Paginas de contenido (servicios, tarifas, centros, institucional, legales).
 *  Los JSON los genera _migracion/scripts/11_extraer_paginas.py desde el HTML
 *  congelado de Squarespace. No editarlos a mano: se regeneran. */

export interface SeccionPagina {
  /** Nivel del encabezado original: 1 a 4. 0 si la seccion no tenia titulo. */
  nivel: number;
  titulo: string;
  parrafos: string[];
  items: string[];
  imagenes: { url: string; alt: string }[];
}

export interface Acordeon {
  /** Motorizacion o variante: "911 Pre 74", "Boxster 986"... */
  modelo: string;
  parrafos: string[];
  items: string[];
}

export type TipoPagina =
  | 'home' | 'servicio' | 'tarifa' | 'centro'
  | 'institucional' | 'contacto' | 'landing' | 'legal';

export interface Pagina {
  rutaId: string;
  tipo: TipoPagina;
  ficheroOriginal: string;
  meta: { titulo: string; descripcion: string; ogImagen: string };
  h1: string;
  acordeones: Acordeon[];
  secciones: SeccionPagina[];
  contacto: { telefonos: string[]; emails: string[] };
}

import { POR_DEFECTO, esIdioma, type Idioma } from '../i18n/config';

/**
 * Convencion de nombres: `taller.json` es el espanol y `taller.en.json` el
 * ingles. El espanol no lleva sufijo porque es el idioma de origen y vive en
 * la raiz del sitio.
 */
const modulos = import.meta.glob<Pagina>('./paginas/*.json', { eager: true, import: 'default' });

function idiomaDe(ruta: string): Idioma {
  const partes = ruta.split('/').pop()!.replace(/\.json$/, '').split('.');
  const sufijo = partes.length > 1 ? partes.at(-1)! : '';
  return esIdioma(sufijo) ? sufijo : POR_DEFECTO;
}

export const PAGINAS: { idioma: Idioma; pagina: Pagina }[] =
  Object.entries(modulos).map(([ruta, pagina]) => ({ idioma: idiomaDe(ruta), pagina }));

export const paginaPorRuta = (rutaId: string, idioma: Idioma = POR_DEFECTO): Pagina | undefined =>
  PAGINAS.find((x) => x.idioma === idioma && x.pagina.rutaId === rutaId)?.pagina;

/** Idiomas en los que una pagina existe de verdad. Alimenta el hreflang: no se
 *  declara una alternante hacia algo que no se ha traducido todavia. */
export const idiomasDe = (rutaId: string): Idioma[] =>
  PAGINAS.filter((x) => x.pagina.rutaId === rutaId).map((x) => x.idioma);

/** Las que se sirven por la ruta general; la home tiene pagina propia. */
export const PAGINAS_CONTENIDO = PAGINAS.filter((x) => x.pagina.tipo !== 'home');
