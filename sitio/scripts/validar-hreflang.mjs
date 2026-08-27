/**
 * Valida las alternantes hreflang sobre el sitio ya construido.
 *
 * Se ejecuta contra dist/ y no contra el manifiesto porque lo que Google lee es
 * el HTML: comprueba lo que de verdad se publica.
 *
 * Los tres errores que hacen que Google descarte el grupo entero:
 *   1. una alternante que apunta a una pagina que no existe
 *   2. falta de reciprocidad: A declara B pero B no declara A
 *   3. falta la autorreferencia o el x-default
 */
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(aqui, '../dist');
const DOMINIO = 'https://www.valentinmotors.es';

async function htmls(dir) {
  const fuera = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) fuera.push(...await htmls(p));
    else if (e.name.endsWith('.html')) fuera.push(p);
  }
  return fuera;
}

const aRuta = (f) => {
  const r = '/' + relative(DIST, f).replaceAll('\\', '/').replace(/\.html$/, '');
  return r === '/index' ? '/' : r;
};

const ficheros = await htmls(DIST);
const existe = new Set(ficheros.map(aRuta));

const paginas = new Map();
for (const f of ficheros) {
  const html = await readFile(f, 'utf8');
  if (/<meta name="robots" content="noindex/.test(html)) continue;
  const alt = [...html.matchAll(
    /<link rel="alternate" hreflang="([a-zA-Z-]+)" href="([^"]+)"/g)]
    .map(([, idioma, href]) => ({ idioma, href }));
  if (alt.length === 0) continue;
  paginas.set(aRuta(f), alt);
}

const fallos = [];
for (const [ruta, alt] of paginas) {
  const url = DOMINIO + (ruta === '/' ? '/' : ruta);

  if (!alt.some((a) => a.idioma === 'x-default')) {
    fallos.push(`${ruta}: sin x-default`);
  }
  const propias = alt.filter((a) => a.idioma !== 'x-default');
  if (!propias.some((a) => a.href === url || a.href === url.replace(/\/$/, ''))) {
    fallos.push(`${ruta}: no se declara a si misma`);
  }
  for (const { idioma, href } of alt) {
    const destino = href.replace(DOMINIO, '') || '/';
    if (!existe.has(destino)) {
      fallos.push(`${ruta} -> hreflang="${idioma}" apunta a ${destino}, que no existe`);
      continue;
    }
    if (idioma === 'x-default') continue;
    const vuelta = paginas.get(destino);
    if (!vuelta) continue;
    if (!vuelta.some((a) => a.href.replace(DOMINIO, '') === (ruta === '/' ? '/' : ruta))) {
      fallos.push(`sin reciprocidad: ${ruta} declara ${destino}, pero ${destino} no declara ${ruta}`);
    }
  }
}

console.log(`hreflang: ${paginas.size} paginas con alternantes, ${existe.size} paginas en dist`);
if (fallos.length) {
  console.error(`\nFALLOS (${fallos.length}):`);
  for (const f of fallos.slice(0, 25)) console.error(`  ! ${f}`);
  if (fallos.length > 25) console.error(`  … y ${fallos.length - 25} mas`);
  process.exit(1);
}
console.log('Alternantes correctas: reciprocas, autorreferenciadas y sin destinos rotos.');
