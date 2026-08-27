/**
 * Guarda de despliegue: comprueba que los medios estan donde el sitio los
 * espera ANTES de que Astro construya.
 *
 * Existe por un fallo real: `npm run assets` borra public/img y lo regenera
 * desde los originales, que viven fuera de git. Si esa tarea llegara a correr
 * en el servidor de despliegue, borraria las fotos y publicaria el Magazine
 * entero sin imagenes. Mejor que el build falle aqui, ruidosamente, a que se
 * publique un sitio roto.
 */
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const publico = resolve(aqui, '../public');

const MINIMOS = [
  ['img/magazine', 800, 'fotos del Magazine'],
  ['img/paginas',   90, 'fotos de las paginas'],
  ['img/ruf',        8, 'fotos de las fichas de coche'],
  ['video/magazine', 6, 'videos del Magazine'],
];

const LIMITE_PAGES = 25 * 1024 * 1024;

let fallos = 0;
for (const [ruta, minimo, que] of MINIMOS) {
  const dir = join(publico, ruta);
  const n = existsSync(dir) ? (await readdir(dir)).filter((f) => !f.startsWith('.')).length : 0;
  if (n < minimo) {
    console.error(`FALTAN ${que}: ${n} ficheros en public/${ruta}, se esperaban ${minimo} o mas`);
    fallos++;
  }
}

// El limite duro por fichero de Cloudflare Pages. Un solo fichero por encima
// tumba el despliegue entero, y el mensaje de Cloudflare no dice cual es.
const grandes = [];
const recorrer = async (dir) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await recorrer(p);
    else if ((await stat(p)).size > LIMITE_PAGES) grandes.push(p.replace(publico, 'public'));
  }
};
if (existsSync(publico)) await recorrer(publico);
for (const g of grandes) {
  console.error(`DEMASIADO GRANDE para Cloudflare Pages (25 MB): ${g}`);
  fallos++;
}

if (fallos) {
  console.error('\nSi acabas de clonar el repo, los medios se generan con: npm run assets');
  process.exit(1);
}
console.log('medios: completos y dentro del limite de 25 MB por fichero');
