import { DOMINIO } from '../../i18n/config';

/**
 * La organizacion, para citarla desde cualquier JSON-LD.
 *
 * El publisher de un articulo o el seller de un coche no pueden ser solo un
 * `@id`: la Organization completa solo se publica en la home, los centros y
 * contacto, y Google lee cada pagina por separado. Una referencia que no se
 * resuelve en la propia pagina es un publisher sin nombre. Por eso se repiten
 * aqui los datos minimos.
 */
export const ID_ORGANIZACION = `${DOMINIO}/#organizacion`;

export const LOGO = `${DOMINIO}/logo-valentin.webp`;

export const ORGANIZACION_MINIMA = {
  '@type': 'Organization',
  '@id': ID_ORGANIZACION,
  name: 'Valentín Motors',
  url: `${DOMINIO}/`,
  logo: { '@type': 'ImageObject', url: LOGO },
} as const;

export const PERFILES = ['https://www.instagram.com/valentinmotors'];
