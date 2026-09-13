// @ts-check
import { defineConfig } from 'astro/config';
import rehypeMedios from './plugins/rehype-medios.mjs';
import rehypeEditorial from './plugins/rehype-editorial.mjs';
import rehypeJordi from './plugins/rehype-jordi.mjs';
import remarkDirective from 'remark-directive';
import remarkModulos from './plugins/remark-modulos.mjs';
import sitemap from '@astrojs/sitemap';

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
  integrations: [
    sitemap({
      // La pagina interna de verificacion del sistema no entra en el sitemap
      filter: (url) => !url.includes('/sistema'),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en', fr: 'fr', it: 'it', de: 'de', ca: 'ca' },
      },
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
  image: { responsiveStyles: true },
  markdown: {
    // El orden importa: remarkDirective parsea `::: galeria`, y
    // remarkModulos lo convierte en el HTML del modulo.
    remarkPlugins: [remarkDirective, remarkModulos],
    // rehypeMedios prepara cada media; rehypeJordi agrupa la opinion de Jordi
    // en su bloque; rehypeEditorial coloca cada bloque en la rejilla del
    // articulo. Primero el contenido, luego el sitio.
    rehypePlugins: [rehypeMedios, rehypeJordi, rehypeEditorial],
  },
});
