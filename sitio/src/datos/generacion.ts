/**
 * Generaciones de Porsche y sus landings de compra.
 *
 * Quien busca "porsche 997 segunda mano" no quiere el catalogo entero: quiere
 * los 997. Las landings `ocasion-997`, `ocasion-996`... existian como texto
 * fijo heredado de Squarespace, sin un solo coche dentro. Aqui se les da lo
 * que les faltaba: saber que coches son suyos.
 *
 * La generacion sale del slug del coche, no de un campo nuevo en 42 JSON. Un
 * slug de Valentin siempre lleva el numero de tipo ("porsche-997-manual",
 * "porsche996coupecarreratiptronic", "997-ruf-kompressor"), y un numero de
 * tres cifras que empieza por 9 y no forma parte de otro numero es un tipo
 * Porsche. "1960" no cuela: el 9 va detras de otra cifra.
 */
import { RUTAS } from '../i18n/routes';
import { POR_DEFECTO, type Idioma } from '../i18n/config';
import { cochesDe, cochePorSlug, idiomasDeCoche, type Coche } from './coche';
import { VENDIDOS, type Vendido } from './vendido';

export const generacionDe = (slug: string): string | undefined =>
  slug.match(/(?:^|[^0-9])(9\d\d)(?![0-9])/)?.[1];

/** Landings de compra que existen en el manifiesto: `ocasion-997` -> "997". */
export const GENERACIONES_CON_LANDING: { generacion: string; rutaId: string }[] =
  RUTAS.filter((r) => /^ocasion-\d{3}$/.test(r.id))
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
