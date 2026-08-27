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
    /** Titulo para el <title> y para Google, cuando debe decir algo distinto
     *  del titular del articulo. El H1 del post sigue usando `title`.
     *  Caso real: el articulo se titula "¿Que es el IMS de Porsche?", pero
     *  quien busca "ims porsche" ya sabe que es; lo que quiere saber es si le
     *  afecta y cuanto cuesta arreglarlo. */
    metaTitulo: z.string().optional(),
    /** Meta description propia, cuando el excerpt no es lo que conviene
     *  ensenar en el resultado de busqueda. */
    metaDescripcion: z.string().optional(),
    /** Slug que tenia en Squarespace. NO se llama "slug": Astro reserva ese
     *  nombre como id de la entrada y las seis versiones de idioma colisionaban. */
    slugSquarespace: z.string(),
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
