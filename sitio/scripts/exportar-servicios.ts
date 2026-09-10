/**
 * Saca las paginas de servicio a un fichero para reescribirlas fuera.
 *
 *   npm run servicios:exportar [-- --traducir]
 *
 * No es lo mismo que `revision:exportar`. Aquella saca frases sueltas para
 * corregirle las tildes al castellano y devuelve cada pieza a su sitio por
 * `id`. Esto saca la pagina ENTERA, con su estructura, porque lo que se pide
 * fuera no es una correccion: es mas contenido. Una seccion nueva no cabe en
 * un campo `corregido`.
 *
 * De ahi la forma del fichero: cada pagina lleva `actual` (lo que hay hoy, de
 * solo lectura, para que quien escriba sepa que no puede contradecir) y
 * `nuevo` (vacio, que es lo que se rellena y lo que importa el par de este
 * script).
 *
 * Con `--traducir` el encargo es otro: el castellano ya esta cerrado y lo que
 * se pide fuera son las cinco traducciones. Cambia el LEEME que viaja con el
 * fichero y se marca en `tarea`, para que no haya duda de que vuelta es esta.
 *
 * Las instrucciones viajan con el fichero: se copian a la carpeta desde
 * scripts/servicios-leeme.md o servicios-traducir-leeme.md. Ahi el JSON no sirve de nada solo, y la carpeta
 * se borra cuando la tanda esta aplicada. En vez de incrustar el texto en una
 * plantilla como hace exportar-revision.ts, vive en su .md: son ciento
 * cincuenta lineas llenas de acentos graves y escaparlas lo haria ilegible
 * justo en el fichero que hay que poder leer.
 */
import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUTAS, url } from '../src/i18n/routes.ts';

const traducir = process.argv.includes('--traducir');
const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');
const destino = join(raiz, 'revision-servicios');

/** Las dos secciones del manifiesto que son "servicios" para esto. */
const SECCIONES = new Set(['servicios', 'taller']);

/* Las paginas de las que cuelgan otras cargan con la vista de conjunto y con
   los enlaces a las hijas, asi que piden mas texto. Las demas resuelven una
   sola intencion de busqueda y se alargan a base de relleno si se les pide
   demasiado. */
const CABECERAS = new Set(['taller', 'restauraciones', 'sala-motores']);
const OBJETIVO = {
  cabecera: { min: 1200, max: 1600 },
  hoja: { min: 600, max: 900 },
};

const palabras = (s: string) =>
  s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

interface Seccion {
  nivel: number; titulo: string; parrafos: string[]; items: string[];
  imagenes: { url: string; alt: string }[];
}

const leer = (f: string) =>
  JSON.parse(readFileSync(join(raiz, 'src/datos/paginas', f), 'utf8'));

// ── Las paginas ────────────────────────────────────────────────────────────
const porRuta = new Map(RUTAS.map((r) => [r.id, r]));
const ficheros = readdirSync(join(raiz, 'src/datos/paginas'))
  .filter((f) => f.endsWith('.json') && !/\.(en|fr|it|de|ca)\.json$/.test(f));

const paginas = ficheros
  .map((f) => ({ fichero: f, datos: leer(f) }))
  .filter(({ datos }) => SECCIONES.has(porRuta.get(datos.rutaId)?.seccion ?? ''))
  .sort((a, b) => a.datos.rutaId.localeCompare(b.datos.rutaId))
  .map(({ fichero, datos }) => {
    /* Las fotos se sacan del arbol de secciones y se numeran a nivel de
       pagina. Si quien reescribe reordena las secciones, las fotos no se
       pierden: se vuelven a colocar por indice. */
    const imagenes = datos.secciones.flatMap((s: Seccion) => s.imagenes);
    const texto = [
      datos.h1, datos.meta.titulo, datos.meta.descripcion,
      ...datos.secciones.flatMap((s: Seccion) => [s.titulo, ...s.parrafos, ...s.items]),
    ].join(' ');

    return {
      rutaId: datos.rutaId,
      fichero: `src/datos/paginas/${fichero}`,
      url: url(datos.rutaId, 'es'),
      papel: CABECERAS.has(datos.rutaId) ? 'cabecera' : 'hoja',
      palabrasHoy: palabras(texto),
      objetivoPalabras: CABECERAS.has(datos.rutaId) ? OBJETIVO.cabecera : OBJETIVO.hoja,
      imagenes: imagenes.map((im, i) => ({ i, url: im.url, alt: im.alt })),
      articulos: datos.articulos ?? [],
      actual: {
        meta: { titulo: datos.meta.titulo, descripcion: datos.meta.descripcion },
        h1: datos.h1,
        menu: datos.menu ?? '',
        secciones: datos.secciones.map((s: Seccion) => ({
          nivel: s.nivel, titulo: s.titulo, parrafos: s.parrafos, items: s.items,
        })),
      },
      nuevo: {
        meta: { titulo: '', descripcion: '' },
        h1: '',
        menu: '',
        imagenes: imagenes.map((im, i) => ({ i, alt: im.alt })),
        secciones: [],
      },
    };
  });

