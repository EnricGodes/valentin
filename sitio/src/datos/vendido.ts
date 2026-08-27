import datos from './vendidos.json';

/**
 * Coches vendidos sin ficha recuperable.
 *
 * Sus URLs seguian dando 404 con busquedas y enlaces apuntando a ellas. En vez
 * de redirigirlas al listado -donde quien busca "porsche 993 carrera usa"
 * aterriza en algo generico y se va- se publica una pagina breve que dice lo
 * que fue el coche, que ya no esta, e invita a avisar si entra uno parecido.
 */
export interface Vendido {
  slug: string;
  nombre: string;
  anio: string;
  detalle: string;
  descripcion: string;
  /** Datos que faltan y que tiene que completar Valentin. */
  pendiente: string[];
}

export const VENDIDOS: Vendido[] = datos.coches;

export const vendidoPorSlug = (slug: string): Vendido | undefined =>
  VENDIDOS.find((v) => v.slug === slug);
