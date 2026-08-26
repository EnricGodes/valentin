export const IDIOMAS = ['es', 'en', 'fr', 'it', 'de', 'ca'] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** El espanol vive en la raiz, sin prefijo: ninguna URL posicionada se mueve. */
export const POR_DEFECTO: Idioma = 'es';

export const NOMBRE_IDIOMA: Record<Idioma, string> = {
  es: 'Espanol', en: 'English', fr: 'Francais', it: 'Italiano', de: 'Deutsch', ca: 'Catala',
};

/** Etiqueta hreflang de cada idioma. */
export const HREFLANG: Record<Idioma, string> = {
  es: 'es', en: 'en', fr: 'fr', it: 'it', de: 'de', ca: 'ca',
};

export const DOMINIO = 'https://www.valentinmotors.es';

export const esIdioma = (v: string): v is Idioma => (IDIOMAS as readonly string[]).includes(v);

/** Prefijo de URL del idioma: '' para espanol, '/en' para ingles, etc. */
export const prefijo = (i: Idioma): string => (i === POR_DEFECTO ? '' : `/${i}`);
