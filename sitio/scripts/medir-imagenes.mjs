/**
 * Mide las fotos del Magazine y deja las medidas en un manifiesto.
 *
 * Las fotos sueltas del cuerpo salen de Markdown, `![alt](/img/...)`, y ahi no
 * hay sitio para el ancho y el alto. Sin ellos el navegador no reserva espacio:
 * la foto vale 0 px de alto hasta que descarga, la pagina salta cuando llega
 * (CLS) y, en la rejilla nueva, una columna entera se colapsa.
 *
 * Las de galeria no tienen el problema porque remark-modulos les pone las
 * medidas; estas no las tenia nadie.
 *
 * Se ejecuta con `npm run assets` y con `npm run medios`, o sea antes de
 * cualquier build. El JSON se versiona para que un clon recien hecho compile
 * bien sin haber pasado todavia por sharp.
 */
import sharp from 'sharp';
import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const fotos = resolve(aqui, '../public/img/magazine');
const salida = resolve(aqui, '../src/datos/medidas-magazine.json');

const ES_FOTO = /\.(jpe?g|png|webp|avif|gif)$/i;

const ficheros = (await readdir(fotos, { withFileTypes: true }))
  .filter((f) => f.isFile() && ES_FOTO.test(f.name))
  .map((f) => f.name)
  .sort();

const medidas = {};
let fallos = 0;

await Promise.all(ficheros.map(async (nombre) => {
  try {
    const { width, height } = await sharp(join(fotos, nombre)).metadata();
    if (width && height) medidas[`/img/magazine/${nombre}`] = [width, height];
  } catch {
    fallos += 1;
  }
}));

// Ordenado: si no, cada pasada de sharp reordena el fichero y el diff miente
const ordenado = Object.fromEntries(Object.keys(medidas).sort().map((k) => [k, medidas[k]]));
await writeFile(salida, `${JSON.stringify(ordenado, null, 0)}\n`);

console.log(`medidas: ${Object.keys(ordenado).length} fotos del magazine`);
if (fallos) console.log(`  ${fallos} no se pudieron leer`);
