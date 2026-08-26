/**
 * Copia img/ (raiz del repo) a sitio/public/img/.
 *
 * Mientras el sitio viejo siga en Railway sirviendo /img/... desde la raiz, las
 * fotos tienen que existir en los dos sitios. Se copian en vez de versionarse
 * dos veces: public/img esta en .gitignore y la fuente de verdad sigue siendo
 * img/ en la raiz. Al apagar el sitio viejo, img/ se mueve aqui y esto se borra.
 */
import { cp, mkdir, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const origen = resolve(aqui, '../../img');
const destino = resolve(aqui, '../public/img');

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });
await cp(origen, destino, { recursive: true });
console.log(`fotos de coches: ${origen} -> ${destino}`);

// Imagenes del Magazine descargadas del CDN de Squarespace. Estan fuera de git
// por peso (415 MB); su destino final es Sanity. Hasta entonces se copian aqui
// para que los posts se vean.
const blog = resolve(aqui, '../../_migracion/contenido/imagenes');
const blogDest = resolve(destino, 'magazine');
if (existsSync(blog)) {
  await cp(blog, blogDest, { recursive: true });
  const n = (await readdir(blogDest)).length;
  console.log(`fotos del magazine: ${n} ficheros -> ${blogDest}`);
} else {
  console.warn('AVISO: no se encuentran las imagenes del Magazine.');
  console.warn('  Ejecuta _migracion/scripts/03_descargar_imagenes.py');
}

// Videos rescatados de Squarespace, que se servian por HLS y no sobreviven a
// la cancelacion de la cuenta.
const videos = resolve(aqui, '../../_migracion/contenido/videos');
const videosDest = resolve(aqui, '../public/video/magazine');
if (existsSync(videos)) {
  await rm(videosDest, { recursive: true, force: true });
  await mkdir(videosDest, { recursive: true });
  await cp(videos, videosDest, { recursive: true });
  const n = (await readdir(videosDest)).length;
  console.log(`videos del magazine: ${n} ficheros -> ${videosDest}`);
}
