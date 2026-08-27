/** Forma de los datos de una ficha de coche.
 *  Los JSON de datos/coches/ los genera _migracion/scripts/06_extraer_coches.py
 *  a partir de las fichas HTML originales. No editarlos a mano: regenerarlos. */

export interface Foto {
  src: string; alt: string; caption?: string;
  /** Dimensiones reales del fichero, leidas del JPG al extraer. */
  ancho: number; alto: number;
}
export interface Cabecera { etiqueta: string; titulo?: string; destacado?: string; }

export interface Estadistica {
  valor: number | string;
  /** true si sube con el contador animado; false si es texto fijo (PASM, 911/01). */
  animado: boolean;
  unidad: string;
  etiqueta: string;
  destacada: boolean;
}

export interface Coche {
  slug: string;
  /** Solo en los ficheros traducidos. Lo calcula el importador. */
  traduccion?: { hechas: number; total: number; completa: boolean };
  archivoOriginal: string;
  realce: string;
  meta: { titulo: string; descripcion: string; ogImagen: string };
  hero: {
    eyebrow: string; subtitulo: string; titulo: string; claim: string;
    imagen: string; precio: string; precioLabel: string; scrollLabel: string;
  };
  intro: Cabecera & {
    parrafos: string[]; cita: string;
    datos: { clave: string; valor: string; acento: boolean }[];
  };
  galeria: Cabecera & { fotos: Foto[] };
  ingenieria: Cabecera & { stats: Estadistica[]; parrafos: string[]; tags: string[] };
  kit?: Cabecera & {
    ancla: string; precio: string;
    categorias: { titulo: string; items: string[] }[];
  };
  exterior: Cabecera & { texto: string; fotos: Foto[] };
  interior: Cabecera & { fotos: Foto[]; editorial: string };
  procedencia: Cabecera & {
    hitos: { anio: string; titulo: string; cuerpo: string; badge: string }[];
  };
  specs: Cabecera & {
    grupos: { titulo: string; filas: { clave: string; valor: string }[] }[];
  };
  opinion?: Cabecera & {
    foto: string; fotoAncho: number; fotoAlto: number;
    nombre: string; rol: string; bio: string; intro: string;
    parrafos: string[]; prosTitulo: string; pros: string[];
    contrasTitulo: string; contras: string[];
  };
  /** Datos de la tarjeta en el catalogo, extraidos de index.html. */
  catalogo?: {
    estado: 'disponible' | 'reservado' | 'vendido' | 'proximamente';
    estadoTexto: string; marca: string; nombre: string; detalle: string;
    descripcion: string; precio: string; precioPorConsultar: boolean;
    imagen: string; imagenAncho: number; imagenAlto: number;
  };
  cierre: {
    imagen: string; cita: string;
    precio: string;
    /** Un coche reservado o vendido muestra el precio tachado. */
    precioTachado: boolean;
    precioLabel: string;
    /** "Vehiculo reservado" y similares. */
    aviso: string;
    /** "Este vehiculo ya no esta disponible para la venta." */
    nota: string;
    ctaTexto: string; ctaHref: string;
  };
}

import { POR_DEFECTO, esIdioma, type Idioma } from '../i18n/config';

/** `997.json` es el espanol; `997.de.json`, el aleman. */
const modulos = import.meta.glob<Coche>('./coches/*.json', { eager: true, import: 'default' });

function idiomaDe(ruta: string): Idioma {
  const partes = ruta.split('/').pop()!.replace(/\.json$/, '').split('.');
  const sufijo = partes.length > 1 ? partes.at(-1)! : '';
  return esIdioma(sufijo) ? sufijo : POR_DEFECTO;
}

const TODOS: { idioma: Idioma; coche: Coche }[] =
  Object.entries(modulos).map(([ruta, coche]) => ({ idioma: idiomaDe(ruta), coche }));

/** Orden de aparicion en el catalogo. Los que no estan aqui van al final. */
const ORDEN = [
  '997-ruf-kompressor',
  'porsche-356-b-cabriolet-1960',
  'porsche-911-22-t-targa',
  'porsche-porsche-991-carrera-s-cabrio',
  'porsche-997-manual',
  'porsche-997-carrera-4s-triptronic',
];

const porOrden = (a: Coche, b: Coche) =>
  (ORDEN.indexOf(a.slug) + 1 || 99) - (ORDEN.indexOf(b.slug) + 1 || 99);

/** Fichas realmente publicadas en un idioma.
 *
 *  No se publica una ficha en aleman con el texto en espanol: seria contenido
 *  duplicado en cinco URLs y, sobre todo, esa pagina no podria declararse a si
 *  misma en el hreflang. Un idioma sin traducir sencillamente no tiene ficha. */
export const cochesDe = (idioma: Idioma): Coche[] =>
  TODOS.filter((x) => x.idioma === idioma &&
                      (idioma === POR_DEFECTO || x.coche.traduccion?.completa !== false))
       .map((x) => x.coche).sort(porOrden);

/** Idiomas en los que el catalogo tiene algo que enseñar. */
export const idiomasConCatalogo = (): Idioma[] =>
  [...new Set(TODOS.filter((x) => x.idioma === POR_DEFECTO ||
                                  x.coche.traduccion?.completa !== false)
                   .map((x) => x.idioma))];

export const COCHES: Coche[] = cochesDe(POR_DEFECTO);

export const idiomasDeCoche = (slug: string): Idioma[] =>
  TODOS.filter((x) => x.coche.slug === slug &&
                      (x.idioma === POR_DEFECTO || x.coche.traduccion?.completa !== false))
       .map((x) => x.idioma);

export const cochePorSlug = (slug: string, idioma: Idioma = POR_DEFECTO): Coche | undefined =>
  TODOS.find((x) => x.idioma === idioma && x.coche.slug === slug)?.coche
  ?? TODOS.find((x) => x.idioma === POR_DEFECTO && x.coche.slug === slug)?.coche;
