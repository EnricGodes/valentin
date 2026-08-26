import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Magazine. Los posts los genera la migracion desde el JSON de Squarespace
 * (_migracion/scripts/02_extraer_posts.py) y los publica aqui
 * 08_publicar_magazine.py. No editarlos a mano mientras el sitio viejo siga
 * vivo: se regeneran.
 */
const magazine = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/magazine' }),
  schema: z.object({
    title: z.string(),
    /** Slug que tenia en Squarespace. */
    slug: z.string(),
    /** Slug con el que se publica. Distinto solo en los 18 ilegibles. */
    slugFinal: z.string(),
    slugOriginal: z.string(),
    date: z.coerce.date(),
    lang: z.string().default('es'),
    categories: z.array(z.string()).default([]),
    excerpt: z.string().default(''),
    author: z.string().default(''),
    squarespaceId: z.string().optional(),
    originalUrl: z.string().optional(),
    ctas: z.array(z.object({ texto: z.string(), href: z.string() })).default([]),
  }),
});

export const collections = { magazine };
