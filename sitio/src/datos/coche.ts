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

const modulos = import.meta.glob<Coche>('./coches/*.json', { eager: true, import: 'default' });

/** Orden de aparicion en el catalogo. Los que no estan aqui van al final. */
const ORDEN = [
  '997-ruf-kompressor',
  'porsche-356-b-cabriolet-1960',
  'porsche-911-22-t-targa',
  'porsche-porsche-991-carrera-s-cabrio',
  'porsche-997-manual',
  'porsche-997-carrera-4s-triptronic',
];

export const COCHES: Coche[] = Object.values(modulos).sort(
  (a, b) => (ORDEN.indexOf(a.slug) + 1 || 99) - (ORDEN.indexOf(b.slug) + 1 || 99),
);

export const cochePorSlug = (slug: string): Coche | undefined =>
  COCHES.find((c) => c.slug === slug);
