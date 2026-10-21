/**
 * Comprueba, sobre el sitio ya construido, que ninguna URL del sitio viejo se
 * pierde: cada una tiene que existir en dist/ o redirigir (301) a algo que
 * exista. Y que _redirects no tenga destinos rotos, cadenas ni reglas que
 * tapen una pagina real.
 *
 * Fuentes de URLs viejas, todas de _migracion/:
 *   informes/inventario_urls.csv       inventario completo de Squarespace
 *   baseline/gsc_top_pages_3m.csv      paginas con clics en Search Console
 *   baseline/ga4_top_pages_56d.csv     paginas con visitas en GA4
 *   baseline/404_heredados.csv         404 que Google seguia rastreando
 *   baseline/gsc_indexadas*.csv        export de "Paginas" de GSC, si existe
 *   snapshot/manifest.json             las 96 paginas capturadas
 *
 * Imita las reglas de Cloudflare Pages: coincidencia exacta, comodin final
 * `*` con `:splat`, y la barra final o el .html se normalizan antes.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(aqui, '../dist');
const MIGRACION = resolve(aqui, '../../_migracion');

async function ficheros(dir) {
  const fuera = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) fuera.push(...await ficheros(p));
    else fuera.push(p);
  }
  return fuera;
}

/* Lo que Cloudflare sirve: /foo.html se publica como /foo, /x/index.html como /x. */
const servido = new Set();
for (const f of await ficheros(DIST)) {
  const r = '/' + relative(DIST, f).replaceAll('\\', '/');
  servido.add(r);
  if (r.endsWith('.html')) {
    const sin = r.replace(/\.html$/, '').replace(/\/index$/, '') || '/';
    servido.add(sin === '/index' ? '/' : sin);
  }
}

const normalizar = (u) => {
  let p = u.startsWith('http') ? new URL(u).pathname : u.split(/[?#]/)[0];
  try { p = encodeURI(decodeURI(p)); } catch { /* ya codificada */ }
  if (p.length > 1) p = p.replace(/\/+$/, '').replace(/\.html$/, '');
  return p || '/';
};

const reglas = (await readFile(join(DIST, '_redirects'), 'utf8'))
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  .map((l) => {
    const [desde, hacia, codigo = '302'] = l.split(/\s+/);
    return { desde, hacia, codigo };
  });

const errores = [];
for (const r of reglas) {
  if (r.codigo !== '301' && r.codigo !== '308') errores.push(`_redirects: ${r.desde} usa ${r.codigo}, no 301`);
  if (!r.desde.includes('*') && servido.has(normalizar(r.desde))) {
    errores.push(`_redirects: ${r.desde} tapa una pagina que existe`);
  }
  const destino = r.hacia.replace(':splat', '');
  if (!r.hacia.includes(':splat') && !servido.has(normalizar(destino))) {
    errores.push(`_redirects: ${r.desde} -> ${r.hacia}, destino inexistente`);
  }
  if (reglas.some((o) => o !== r && normalizar(o.desde) === normalizar(r.hacia))) {
    errores.push(`_redirects: cadena ${r.desde} -> ${r.hacia} -> ...`);
  }
}

const redirige = (ruta) => {
  for (const r of reglas) {
    if (r.desde.endsWith('*')) {
      const base = r.desde.slice(0, -1);
      if (ruta.startsWith(base)) return r.hacia.replace(':splat', ruta.slice(base.length));
    } else if (normalizar(r.desde) === ruta || r.desde === ruta) return r.hacia;
  }
  return null;
};

/* ── URLs viejas ─────────────────────────────────────────────────────────── */
const csv = async (rel, col) => {
  const p = join(MIGRACION, rel);
  if (!existsSync(p)) return [];
  const [cab, ...filas] = (await readFile(p, 'utf8')).trim().split('\n');
  const i = cab.split(',').indexOf(col);
  return filas.map((f) => f.split(',')[i]).filter(Boolean);
};

const viejas = new Map();   // ruta -> fuente
const anadir = (lista, fuente) => {
  for (const u of lista) if (!viejas.has(normalizar(u))) viejas.set(normalizar(u), fuente);
};
anadir(await csv('informes/inventario_urls.csv', 'url'), 'inventario');
anadir(await csv('baseline/gsc_top_pages_3m.csv', 'url'), 'GSC top');
anadir(await csv('baseline/ga4_top_pages_56d.csv', 'path'), 'GA4 top');
anadir(await csv('baseline/404_heredados.csv', 'url'), '404 heredados');
for (const f of (await readdir(join(MIGRACION, 'baseline'))).filter((f) => /^gsc_indexadas.*\.csv$/.test(f))) {
  anadir(await csv(`baseline/${f}`, 'url'), f);
}
const manifiesto = JSON.parse(await readFile(join(MIGRACION, 'snapshot/manifest.json'), 'utf8'));
const paginas = manifiesto.pages ?? manifiesto.paginas ?? manifiesto.urls ?? [];
anadir(paginas.map((p) => (typeof p === 'string' ? p : p.url ?? p.path)).filter(Boolean), 'snapshot');

let directas = 0, redirigidas = 0;
for (const [ruta, fuente] of viejas) {
  if (servido.has(ruta)) { directas++; continue; }
  const destino = redirige(ruta);
  if (destino && servido.has(normalizar(destino))) { redirigidas++; continue; }
  errores.push(`${ruta} (${fuente}): ${destino ? `redirige a ${destino}, que no existe` : 'sin pagina ni 301'}`);
}

if (errores.length) {
  console.error(`Redirecciones: ${errores.length} errores\n  ` + errores.join('\n  '));
  process.exit(1);
}
console.log(`Redirecciones: ${reglas.length} reglas correctas; ${viejas.size} URLs viejas, ` +
  `${directas} se sirven igual y ${redirigidas} redirigen a una pagina que existe.`);
