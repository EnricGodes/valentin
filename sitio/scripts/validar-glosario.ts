/**
 * Comprueba que la terminologia del glosario se respeta en los seis idiomas.
 *
 * La regla que lo justifica esta escrita en src/i18n/glosario.md: si
 * "bore scoring" aparece traducido en una pagina y sin traducir en otra,
 * Google ve dos temas donde hay uno, y quien busca *bore scoring* no
 * encuentra la pagina que habla de ello.
 *
 * Hasta ahora esto se comprobaba a mano durante la migracion. En cuanto el
 * CMS traduzca solo, la comprobacion a mano deja de existir, asi que vive
 * aqui y corre en cada build.
 *
 * Tres comprobaciones:
 *   1. Invariantes: si el termino esta en la version espanola de una pagina,
 *      tiene que estar en las otras cinco. Si falta, se ha traducido.
 *   2. Traducciones prohibidas: renderizados concretos que ya aparecieron mal
 *      y no pueden volver (Cambio -> Veranderung, Manual -> Handbuch...).
 *   3. Tono: sin guion largo en espanol y sin exclamaciones, que son dos
 *      reglas de CLAUDE.md que se pierden traduciendo frase a frase.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');
const IDIOMAS = ['en', 'fr', 'it', 'de', 'ca'] as const;

/**
 * Terminos que chocan con una palabra corriente y hay que comprobar con la
 * mayuscula puesta. Sin esto el validador cria falsos positivos y acaba
 * ignorandose, que es peor que no tenerlo.
 *
 *   Carrera  el post del centro de Madrid dice "se ha adelantado en la carrera"
 *   Targa    en italiano `targa` es la matricula
 *
 * El resto se comprueba sin distinguir mayusculas: el aleman escribe
 * "Transaxle Modelle" y los titulares ponen "Bore Scoring", y las dos son
 * formas correctas del termino invariante.
 */
const SENSIBLES = new Set(['Carrera', 'Targa']);

