/**
 * Genera el mapa que usa el middleware de idioma.
 *
 * El middleware tiene que decidir, en el borde y en milisegundos, si la página
 * que se pide existe en el idioma del navegador. No puede consultar la
 * colección de contenido ni el manifiesto de rutas, así que la respuesta se
 * calcula aquí, en el build, y se despliega con el sitio.
 *
 * El mapa solo contiene idiomas REALMENTE publicados para cada página. Es la
 * diferencia entre llevar a un alemán a su versión y llevarlo a un 404.
 */
import { writeFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IDIOMAS, POR_DEFECTO } from '../src/i18n/config.ts';
import { RUTAS, url } from '../src/i18n/routes.ts';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');

/* Los idiomas publicados de una página se leen del disco en vez de importar
   `idiomasDe` de src/datos/pagina.ts, que usa `import.meta.glob` de Vite y no
   se puede ejecutar con node suelto. La regla es la misma: una traducción a
   medias no se publica. */
function idiomasDePagina(rutaId: string): string[] {
  const dir = join(raiz, 'src/datos/paginas');
  const out: string[] = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    const d = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (d.rutaId !== rutaId) continue;
    const partes = f.replace(/\.json$/, '').split('.');
    const idioma = partes.length > 1 ? partes.at(-1)! : POR_DEFECTO;
    if (idioma === POR_DEFECTO || d.traduccion?.completa !== false) out.push(idioma);
  }
  return out;
}

/** ruta española -> { idioma: ruta en ese idioma } */
const mapa: Record<string, Record<string, string>> = {};

// 1. Las páginas del manifiesto
for (const r of RUTAS) {
  const disponibles = idiomasDePagina(r.id);
  const otros = IDIOMAS.filter((i) => i !== POR_DEFECTO && disponibles.includes(i));
  if (!otros.length) continue;
  const clave = url(r.id, POR_DEFECTO);
  mapa[clave] = Object.fromEntries(otros.map((i) => [i, url(r.id, i)]));
}

// 2. Los artículos del Magazine, que no pasan por el manifiesto
const base = join(raiz, 'src/content/magazine');
if (existsSync(base)) {
  const slugsDe = (idioma: string) => {
    const dir = join(base, idioma);
    if (!existsSync(dir)) return new Map<string, string>();
    const m = new Map<string, string>();
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const slug = /^slugFinal:\s*"(.*)"$/m.exec(readFileSync(join(dir, f), 'utf8'))?.[1];
      if (slug) m.set(f, slug);
    }
    return m;
  };
  const es = slugsDe('es');
  const otros = IDIOMAS.filter((i) => i !== POR_DEFECTO).map((i) => [i, slugsDe(i)] as const);
  for (const [fichero, slug] of es) {
    const traducciones = otros
      .filter(([, m]) => m.has(fichero))
      .map(([i, m]) => [i, `/${i}/magazine/${m.get(fichero)}`]);
    if (traducciones.length) {
      mapa[`/magazine/${slug}`] = Object.fromEntries(traducciones);
    }
  }
}

const destino = join(raiz, 'functions/mapa-idiomas.json');
writeFileSync(destino, `${JSON.stringify(mapa, null, 0)}\n`);
const n = Object.keys(mapa).length;
const kb = (readFileSync(destino).length / 1024).toFixed(1);
console.log(`idiomas: ${n} rutas con traducción -> functions/mapa-idiomas.json (${kb} KB)`);
