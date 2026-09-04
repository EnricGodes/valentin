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
  /** Solo en los ficheros traducidos. Lo calcula el importador. */
  traduccion?: { hechas: number; total: number; completa: boolean };
  tipo: TipoPagina;
  ficheroOriginal: string;
  meta: { titulo: string; descripcion: string; ogImagen: string };
  h1: string;
  /** Rotulo corto para el menu. El h1 esta escrito para Google y para quien ya
      esta en la pagina ("Reparacion del IMS en motores M96 y M97"); un menu
      necesita "Reparacion del IMS". Si falta, se usa el h1. */
  menu?: string;
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

/** Idiomas en los que una pagina existe Y esta entera.
 *
 *  Una traduccion a medias no se publica: seria una pagina alemana con el
 *  noventa por ciento del texto en espanol, que ademas no podria declararse a
 *  si misma en el hreflang. Alimenta tanto el enrutado como las alternantes. */
export const idiomasDe = (rutaId: string): Idioma[] =>
  PAGINAS.filter((x) => x.pagina.rutaId === rutaId &&
                        (x.idioma === POR_DEFECTO || x.pagina.traduccion?.completa !== false))
         .map((x) => x.idioma);

/** Paginas listas para publicar, con su idioma. */
export const publicables = () =>
  PAGINAS.filter((x) => x.idioma === POR_DEFECTO || x.pagina.traduccion?.completa !== false);

/** Las que se sirven por la ruta general; la home tiene pagina propia. */
export const PAGINAS_CONTENIDO = publicables().filter((x) => x.pagina.tipo !== 'home');
