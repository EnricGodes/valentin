/**
 * Genera dist/sitemap-index.xml y dist/sitemap-0.xml a partir del HTML ya
 * construido.
 *
 * Sustituye a @astrojs/sitemap, que empareja las versiones de idioma por el
 * slug que va despues del prefijo: con slugs traducidos (/taller-porsche,
 * /en/porsche-workshop) dejaba sin alternantes a la mitad del sitio, o las
 * emparejaba mal. Aqui cada URL lleva exactamente las alternantes que declara
 * su propio <head>, asi que sitemap y HTML no pueden contradecirse.
 *
 * Entra toda pagina con canonical a si misma y sin noindex. lastmod solo
 * cuando la pagina lo sabe (dateModified de su JSON-LD): una fecha inventada,
 * como la del build, le ensena a Google a ignorar el campo.
 */
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
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
  if (r === '/index') return '/';
  return r.replace(/\/index$/, '');
};

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (tag, nombre) => new RegExp(`\\b${nombre}="([^"]*)"`).exec(tag)?.[1];

const ficheros = await htmls(DIST);
const existe = new Set(ficheros.map((f) => DOMINIO + (aRuta(f) === '/' ? '/' : aRuta(f))));
const entradas = [];
const errores = [];

for (const f of ficheros) {
  const html = await readFile(f, 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  if (/<meta name="robots" content="[^"]*noindex/.test(head)) continue;

  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(head)?.[1];
  const propia = DOMINIO + (aRuta(f) === '/' ? '/' : aRuta(f));
  if (!canonical) { errores.push(`${propia}: sin canonical`); continue; }
  if (canonical !== propia) continue;   // canonica de otra: no entra

  const alternantes = [...head.matchAll(/<link rel="alternate" hreflang="[^"]+" href="[^"]+">/g)]
    .map((m) => ({ hreflang: attr(m[0], 'hreflang'), href: attr(m[0], 'href') }));
  for (const a of alternantes) {
    if (!existe.has(a.href)) errores.push(`${propia}: hreflang ${a.hreflang} -> ${a.href} no existe`);
  }

  const modificada = /"dateModified":"([^"]+)"/.exec(html)?.[1];
  entradas.push({ loc: propia, alternantes, lastmod: modificada?.slice(0, 10) });
}

if (errores.length) {
  console.error(`Sitemap: ${errores.length} errores\n  ` + errores.slice(0, 30).join('\n  '));
  process.exit(1);
}

entradas.sort((a, b) => a.loc.localeCompare(b.loc));
const urls = entradas.map((e) => [
  '  <url>',
  `    <loc>${xml(e.loc)}</loc>`,
  ...(e.lastmod ? [`    <lastmod>${e.lastmod}</lastmod>`] : []),
  ...e.alternantes.map((a) =>
    `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xml(a.href)}"/>`),
  '  </url>',
].join('\n'));

await rm(join(DIST, 'sitemap-0.xml'), { force: true });
await writeFile(join(DIST, 'sitemap-0.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
  'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.join('\n') + '\n</urlset>\n');
/* El indice se publica con dos nombres: sitemap-index.xml (el de robots.txt)
   y sitemap.xml, que es el que Search Console tiene registrado desde 2022 con
   Squarespace. Servirlo directamente evita depender de que Google siga un 301
   en un sitemap. */
const indice =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  `  <sitemap><loc>${DOMINIO}/sitemap-0.xml</loc></sitemap>\n</sitemapindex>\n`;
await writeFile(join(DIST, 'sitemap-index.xml'), indice);
await writeFile(join(DIST, 'sitemap.xml'), indice);

const conAlt = entradas.filter((e) => e.alternantes.filter((a) => a.hreflang !== 'x-default').length > 1).length;
console.log(`Sitemap: ${entradas.length} URLs, ${conAlt} con alternantes de idioma.`);
