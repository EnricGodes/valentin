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

const modulos = import.meta.glob<Pagina>('./paginas/*.json', { eager: true, import: 'default' });

export const PAGINAS: Pagina[] = Object.values(modulos);

export const paginaPorRuta = (rutaId: string): Pagina | undefined =>
  PAGINAS.find((p) => p.rutaId === rutaId);

/** Las que se sirven por la ruta general; la home tiene pagina propia. */
export const PAGINAS_CONTENIDO = PAGINAS.filter((p) => p.tipo !== 'home');
