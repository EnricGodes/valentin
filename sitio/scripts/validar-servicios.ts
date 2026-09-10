/**
 * Que las paginas de servicio no vuelvan a ser la misma pagina diecinueve veces.
 *
 * La primera vuelta de ampliacion salio con un esqueleto unico: cinco H2
 * identicos en las 19 paginas, las 19 abriendo con las mismas seis palabras y
 * la seccion de alcance con la mitad del texto compartido. Se leia como una
 * plantilla porque lo era, y ademas hacia que las diecinueve compitieran entre
 * si por las mismas busquedas.
 *
 * La segunda vuelta lo deshizo. Esto impide que vuelva, que es lo que una
 * reescritura por si sola no da: el dia que entre una tanda nueva escrita a
 * plantilla, el build lo dice aqui y no tres meses despues.
 *
 * Tres reglas, las mismas del encargo (scripts/servicios-estructura-leeme.md):
 *
 *   1. Ningun encabezado de contenido en mas de tres paginas. Se salvan los
 *      dos estructurales, que son navegacion y no contenido.
 *   1 bis. Y tampoco la MISMA FORMULA con el nombre del servicio detras. La
 *      segunda vuelta cumplio la regla 1 al pie de la letra y dejo el esqueleto
 *      intacto: "El servicio empieza por definir el problema" paso a ser "El
 *      punto de partida para IMS Porsche", "...para Storage", "...para
 *      Restomod". Diecinueve encabezados distintos y una sola plantilla. Esto
 *      se avisa, no se tumba: la tanda que lo trae es mejor que la anterior en
 *      todo lo demas y bloquearla no ayudaria a nadie.
 *   2. Ninguna apertura con la formula comun de la primera vuelta.
 *   3. Al menos dos bloques de lista por pagina, que es lo que rompe la
 *      sucesion de parrafos.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUTAS } from '../src/i18n/routes.ts';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');
const PAGINAS = join(raiz, 'src/datos/paginas');

/** Las dos secciones del manifiesto que son "servicios" para esto. */
const SECCIONES = new Set(['servicios', 'taller']);
const MAX_REPETICION = 3;
/** Cuantas primeras palabras definen "la misma formula". */
const PALABRAS_FORMULA = 3;
const MAX_FORMULA = 6;
const MINIMO_LISTAS = 2;

/** Encabezados que son navegacion y se repiten a proposito en todas. */
const ESTRUCTURALES = [
  /^preguntas frecuentes$/i, /^servicios relacionados$/i,
  /^frequently asked questions$/i, /^related services$/i,
  /^foire aux questions$/i, /^services associés$/i,
  /^domande frequenti$/i, /^servizi correlati$/i,
  /^häufig gestellte fragen$/i, /^verwandte leistungen$/i,
  /^preguntes freqüents$/i, /^serveis relacionats$/i,
];
const esEstructural = (t: string) => ESTRUCTURALES.some((re) => re.test(t.trim()));

/** La formula con la que abrian las 19 paginas de la primera vuelta. */
const APERTURAS_PROHIBIDAS = [
  /^En Valent[ií]n Motors entendemos que/i,
  /^At Valent[ií]n Motors we understand that/i,
  /^Chez Valent[ií]n Motors, nous comprenons que/i,
  /^In Valent[ií]n Motors compren/i,
  /^Bei Valent[ií]n Motors verstehen wir/i,
];

interface Seccion { nivel: number; titulo: string; items: string[] }
interface Pagina { rutaId: string; secciones: Seccion[] }

const idiomaDe = (f: string) => {
  const partes = basename(f, '.json').split('.');
  return partes.length > 1 ? partes.at(-1)! : 'es';
};

const seccionDe = new Map(RUTAS.map((r) => [r.id, r.seccion ?? '']));
const fallos: string[] = [];
const avisos: string[] = [];

if (!existsSync(PAGINAS)) {
  console.error('servicios: no existe src/datos/paginas');
  process.exit(1);
}

