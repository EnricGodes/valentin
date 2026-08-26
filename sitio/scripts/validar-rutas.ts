/**
 * Valida el manifiesto de rutas antes de construir.
 *
 * Comprueba tres cosas que, si se rompen, cuestan posiciones en Google sin dar
 * ningun error visible:
 *
 *   1. Integridad: todos los idiomas presentes, sin colisiones de slug.
 *   2. Alternantes: cada pagina se declara a si misma y a las demas, con
 *      hrefs absolutos y unicos, mas un x-default valido.
 *   3. Que ningun slug espanol se haya movido respecto al inventario de la
 *      migracion. Esta es la importante: el 100% de los clics organicos
 *      medidos vive en esas URLs.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { IDIOMAS, POR_DEFECTO } from '../src/i18n/config.ts';
import { RUTAS, alternantes, xDefault, url, urlAbsoluta } from '../src/i18n/routes.ts';

const aqui = dirname(fileURLToPath(import.meta.url));
const INVENTARIO = resolve(aqui, '../../_migracion/informes/inventario_urls.csv');

const fallos: string[] = [];
const avisos: string[] = [];

// ── 1. Integridad del manifiesto ────────────────────────────────────────────
for (const r of RUTAS) {
  for (const i of IDIOMAS) {
    if (typeof r.slugs[i] !== 'string') fallos.push(`ruta "${r.id}": falta el idioma ${i}`);
  }
}
for (const i of IDIOMAS) {
  const vistos = new Map<string, string>();
  for (const r of RUTAS) {
    const s = r.slugs[i];
    const previo = vistos.get(s);
    if (previo) fallos.push(`colision de slug en ${i}: "${s}" la usan "${previo}" y "${r.id}"`);
    vistos.set(s, r.id);
  }
}

// ── 2. Alternantes hreflang ─────────────────────────────────────────────────
for (const r of RUTAS) {
  const alt = alternantes(r.id);

  // Se declara a si misma: sin la autorreferencia Google descarta el grupo
  const propia = urlAbsoluta(r.id, POR_DEFECTO);
  if (!alt.some((a) => a.idioma === POR_DEFECTO && a.href === propia)) {
    fallos.push(`ruta "${r.id}": no se declara a si misma en las alternantes`);
  }
  // Una alternante por idioma, ni mas ni menos
  const idiomasDeclarados = new Set(alt.map((a) => a.idioma));
  if (idiomasDeclarados.size !== IDIOMAS.length) {
    fallos.push(`ruta "${r.id}": declara ${idiomasDeclarados.size} idiomas de ${IDIOMAS.length}`);
  }
  // Dos idiomas no pueden apuntar a la misma URL: Google se queda con uno solo
  const hrefs = new Set(alt.map((a) => a.href));
  if (hrefs.size !== alt.length) {
    fallos.push(`ruta "${r.id}": dos idiomas comparten URL (slugs sin traducir)`);
  }
  for (const { idioma, href } of alt) {
    if (!href.startsWith('https://')) fallos.push(`ruta "${r.id}" (${idioma}): href no absoluto`);
  }
  if (xDefault(r.id) !== propia) {
    fallos.push(`ruta "${r.id}": x-default deberia apuntar al espanol`);
  }
}

// ── 2b. Slugs sin traducir ──────────────────────────────────────────────────
// Que dos idiomas compartan slug no rompe nada (el prefijo los distingue), pero
// suele significar que alguien olvido traducirlo, y entonces la URL no lleva la
// keyword de ese mercado, que es el 90% del sentido de tener slugs traducidos.
// Algunos son identicos a proposito: nombres propios y terminos de marca.
const IDENTICOS_A_PROPOSITO = new Set([
  'home', 'barcelona', 'madrid', 'magazine',  // nombres propios y marca
  'taller',      // el catalan tambien dice "taller"
  'competicion', // el aleman tambien dice "Motorsport"
  'contacto',    // el frances tambien dice "contact"
  'cookies',     // el catalan tambien dice "politica de cookies"
]);

for (const r of RUTAS) {
  if (IDENTICOS_A_PROPOSITO.has(r.id)) continue;
  const porSlug = new Map<string, string[]>();
  for (const i of IDIOMAS) {
    const s = r.slugs[i];
    porSlug.set(s, [...(porSlug.get(s) ?? []), i]);
  }
  for (const [slug, idiomas] of porSlug) {
    if (idiomas.length > 1) {
      avisos.push(`ruta "${r.id}": ${idiomas.join(', ')} comparten el slug "${slug}" ` +
        `(¿sin traducir?)`);
    }
  }
}

// ── 3. Las URLs espanolas posicionadas no se mueven ─────────────────────────
let comprobadas = 0;
try {
  const csv = readFileSync(INVENTARIO, 'utf8').trim().split('\n');
  const cab = csv[0]!.split(',');
  const iUrl = cab.indexOf('url');
  const iAccion = cab.indexOf('accion');
  const iClics = cab.indexOf('gsc_clics_3m');

  const congeladas = csv.slice(1)
    .map((l) => l.split(','))
    .filter((c) => c[iAccion] === 'CONSERVAR')
    .map((c) => ({ url: c[iUrl]!, clics: Number(c[iClics] ?? 0) }));

  const publicadas = new Set(RUTAS.map((r) => url(r.id, POR_DEFECTO)));

  for (const { url: u, clics } of congeladas) {
    // Las rutas dinamicas (posts, fichas, categorias) no viven en el manifiesto:
    // sus slugs salen del CMS y se validan en la fase de contenido.
    if (u.startsWith('/magazine/') || u.startsWith('/porsche-en-venta/')) continue;
    comprobadas++;
    if (!publicadas.has(u)) {
      const msg = `URL congelada ausente del manifiesto: ${u}` +
        (clics > 0 ? ` (${clics} clics organicos en 3 meses)` : '');
      (clics > 0 ? fallos : avisos).push(msg);
    }
  }
} catch (e) {
  avisos.push(`No se pudo leer el inventario (${INVENTARIO}): ${(e as Error).message}`);
}

// ── Resultado ───────────────────────────────────────────────────────────────
console.log(`Rutas en el manifiesto : ${RUTAS.length} x ${IDIOMAS.length} idiomas = ${RUTAS.length * IDIOMAS.length} URLs`);
console.log(`URLs congeladas        : ${comprobadas} comprobadas contra el inventario`);
if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  for (const a of avisos) console.log(`  · ${a}`);
}
if (fallos.length) {
  console.error(`\nFALLOS (${fallos.length}):`);
  for (const f of fallos) console.error(`  ! ${f}`);
  process.exit(1);
}
console.log('\nManifiesto valido.');
