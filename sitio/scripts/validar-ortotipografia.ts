/**
 * Ortotipografia del castellano en los textos del sitio.
 *
 * Nace de una revision manual que encontro interrogantes sin abrir, tildes
 * perdidas y dobles espacios repartidos por el contenido. Corregirlos a mano
 * los quita hoy; esto impide que vuelvan, que es lo que una revision no da.
 *
 * Distingue dos cosas que no son lo mismo:
 *
 *   - FALTA: el castellano dice que eso esta mal. Una interrogacion sin abrir
 *     o "articulo" sin tilde son errores en cualquier texto, venga de donde
 *     venga. Se comprueban tambien en el Magazine.
 *   - ESTILO: una preferencia del proyecto. Esas viven en validar-glosario.ts
 *     y solo se aplican a src/datos, porque los 42 articulos del Magazine son
 *     archivo historico del cliente y no se les reescribe la voz.
 *
 * Solo el castellano. Las otras cinco lenguas salen de traducir esta, y cada
 * una tiene su propia ortotipografia (el frances abre sin signo, el aleman
 * capitaliza los sustantivos).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');

/**
 * Palabras que sin tilde no existen o son otra cosa que aqui no cabe.
 *
 * La lista es corta a proposito. Quedan fuera las que tienen un uso correcto
 * sin tilde y solo el contexto distingue: "mas" (pero), "solo" (sin compania),
 * "fabrica" (el verbo), "publico" y "practico" (primera persona). Esas las ve
 * una lectura, no una lista.
 */
const TILDES: Record<string, string> = {
  articulo: 'artículo', articulos: 'artículos',
  seccion: 'sección',
  tambien: 'también', despues: 'después', ademas: 'además',
  asi: 'así', aqui: 'aquí', ahi: 'ahí', segun: 'según',
  ultimo: 'último', ultima: 'última', ultimos: 'últimos', ultimas: 'últimas',
  unico: 'único', unica: 'única', unicos: 'únicos', unicas: 'únicas',
  clasico: 'clásico', clasica: 'clásica', clasicos: 'clásicos', clasicas: 'clásicas',
  mecanico: 'mecánico', mecanica: 'mecánica', mecanicos: 'mecánicos', mecanicas: 'mecánicas',
  tecnico: 'técnico', tecnica: 'técnica', tecnicos: 'técnicos', tecnicas: 'técnicas',
  numero: 'número', numeros: 'números',
  vehiculo: 'vehículo', vehiculos: 'vehículos',
  kilometro: 'kilómetro', kilometros: 'kilómetros',
  hidraulico: 'hidráulico', hidraulica: 'hidráulica',
  electrico: 'eléctrico', electrica: 'eléctrica',
  automatico: 'automático', automatica: 'automática',
  reparacion: 'reparación',
  restauracion: 'restauración',
  inyeccion: 'inyección', revision: 'revisión',
  informacion: 'información', atencion: 'atención', presion: 'presión',
  decada: 'década', decadas: 'décadas', estetica: 'estética',
  compresion: 'compresión', distribucion: 'distribución', refrigeracion: 'refrigeración',
  transmision: 'transmisión', suspension: 'suspensión', direccion: 'dirección',
};

interface Aviso { fichero: string; regla: string; muestra: string; }
const faltas: Aviso[] = [];
const dudas: Aviso[] = [];

/** Quita la sintaxis para no confundir un `![alt]` con una exclamacion. */
function soloProsa(md: string): string {
  return md
    .replace(/^---[\s\S]*?\n---\n/, '')
    .replace(/^:::.*$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\*\*|\*/g, '');
}

