/**
 * Genera dist/_headers: cabeceras de seguridad y de cache de Cloudflare Pages.
 *
 * Se genera despues del build, y no se escribe a mano en public/, por la CSP:
 * los scripts en linea (consentimiento, Analytics, selector de idioma) se
 * autorizan por su hash sha256, y el hash cambia en cuanto cambia una coma del
 * script. Calcularlo sobre el HTML ya construido es la unica forma de que la
 * CSP no rompa el sitio el dia que alguien toque el banner de cookies.
 *
 * Origenes externos permitidos, y por que:
 *   googletagmanager.com, google-analytics.com  GA4, solo tras consentimiento
 *   challenges.cloudflare.com                   Turnstile del formulario
 *   static.cloudflareinsights.com               Cloudflare Web Analytics
 *   tiles.openfreemap.org                       teselas y estilo de los mapas
 *   youtube-nocookie.com                        videos del Magazine
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(aqui, '../dist');

async function htmls(dir) {
  const fuera = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) fuera.push(...await htmls(p));
    else if (e.name.endsWith('.html')) fuera.push(p);
  }
  return fuera;
}

/* Solo los scripts que el navegador ejecuta: los JSON (ld+json, datos de
   tarifas) no pasan por script-src. */
const EJECUTABLE = /^(|text\/javascript|module)$/;
const hashes = new Set();
for (const f of await htmls(DIST)) {
  const html = await readFile(f, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    const tipo = /type="([^"]*)"/.exec(m[1])?.[1] ?? '';
    if (!EJECUTABLE.test(tipo)) continue;
    hashes.add(`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(' ')} https://www.googletagmanager.com https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com https://tiles.openfreemap.org",
  "media-src 'self'",
  "frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const cabeceras = `# Generado por scripts/generar-cabeceras.mjs en cada build. No editar a mano.

/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin

# La URL temporal y las vistas previas de cada deploy no se indexan.
https://:project.pages.dev/*
  X-Robots-Tag: noindex, nofollow
https://:version.:project.pages.dev/*
  X-Robots-Tag: noindex, nofollow

# Ficheros con hash en el nombre: no cambian nunca.
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable

# Fotos y videos: cambian poco, pero conservan el nombre al sustituirse.
/img/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
/video/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
`;

await writeFile(join(DIST, '_headers'), cabeceras);
console.log(`_headers: CSP con ${hashes.size} scripts en linea autorizados por hash.`);
