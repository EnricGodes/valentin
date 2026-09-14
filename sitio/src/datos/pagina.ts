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
  /** Boton al final de la seccion, cuando el enlace es a lo que se viene y no
      una mencion de paso. */
  enlace?: { texto: string; href: string };
  /** Modulo interactivo que va detras de la seccion: "calculadora-ims". */
  modulo?: string;
}

export interface Acordeon {
  /** Motorizacion o variante: "911 Pre 74", "Boxster 986"... */
  modelo: string;
  parrafos: string[];
  items: string[];
}

export interface ServicioPagina {
  rutaId: string;
  titulo: string;
  parrafos: string[];
  foto: { url: string; alt: string };
  /** Enlace secundario, normalmente a un articulo del Magazine. */
  enlace?: { texto: string; href: string };
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
  /** Articulos del Magazine que sostienen esta pagina, por `slugFinal`. Una
      pagina de servicio dice lo que hacemos; el articulo lo ensena hecho, con
      cien fotos del trabajo. Enlazarlos es lo que convierte una pagina de
      servicio en algo que se puede leer. */
  articulos?: string[];
  /** Bloques de servicio de la pagina del taller: uno por entrada del menu,
      con su foto, su texto y el enlace a su pagina. */
  servicios?: ServicioPagina[];
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

/**
 * Las preguntas frecuentes de una pagina, separadas del resto.
 *
 * En los JSON viven como un H2 vacio ("Preguntas frecuentes", "FAQ",
 * "Häufig gestellte Fragen"...) seguido de H3, uno por pregunta, con la
 * respuesta en parrafos. Se localizan por la forma y no por el titulo, que
 * cambia en cada idioma: el ultimo H2 sin contenido al que solo siguen H3
 * con texto. Asi se pintan con su propia grafica y salen como FAQPage.
 */
export interface Faq { titulo: string; preguntas: { pregunta: string; respuesta: string[] }[] }

export function separarFaq(secciones: SeccionPagina[]): { resto: SeccionPagina[]; faq?: Faq } {
  const sinTexto = (s: SeccionPagina) => !s.parrafos.length && !s.items.length;
  for (let i = secciones.length - 1; i >= 0; i--) {
    const s = secciones[i];
    if (s.nivel === 3) continue;
    if (s.nivel !== 2 || !sinTexto(s)) break;
    const hijas = secciones.slice(i + 1);
    const preguntas = hijas
      .filter((h) => h.nivel === 3 && !sinTexto(h))
      .map((h) => ({ pregunta: h.titulo, respuesta: [...h.parrafos, ...h.items] }));
    if (preguntas.length >= 2 && preguntas.length === hijas.length) {
      /* En tres paginas la migracion colgo fotos del propio H2 de preguntas.
         Se quedan en el flujo, como un bloque de fotos sin titulo, antes de
         la banda de preguntas. */
      const resto = secciones.slice(0, i);
      if (s.imagenes.length) {
        resto.push({ nivel: 0, titulo: '', parrafos: [], items: [], imagenes: s.imagenes });
      }
      return { resto, faq: { titulo: s.titulo, preguntas } };
    }
    break;
  }
  return { resto: secciones };
}