/** Cadenas de prosa de un JSON. Las claves tecnicas no son texto. */
const NO_PROSA = /slug|url|href|^id$|src|icono|clase|color|ruta|formato|ancla|clave/i;
function prosaDe(x: unknown, clave = '', salida: string[] = []): string[] {
  if (typeof x === 'string') {
    const limpio = x.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    if (limpio && !NO_PROSA.test(clave) && !/^https?:|^\//.test(x)) salida.push(limpio);
  } else if (Array.isArray(x)) {
    for (const v of x) prosaDe(v, clave, salida);
  } else if (x && typeof x === 'object') {
    for (const [k, v] of Object.entries(x)) prosaDe(v, k, salida);
  }
  return salida;
}

// --- El corpus: solo los ficheros en castellano ----------------------------
const piezas: { fichero: string; texto: string }[] = [];

const magazine = join(raiz, 'src/content/magazine/es');
if (existsSync(magazine)) {
  for (const f of readdirSync(magazine).filter((n) => n.endsWith('.md'))) {
    const crudo = readFileSync(join(magazine, f), 'utf8');
    const fm = /^---([\s\S]*?)\n---/.exec(crudo);
    const titulos = ['title', 'excerpt']
      .map((k) => new RegExp(`^${k}:\\s*"(.*)"$`, 'm').exec(fm?.[1] ?? '')?.[1] ?? '')
      .join('\n');
    piezas.push({ fichero: `magazine/es/${f}`, texto: `${titulos}\n${soloProsa(crudo)}` });
  }
}

for (const dir of ['coches', 'paginas']) {
  const base = join(raiz, 'src/datos', dir);
  if (!existsSync(base)) continue;
  for (const f of readdirSync(base)) {
    // El fichero sin sufijo de idioma es el castellano.
    if (!f.endsWith('.json') || /\.(en|fr|it|de|ca)\.json$/.test(f)) continue;
    const datos = JSON.parse(readFileSync(join(base, f), 'utf8'));
    piezas.push({ fichero: `datos/${dir}/${f}`, texto: prosaDe(datos).join('\n') });
  }
}

// --- Las reglas ------------------------------------------------------------
/* Palabras que en algun sitio del corpus se escriben en minuscula. Si
   "matricula" aparece suelta en minuscula, "Matrícula" tras dos puntos es
   sospechosa; si "Catalunya" no aparece nunca en minuscula, es un nombre
   propio y esta bien. Distingue las dos sin mantener lista de excepciones. */
const enMinuscula = new Set<string>();
for (const { texto } of piezas) {
  for (const p of texto.match(/(?<![.:!?]\s)(?<!^)\b[a-záéíóúüñ]{3,}\b/gm) ?? []) {
    enMinuscula.add(p);
  }
}

for (const { fichero, texto } of piezas) {
  for (const linea of texto.split('\n')) {
    const t = linea.trim();
    if (!t) continue;
    // Una URL no es prosa: sede.dgt.gob.es/es/vehiculos no lleva tilde.
    const prosa = t.replace(/https?:\/\/\S+/g, ' ');

    // FALTA: signo de cierre sin su pareja de apertura en la misma linea.
    for (const [signo, abre] of [['?', '¿'], ['!', '¡']] as const) {
      if (t.includes(signo) && !t.includes(abre) && !/https?:|=|\w\/\w/.test(t)) {
        faltas.push({ fichero, regla: `${signo} sin ${abre}`, muestra: t.slice(0, 72) });
      }
    }

    // FALTA: tilde perdida de la lista cerrada.
    for (const p of prosa.match(/\b[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+\b/g) ?? []) {
      const bien = TILDES[p.toLowerCase()];
      if (bien && bien !== p.toLowerCase()) faltas.push({ fichero, regla: `${p} -> ${bien}`, muestra: t.slice(0, 72) });
    }

    // FALTA: dos espacios donde va uno.
    if (/\w {2,}\w/.test(t)) {
      faltas.push({ fichero, regla: 'doble espacio', muestra: t.slice(0, 72) });
    }

    // DUDA: mayuscula tras dos puntos. En castellano va minuscula salvo que
    // siga un nombre propio o una cita, y eso no lo decide una regla.
    for (const m of t.matchAll(/[a-záéíóúñ]:\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,})/g)) {
      if (enMinuscula.has(m[1].toLowerCase())) {
        dudas.push({ fichero, regla: `may. tras ":" (${m[1]})`, muestra: t.slice(0, 72) });
      }
    }
  }
}

// --- Informe ---------------------------------------------------------------
if (dudas.length) {
  console.warn(`ortotipografia: ${dudas.length} casos a mirar a ojo`);
  for (const d of dudas.slice(0, 10)) {
    console.warn(`  ${d.fichero}: ${d.regla} — ${d.muestra}`);
  }
  if (dudas.length > 10) console.warn(`  ...y ${dudas.length - 10} mas`);
}

if (faltas.length) {
  console.error(`\nortotipografia: ${faltas.length} faltas en castellano`);
  for (const f of faltas) console.error(`  ${f.fichero}: ${f.regla} — ${f.muestra}`);
  process.exit(1);
}

console.log(`ortotipografia: ${piezas.length} ficheros en castellano, sin faltas`);