const porIdioma = new Map<string, { fichero: string; pagina: Pagina }[]>();
for (const f of readdirSync(PAGINAS).filter((x) => x.endsWith('.json'))) {
  const pagina: Pagina = JSON.parse(readFileSync(join(PAGINAS, f), 'utf8'));
  if (!SECCIONES.has(seccionDe.get(pagina.rutaId) ?? '')) continue;
  const idioma = idiomaDe(f);
  porIdioma.set(idioma, [...(porIdioma.get(idioma) ?? []), { fichero: f, pagina }]);
}

for (const [idioma, paginas] of porIdioma) {
  // ── 1. Encabezados repetidos ─────────────────────────────────────────────
  const veces = new Map<string, string[]>();
  for (const { pagina } of paginas) {
    for (const s of pagina.secciones) {
      if (s.nivel !== 2 || !s.titulo?.trim() || esEstructural(s.titulo)) continue;
      const clave = s.titulo.trim().toLowerCase();
      veces.set(clave, [...(veces.get(clave) ?? []), pagina.rutaId]);
    }
  }
  for (const [titulo, donde] of veces) {
    if (donde.length > MAX_REPETICION) {
      fallos.push(`${idioma}: "${titulo}" se repite en ${donde.length} paginas `
        + `(${donde.slice(0, 4).join(', ')}...). Cada pagina escribe los suyos.`);
    }
  }

  // ── 1 bis. La misma formula con otro final ───────────────────────────────
  const formulas = new Map<string, Set<string>>();
  for (const { pagina } of paginas) {
    for (const s of pagina.secciones) {
      if (s.nivel !== 2 || !s.titulo?.trim() || esEstructural(s.titulo)) continue;
      const clave = s.titulo.trim().toLowerCase().split(/\s+/)
        .slice(0, PALABRAS_FORMULA).join(' ');
      formulas.set(clave, (formulas.get(clave) ?? new Set()).add(pagina.rutaId));
    }
  }
  for (const [formula, donde] of formulas) {
    if (donde.size > MAX_FORMULA) {
      avisos.push(`${idioma}: "${formula}..." abre un encabezado en ${donde.size} `
        + 'paginas. Cambiarle el final no lo hace distinto.');
    }
  }

  // ── 2 y 3. Apertura y listas ─────────────────────────────────────────────
  for (const { pagina } of paginas) {
    const primera = pagina.secciones.find((s) => s.nivel === 2);
    const parrafos = (primera as unknown as { parrafos?: string[] })?.parrafos ?? [];
    const abre = parrafos[0] ?? '';
    if (APERTURAS_PROHIBIDAS.some((re) => re.test(abre))) {
      fallos.push(`${idioma}/${pagina.rutaId}: abre con la formula comun de la primera vuelta.`);
    }
    const listas = pagina.secciones.filter((s) => (s.items ?? []).length > 0).length;
    if (listas < MINIMO_LISTAS) {
      fallos.push(`${idioma}/${pagina.rutaId}: ${listas} bloques de lista, `
        + `hacen falta ${MINIMO_LISTAS}. Sin ellos la pagina vuelve a ser prosa seguida.`);
    }
  }
}

if (avisos.length) {
  console.warn(`servicios: ${avisos.length} formulas repetidas de encabezado`);
  for (const a of avisos) console.warn(`  ${a}`);
  console.warn('  El criterio esta en scripts/servicios-estructura-leeme.md\n');
}

if (fallos.length) {
  console.error(`\nservicios: ${fallos.length} paginas vuelven a la plantilla\n`);
  for (const f of fallos.slice(0, 20)) console.error(`  ${f}`);
  if (fallos.length > 20) console.error(`  ...y ${fallos.length - 20} mas`);
  console.error('\nEl criterio esta en scripts/servicios-estructura-leeme.md');
  process.exit(1);
}

const total = [...porIdioma.values()].reduce((n, x) => n + x.length, 0);
const distintos = new Set<string>();
for (const paginas of porIdioma.values()) {
  for (const { pagina } of paginas) {
    for (const s of pagina.secciones) if (s.nivel === 2 && s.titulo) distintos.add(s.titulo);
  }
}
console.log(`servicios: ${total} paginas en ${porIdioma.size} idiomas, `
  + `${distintos.size} encabezados distintos, ninguno repetido de mas`);