// ── Referencia: lo que se puede enlazar y lo que no se traduce ─────────────
const rutasEnlazables = RUTAS
  .filter((r) => r.id !== 'home')
  .map((r) => ({ id: r.id, url: url(r.id, 'es'), seccion: r.seccion ?? '' }));

const magazine = (() => {
  const dir = join(raiz, 'src/content/magazine/es');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const crudo = readFileSync(join(dir, f), 'utf8');
    const campo = (k: string) =>
      new RegExp(`^${k}:\\s*"(.*)"$`, 'm').exec(crudo)?.[1] ?? '';
    return { slug: campo('slugFinal') || f.replace(/\.md$/, ''), titulo: campo('title') };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
})();

/* Se sacan del glosario en vez de copiarse aqui: si manana cambia el glosario,
   este fichero no puede decir otra cosa. */
const invariantes = (() => {
  const md = readFileSync(join(raiz, 'src/i18n/glosario.md'), 'utf8');
  const seccion = md.split('## 1. Términos invariantes')[1]?.split('## 2.')[0] ?? '';
  const salida = new Set<string>();
  for (const m of seccion.matchAll(/`([^`]+)`/g)) {
    for (const t of m[1].split(',')) salida.add(t.trim());
  }
  return [...salida];
})();

const terminosEs = (() => {
  const md = readFileSync(join(raiz, 'src/i18n/glosario.md'), 'utf8');
  const seccion = md.split('## 2. Términos con traducción fijada')[1]?.split('###')[0] ?? '';
  return seccion.split('\n')
    .filter((l) => l.startsWith('|') && !l.includes('---') && !l.includes('Español'))
    .map((l) => l.split('|')[1]?.trim())
    .filter(Boolean);
})();

const salida = {
  formato: 'valentinmotors-servicios-v1',
  generado: new Date().toISOString().slice(0, 10),
  idioma: 'es',
  tarea: traducir ? 'traducir' : 'reescribir',
  instrucciones: 'LEEME.md, al lado de este fichero. Leerlo antes de escribir.',
  referencia: {
    rutas: rutasEnlazables,
    magazine,
    invariantes,
    terminosCastellano: terminosEs,
  },
  paginas,
};

mkdirSync(destino, { recursive: true });
writeFileSync(join(destino, 'servicios-es.json'),
  `${JSON.stringify(salida, null, 2)}\n`);
copyFileSync(join(aqui, traducir ? 'servicios-traducir-leeme.md' : 'servicios-leeme.md'),
             join(destino, 'LEEME.md'));

const total = paginas.reduce((n, p) => n + p.palabrasHoy, 0);
const pedidas = paginas.reduce((n, p) => n + p.objetivoPalabras.min, 0);
console.log(`servicios: ${paginas.length} paginas -> revision-servicios/servicios-es.json`);
console.log(traducir
  ? `  ${total} palabras de castellano a traducir a cinco idiomas`
  : `  ${total} palabras hoy, ${pedidas} como minimo despues`);
console.log(`  ${magazine.length} articulos y ${rutasEnlazables.length} rutas enlazables en la referencia`);
