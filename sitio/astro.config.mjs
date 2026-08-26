// @ts-check
import { defineConfig } from 'astro/config';

/**
 * El espanol vive en la raiz, sin prefijo, para que ninguna de las URLs que hoy
 * posicionan cambie de sitio. Los cinco idiomas nuevos cuelgan de su prefijo.
 * Los slugs traducidos NO se resuelven aqui: salen del manifiesto
 * src/i18n/routes.ts, que es la fuente unica de verdad de rutas y hreflang.
 */
export default defineConfig({
  site: 'https://www.valentinmotors.es',
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    locales: ['es', 'en', 'fr', 'it', 'de', 'ca'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  image: { responsiveStyles: true },
});