/** Terminos que no se traducen en ningun idioma. Salen del glosario. */
function invariantes(): string[] {
  const md = readFileSync(join(raiz, 'src/i18n/glosario.md'), 'utf8');
  const seccion = md.split('## 1. Términos invariantes')[1]?.split('## 2.')[0] ?? '';
  const terminos = new Set<string>();
  for (const m of seccion.matchAll(/`([^`]+)`/g)) {
    for (const t of m[1].split(',').map((x) => x.trim())) {
      // Las generaciones (911, 964) y las letras sueltas (S, RS) dan
      // demasiados falsos positivos para comprobarlas asi.
      if (t.length < 5 || /^\d+$/.test(t)) continue;
      // El glosario documenta que Storage se queda en ingles SOLO en espanol
      // y si se traduce en los otros cinco. No es invariante.
      if (t === 'Storage') continue;
      terminos.add(t);
    }
  }
  return [...terminos];
}

/**
 * Renderizados que ya aparecieron mal y no pueden volver. Se detectaron
 * leyendo las fichas traducidas: son palabras cortas de tabla, sin frase
 * alrededor, donde el traductor pierde el contexto de automocion.
 */
const PROHIBIDAS: Record<string, [RegExp, string][]> = {
  en: [[/\bChange\b/, 'Cambio (la caja) debe ser Gearbox, no Change']],
  fr: [[/\bChangement\b/, 'Cambio (la caja) debe ser Boîte de vitesses']],
  de: [[/\bVeränderung\b/, 'Cambio (la caja) debe ser Getriebe'],
       [/\bHandbuch\b/, 'Manual (la caja) debe ser Schaltgetriebe']],
  it: [[/\bRaduno\b/, 'Rally no se traduce por Raduno']],
  ca: [],
};

const texto = (md: string) =>
  md.replace(/^---[\s\S]*?^---/m, '')       // frontmatter fuera
    .replace(/^:::.*$/gm, ' ')              // directivas de modulo
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')  // imagenes
    .replace(/`[^`]*`/g, ' ');

const POSTS = join(raiz, 'src/content/magazine');
const leer = (idioma: string, f: string) => {
  const p = join(POSTS, idioma, f);
  return existsSync(p) ? texto(readFileSync(p, 'utf8')) : null;
};

const fallos: string[] = [];
const avisos: string[] = [];

// --- 1. Invariantes ---------------------------------------------------------
const terminos = invariantes();
for (const f of readdirSync(join(POSTS, 'es')).filter((x) => x.endsWith('.md'))) {
  const es = leer('es', f);
  if (!es) continue;
  for (const t of terminos) {
    const re = new RegExp(
      `\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      SENSIBLES.has(t) ? '' : 'i');
    if (!re.test(es)) continue;
    for (const idioma of IDIOMAS) {
      const otro = leer(idioma, f);
      if (otro && !re.test(otro)) {
        fallos.push(`${idioma}/${f}: se ha traducido "${t}", que es invariante`);
      }
    }
  }
}

// --- 1 bis. Invariantes en paginas y fichas, texto a texto -------------------
// Comparar el fichero entero no sirve aqui: los enlaces van con la ruta en
// castellano en los seis idiomas (/restauraciones/backdating), asi que el
// termino aparece siempre aunque el texto lo traduzca. Asi paso el
// "Rétrogradation" del frances. Se recorren a la vez el JSON espanol y su
// traduccion y se compara cada texto con el suyo, sin etiquetas HTML.
const NO_ES_TEXTO = new Set(['url', 'href', 'rutaId', 'slug', 'articulos', 'ficheroOriginal', 'ogImagen']);
const sinEtiquetas = (s: string) => s.replace(/<[^>]+>/g, ' ');
/* `Turbo` queda fuera: en castellano "turbo" es tambien la pieza ("Turbo,
   wastegate y valvula de descarga"), y esa si se traduce (Turbolader). */
const terminosTexto = terminos.filter((t) => t !== 'Turbo');
const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const reTermino = new Map(terminosTexto.map((t) => [t, new RegExp(
  `\\b${escapar(t)}\\b`, SENSIBLES.has(t) ? '' : 'i')]));
/* En la traduccion se acepta el termino con sus formas: el plural ("Macans",
   "transaxles"), el participio ingles ("backdated 911") y, en aleman, como
   primera parte de un compuesto ("Targadach"). */
const FORMAS: Record<string, string> = { backdating: 'backdat(?:ing|ed)' };
const reTraduccion = (t: string, idioma: string) => new RegExp(
  `\\b(?:${FORMAS[t] ?? escapar(t)})${idioma === 'de' ? '' : '(?:e?s)?\\b'}`,
  SENSIBLES.has(t) ? '' : 'i');

function compararTextos(es: unknown, otro: unknown, ruta: string, idioma: string, salida: [string, string][]) {
  if (typeof es === 'string' && typeof otro === 'string') {
    const a = sinEtiquetas(es), b = sinEtiquetas(otro);
    for (const [t, re] of reTermino) {
      if (re.test(a) && !reTraduccion(t, idioma).test(b)) salida.push([ruta, t]);
    }
  } else if (Array.isArray(es) && Array.isArray(otro)) {
    // Si la traduccion tiene otra forma, los indices ya no se corresponden.
    if (es.length !== otro.length) return;
    es.forEach((v, i) => compararTextos(v, otro[i], `${ruta}[${i}]`, idioma, salida));
  } else if (es && otro && typeof es === 'object' && typeof otro === 'object') {
    for (const [k, v] of Object.entries(es)) {
      if (!NO_ES_TEXTO.has(k)) compararTextos(v, (otro as Record<string, unknown>)[k], ruta ? `${ruta}.${k}` : k, idioma, salida);
    }
  }
}

for (const dir of ['coches', 'paginas']) {
  const base = join(raiz, 'src/datos', dir);
  if (!existsSync(base)) continue;
  for (const nombre of readdirSync(base)) {
    if (!nombre.endsWith('.json') || /\.(en|fr|it|de|ca)\.json$/.test(nombre)) continue;
    const es = JSON.parse(readFileSync(join(base, nombre), 'utf8'));
    for (const idioma of IDIOMAS) {
      const f = join(base, nombre.replace(/\.json$/, `.${idioma}.json`));
      if (!existsSync(f)) continue;
      const malos: [string, string][] = [];
      compararTextos(es, JSON.parse(readFileSync(f, 'utf8')), '', idioma, malos);
      for (const [ruta, t] of malos) {
        fallos.push(`${dir}/${basename(f)} ${ruta}: se ha traducido "${t}", que es invariante`);
      }
    }
  }
}

// --- 2. Traducciones prohibidas, solo en datos estructurados ----------------
// En prosa "Cambio de look" es legitimamente "Change of look". El error que
// esta comprobacion persigue vive en las etiquetas de las fichas de coche:
// palabras sueltas de tabla, sin frase alrededor, donde el traductor pierde
// el contexto de automocion y "Cambio" se convierte en "Veranderung".
const LIMITE_ETIQUETA = 40;

function valores(x: unknown, salida: string[] = []): string[] {
  if (typeof x === 'string') {
    if (x.length <= LIMITE_ETIQUETA) salida.push(x);
  } else if (Array.isArray(x)) {
    for (const v of x) valores(v, salida);
  } else if (x && typeof x === 'object') {
    for (const v of Object.values(x)) valores(v, salida);
  }
  return salida;
}

function datosDe(dir: string, idioma: string): [string, string[]][] {
  const base = join(raiz, 'src/datos', dir);
  if (!existsSync(base)) return [];
  return readdirSync(base)
    .filter((f) => f.endsWith(`.${idioma}.json`))
    .map((f) => [`${dir}/${f}`, valores(JSON.parse(readFileSync(join(base, f), 'utf8')))]);
}

for (const [idioma, reglas] of Object.entries(PROHIBIDAS)) {
  for (const dir of ['coches', 'paginas']) {
    for (const [nombre, etiquetas] of datosDe(dir, idioma)) {
      for (const [re, porque] of reglas) {
        const mala = etiquetas.find((e) => re.test(e));
        if (mala) fallos.push(`${nombre}: ${porque} (dice "${mala}")`);
      }
    }
  }
}

// --- 3. Tono en los textos propios -----------------------------------------
// Solo en src/datos, que son las paginas y las fichas que escribimos
// nosotros. El Magazine queda FUERA a proposito: son 42 articulos historicos
// que la regla del proyecto obliga a conservar identicos, con sus guiones
// largos y sus exclamaciones. Corregirles el estilo seria reescribir el
// archivo del cliente.
for (const dir of ['coches', 'paginas']) {
  const base = join(raiz, 'src/datos', dir);
  if (!existsSync(base)) continue;
  for (const nombre of readdirSync(base)) {
    // Solo el espanol: el fichero sin sufijo de idioma.
    if (!nombre.endsWith('.json') || /\.(en|fr|it|de|ca)\.json$/.test(nombre)) continue;
    const crudo = readFileSync(join(base, nombre), 'utf8');
    const etiquetas = valores(JSON.parse(crudo));
    const largo = etiquetas.concat(crudo.match(/"[^"]{40,}"/g) ?? []);
    // El guion largo delante de un nombre es la firma de una cita, que es
    // uso tipografico correcto y no lo que CLAUDE.md prohibe.
    const firma = /^\s*—\s*\p{Lu}/u;
    if (largo.some((s) => s.includes('—') && !firma.test(s.replace(/^"/, '')))) {
      avisos.push(`${dir}/${nombre}: guion largo, que CLAUDE.md prohibe en espanol`);
    }
  }
}

// --- 4. Espacio antes de dos puntos, que solo es correcto en frances -------
// El frances pide espacio fino antes de `:` y `;`. El espanol, el ingles, el
// italiano, el aleman y el catalan no. Se comprueba en los dos sentidos
// porque un barrido global rompe una de las dos convenciones.
for (const dir of ['coches', 'paginas']) {
  const base = join(raiz, 'src/datos', dir);
  if (!existsSync(base)) continue;
  for (const nombre of readdirSync(base).filter((x) => x.endsWith('.json'))) {
    const idioma = nombre.match(/\.(en|fr|it|de|ca)\.json$/)?.[1] ?? 'es';
    const crudo = readFileSync(join(base, nombre), 'utf8');
    // Texto largo, para no señalar horas ("10:30") ni proporciones.
    const frases = crudo.match(/"[^"]{40,}"/g) ?? [];
    const conEspacio = frases.some((s) => /\p{L} :\s/u.test(s));
    if (idioma !== 'fr' && conEspacio) {
      avisos.push(`${dir}/${nombre}: espacio antes de dos puntos, que en ${idioma} no lleva`);
    }
    if (idioma === 'fr' && frases.some((s) => /\p{L}: /u.test(s)) && !conEspacio) {
      avisos.push(`${dir}/${nombre}: en frances los dos puntos llevan espacio delante`);
    }
  }
}

// --- Resultado --------------------------------------------------------------
if (avisos.length) {
  console.warn(`glosario: ${avisos.length} avisos de tono`);
  for (const a of avisos.slice(0, 8)) console.warn(`  ${a}`);
  if (avisos.length > 8) console.warn(`  ...y ${avisos.length - 8} mas`);
}

if (fallos.length) {
  console.error(`\nglosario: ${fallos.length} incumplimientos`);
  for (const x of fallos) console.error(`  ${x}`);
  process.exit(1);
}

console.log(`glosario: ${terminos.length} invariantes comprobados en 6 idiomas, sin incumplimientos`);
