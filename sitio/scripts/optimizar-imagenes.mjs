/**
 * Optimiza las imagenes del Magazine, de las paginas y las tarjetas de coche.
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
 *
 * Paginas (home, servicios, centros): los originales de
 * _migracion/contenido/imagenes-paginas llegan a pesar 2,6 MB. Se dejan en
 * 1600px de lado largo con la misma ruta; un PNG sale como JPG (las rutas de
 * los JSON ya apuntan al .jpg).
 *
 * Coches: version de 800px de cada foto de img/<coche>/ en img/<coche>/800/,
 * para el srcset de las tarjetas del catalogo (TarjetaCoche.astro).
 */
import sharp from 'sharp';
import { mkdir, readdir, rm, stat } from 'node:fs/promises';
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

const ANCHO_PAGINAS = 1600;
const ANCHO_COCHE_TARJETA = 800;

await optimizarPaginas();
await tarjetasCoche();

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
        // Tope de alto: las fotos verticales de movil (1400x3032) pasaban de 1 MB
        .resize({ width: ancho, height: ancho * 1.5, fit: 'inside', withoutEnlargement: true })
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

async function optimizarPaginas() {
  const pags = resolve(aqui, '../../_migracion/contenido/imagenes-paginas');
  const pagsDest = resolve(aqui, '../public/img/paginas');
  if (!existsSync(pags)) return;
  await mkdir(pagsDest, { recursive: true });
  const fs = (await readdir(pags)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (let i = 0; i < fs.length; i += 6) {
    await Promise.all(fs.slice(i, i + 6).map(async (f) => {
      const out = join(pagsDest, f.replace(/\.png$/i, '.jpg'));
      await sharp(join(pags, f))
        .rotate()
        .resize({ width: ANCHO_PAGINAS, height: ANCHO_PAGINAS, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: CALIDAD, mozjpeg: true })
        .toFile(out);
      // sincronizar-imagenes copia el PNG original al lado: fuera del deploy
      if (/\.png$/i.test(f)) await rm(join(pagsDest, f), { force: true });
    }));
  }
  console.log(`paginas optimizadas: ${fs.length} imagenes a ${ANCHO_PAGINAS}px`);
}

async function tarjetasCoche() {
  const img = resolve(aqui, '../public/img');
  let n = 0;
  for (const coche of await readdir(img, { withFileTypes: true })) {
    const dir = join(img, coche.name);
    if (!coche.isDirectory() || !existsSync(join(dir, 'exterior1.jpg'))) continue;
    await mkdir(join(dir, '800'), { recursive: true });
    const fotos = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f));
    await Promise.all(fotos.map((f) => sharp(join(dir, f))
      .resize({ width: ANCHO_COCHE_TARJETA, withoutEnlargement: true })
      .jpeg({ quality: CALIDAD, mozjpeg: true })
      .toFile(join(dir, '800', f))));
    n += fotos.length;
  }
  console.log(`tarjetas de coche: ${n} fotos a ${ANCHO_COCHE_TARJETA}px`);
}
