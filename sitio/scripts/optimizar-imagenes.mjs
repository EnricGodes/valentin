/**
 * Optimiza las imagenes del Magazine para la web.
 *
 * Los ficheros que se bajaron del CDN de Squarespace son los originales: 415 MB,
 * hasta 2,5 MB por foto. Servirlos tal cual repetiria en el sitio nuevo el
 * problema que la auditoria detecto en el viejo (35 de 54 URLs sin pasar Core
 * Web Vitals en movil, que es donde esta el 61% del trafico).
 *
 * Genera dos derivados y conserva las rutas:
 *   /img/magazine/<f>        maximo 1600px de ancho, para el cuerpo del post
 *   /img/magazine/card/<f>   maximo 700px, para las tarjetas del indice
 *
 * Los originales no se tocan: viven en _migracion/contenido/imagenes y su
 * destino es Sanity, que generara los derivados bajo demanda.
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const origen = resolve(aqui, '../../_migracion/contenido/imagenes');
const destino = resolve(aqui, '../public/img/magazine');
const destinoCard = join(destino, 'card');

// 1400 es el lado largo que ya usa el proyecto para las fotos de coche
// (ver CLAUDE.md); mantenerlo evita dos criterios distintos en el mismo sitio.
const ANCHO_CUERPO = 1400;
const ANCHO_TARJETA = 600;
const CALIDAD = 82;

if (!existsSync(origen)) {
  console.warn('AVISO: no hay imagenes del Magazine que optimizar.');
  process.exit(0);
}

await mkdir(destino, { recursive: true });
await mkdir(destinoCard, { recursive: true });

const ficheros = (await readdir(origen)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
let hechos = 0;

// De 6 en 6: sharp ya usa varios hilos por imagen
const tanda = 6;
for (let i = 0; i < ficheros.length; i += tanda) {
  await Promise.all(ficheros.slice(i, i + tanda).map(async (f) => {
    const src = join(origen, f);

    for (const [dir, ancho] of [[destino, ANCHO_CUERPO], [destinoCard, ANCHO_TARJETA]]) {
      const out = join(dir, f);
      await sharp(src)
        .rotate()                                   // respeta la orientacion EXIF
        .resize({ width: ancho, withoutEnlargement: true })
        .jpeg({ quality: CALIDAD, mozjpeg: true })
        .toFile(out);
    }
    hechos++;
  }));
  if (i % 120 === 0 && i) console.log(`  ${i}/${ficheros.length}`);
}

// Se mide el resultado en disco en vez de ir acumulando durante el bucle:
// un contador mal sumado da una cifra que parece verosimil y no lo es.
async function pesa(dir) {
  const fs = await readdir(dir, { withFileTypes: true });
  let n = 0;
  for (const e of fs) if (e.isFile()) n += (await stat(join(dir, e.name))).size;
  return n;
}
const mb = (n) => (n / 1024 / 1024).toFixed(1);
const [orig, cuerpo, tarjeta] = await Promise.all(
  [origen, destino, destinoCard].map(pesa));
console.log(`magazine optimizado: ${hechos} imagenes`);
console.log(`  originales ${mb(orig)} MB -> cuerpo ${mb(cuerpo)} MB ` +
            `(${Math.round((1 - cuerpo / orig) * 100)}% menos) + tarjetas ${mb(tarjeta)} MB`);
