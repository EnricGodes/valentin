/**
 * Video del Magazine, listo para web.
 *
 * Los originales son los rescatados del HLS de Squarespace: 1080p a 3,2 Mbps
 * y con el atomo `moov` al final del fichero, lo que obliga al navegador a
 * descargar el video entero antes de pintar el primer fotograma. Ademas dos
 * de ellos pasan de 25 MB, que es el limite duro por fichero de Cloudflare
 * Pages: con ellos el deploy no sube.
 *
 * Aqui se recodifican con `-movflags +faststart` (moov delante, reproduccion
 * progresiva) y con el bitrate acotado. El 61% del trafico es movil.
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ejecutar = promisify(execFile);
const aqui = dirname(fileURLToPath(import.meta.url));
const origen  = resolve(aqui, '../../_migracion/contenido/videos');
const destino = resolve(aqui, '../public/video/magazine');

const CRF = 28;              // calidad visualmente indistinguible a este tamano
const MAXRATE = '1400k';     // deja margen de sobra bajo los 25 MB de Pages
const BUFSIZE = '2800k';
const MB = (b) => (b / 1024 / 1024).toFixed(1);
const forzar = process.argv.includes('--forzar');

if (!existsSync(origen)) {
  console.log('video: no hay originales en _migracion/contenido/videos, se omite');
  process.exit(0);
}

await mkdir(destino, { recursive: true });
const ficheros = (await readdir(origen)).filter((f) => f.endsWith('.mp4'));

let antes = 0, despues = 0, hechos = 0;
for (const f of ficheros) {
  const src = join(origen, f);
  const out = join(destino, f);
  const pesoOrigen = (await stat(src)).size;
  antes += pesoOrigen;

  // Ya recodificado y mas nuevo que el original: no se rehace.
  if (!forzar && existsSync(out) && (await stat(out)).mtimeMs > (await stat(src)).mtimeMs) {
    despues += (await stat(out)).size;
    continue;
  }

  await ejecutar('ffmpeg', [
    '-y', '-i', src,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF),
    '-maxrate', MAXRATE, '-bufsize', BUFSIZE,
    '-vf', "scale='min(1080,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
    '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '112k', '-ac', '2',
    '-movflags', '+faststart',
    out,
  ], { maxBuffer: 1024 * 1024 * 32 });

  const pesoFinal = (await stat(out)).size;
  despues += pesoFinal;
  hechos++;
  console.log(`  ${f.slice(0, 8)}  ${MB(pesoOrigen)} MB -> ${MB(pesoFinal)} MB`);
}

console.log(`video: ${ficheros.length} ficheros, ${hechos} recodificados, ` +
            `${MB(antes)} MB -> ${MB(despues)} MB`);

const grandes = [];
for (const f of ficheros) {
  const s = (await stat(join(destino, f))).size;
  if (s > 25 * 1024 * 1024) grandes.push(`${f} (${MB(s)} MB)`);
}
if (grandes.length) {
  console.error('ERROR: pasan del limite de 25 MB por fichero de Cloudflare Pages:');
  grandes.forEach((g) => console.error('  ' + g));
  process.exit(1);
}
