import { getCollection } from 'astro:content';
import { IDIOMAS, type Idioma } from '../i18n/config';

/** Idiomas con al menos un articulo: en ellos existe el indice del Magazine. */
export async function idiomasDelMagazine(): Promise<Idioma[]> {
  const posts = await getCollection('magazine');
  const con = new Set(posts.map((p) => p.data.lang));
  return IDIOMAS.filter((i) => con.has(i));
}
