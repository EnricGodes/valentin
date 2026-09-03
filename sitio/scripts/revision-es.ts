/**
 * Piezas de prosa en castellano del sitio, para revisarlas fuera y devolverlas.
 *
 * La lectura ortografica y de estilo de 60.000 palabras no cabe en una sesion,
 * asi que sale a un fichero, se revisa donde se quiera y vuelve. Lo que hace
 * seguro ese viaje es que la pieza se identifica por su SITIO (fichero y
 * posicion), no por su contenido, y que al volver se comprueba que el original
 * sigue siendo el que se exporto. Si alguien ha tocado el fichero mientras
 * tanto, esa pieza no se aplica.
 *
 * Solo castellano. Las traducciones se dan por buenas y no se regeneran: una
 * correccion de tilde en espanol no cambia el aleman.
 *
 * Este modulo solo sabe LEER y ESCRIBIR piezas. Exportar e importar son dos
 * scripts que lo usan, para que la ida y la vuelta compartan exactamente la
 * misma idea de que es una pieza y donde vive.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
export const raiz = resolve(aqui, '..');

export interface Pieza {
  /** Donde vive, de forma estable: se usa para devolverla a su sitio. */
  id: string;
  fichero: string;
  /** Numero de bloque en un .md, o ruta de claves en un .json. */
  donde: string;
  texto: string;
}

/* Lo que en un .md no es prosa y no se manda a revisar: se rompe con solo
   mirarlo y no tiene faltas de ortografia. */
const NO_ES_PROSA = [
  /^:::/,                    // directivas de modulo
  /^!\[/,                    // imagenes sueltas
  /^\|/,                     // tablas
  /^```/,                    // codigo
  /^<[a-z]/i,                // html crudo
  /^-{3,}$/,                 // separadores
];

/** Claves de JSON cuyo valor es tecnico: un slug con tilde deja de resolver. */
const CLAVE_TECNICA = /slug|url|href|^id$|src|icono|clase|color|ruta|formato|ancla|clave|tipo|orden/i;

function bloquesMd(cuerpo: string): string[] {
  return cuerpo.split(/\n\s*\n/);
}

/** Las piezas de un .md: los campos de prosa del frontmatter y los parrafos. */
function piezasMd(rel: string, crudo: string): Pieza[] {
  const piezas: Pieza[] = [];
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(crudo);
  if (fm) {
    for (const clave of ['title', 'excerpt'] as const) {
      const m = new RegExp(`^${clave}:\\s*"(.*)"$`, 'm').exec(fm[1]);
      if (m && m[1].trim()) {
        piezas.push({ id: `${rel}#${clave}`, fichero: rel, donde: clave, texto: m[1] });
      }
    }
  }
  const cuerpo = crudo.slice(fm?.[0].length ?? 0);
  bloquesMd(cuerpo).forEach((b, i) => {
    const t = b.trim();
    if (!t || NO_ES_PROSA.some((re) => re.test(t))) return;
    piezas.push({ id: `${rel}#b${i}`, fichero: rel, donde: `b${i}`, texto: t });
  });
  return piezas;
}

/** Las piezas de un .json: cada cadena de prosa, con su ruta de claves. */
function piezasJson(rel: string, datos: unknown): Pieza[] {
  const piezas: Pieza[] = [];
  const recorrer = (x: unknown, ruta: string, clave: string) => {
    if (typeof x === 'string') {
      const t = x.trim();
      if (!t || CLAVE_TECNICA.test(clave) || /^https?:|^\//.test(t)) return;
      // Una sola palabra sin espacios rara vez es prosa; suele ser una etiqueta.
      if (!/\s/.test(t) && t.length < 20) return;
      piezas.push({ id: `${rel}#${ruta}`, fichero: rel, donde: ruta, texto: x });
    } else if (Array.isArray(x)) {
      x.forEach((v, i) => recorrer(v, `${ruta}[${i}]`, clave));
    } else if (x && typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) recorrer(v, `${ruta}.${k}`, k);
    }
  };
  recorrer(datos, '', '');
  return piezas;
}

/** Todo el castellano del sitio: el Magazine y los datos de paginas y coches. */
export function leerPiezas(): Pieza[] {
  const piezas: Pieza[] = [];

  const mag = join(raiz, 'src/content/magazine/es');
  if (existsSync(mag)) {
    for (const f of readdirSync(mag).filter((n) => n.endsWith('.md')).sort()) {
      const rel = `src/content/magazine/es/${f}`;
      piezas.push(...piezasMd(rel, readFileSync(join(raiz, rel), 'utf8')));
    }
  }

  for (const dir of ['paginas', 'coches']) {
    const base = join(raiz, 'src/datos', dir);
    if (!existsSync(base)) continue;
    for (const f of readdirSync(base).sort()) {
      // El fichero sin sufijo de idioma es el castellano.
      if (!f.endsWith('.json') || /\.(en|fr|it|de|ca)\.json$/.test(f)) continue;
      const rel = `src/datos/${dir}/${f}`;
      piezas.push(...piezasJson(rel, JSON.parse(readFileSync(join(raiz, rel), 'utf8'))));
    }
  }
  return piezas;
}

/**
 * Devuelve una pieza corregida a su fichero.
 *
 * `esperado` es el texto tal como se exporto. Si el fichero ya no lo contiene,
 * no se toca nada: alguien lo ha editado despues de exportar y aplicar aqui
 * seria pisarle el cambio a ciegas.
 *
 * La comparacion ignora los espacios de los extremos. Varios textos originales
 * los arrastran ("...(M6401 3.6 ) ") y exigirlos identicos dejaba fuera
 * correcciones buenas por un espacio que ademas sobra.
 */
const igual = (a: string, b: string) => a === b || a.trim() === b.trim();

export function escribirPieza(p: Pieza, esperado: string, nuevo: string): 'ok' | 'cambiado' {
  const ruta = join(raiz, p.fichero);
  if (p.fichero.endsWith('.md')) {
    const crudo = readFileSync(ruta, 'utf8');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(crudo);

    if (p.donde === 'title' || p.donde === 'excerpt') {
      const re = new RegExp(`^(${p.donde}:\\s*")(.*)("\\s*)$`, 'm');
      const m = re.exec(fm?.[1] ?? '');
      if (!m || !igual(m[2], esperado)) return 'cambiado';
      const nuevoFm = fm![1].replace(re, `$1${nuevo.replace(/\$/g, '$$$$')}$3`);
      writeFileSync(ruta, crudo.replace(fm![1], nuevoFm));
      return 'ok';
    }

    const cabeza = crudo.slice(0, fm?.[0].length ?? 0);
    const cuerpo = crudo.slice(fm?.[0].length ?? 0);
    const bloques = bloquesMd(cuerpo);
    const i = Number(p.donde.slice(1));
    if (!bloques[i] || !igual(bloques[i], esperado)) return 'cambiado';
    bloques[i] = bloques[i].replace(bloques[i].trim(), nuevo);
    writeFileSync(ruta, cabeza + bloques.join('\n\n'));
    return 'ok';
  }

  const datos = JSON.parse(readFileSync(ruta, 'utf8'));
  const pasos = [...p.donde.matchAll(/\.([^.[\]]+)|\[(\d+)\]/g)]
    .map((m) => (m[1] !== undefined ? m[1] : Number(m[2])));
  let nodo: any = datos;
  for (const paso of pasos.slice(0, -1)) {
    nodo = nodo?.[paso as never];
    if (nodo === undefined) return 'cambiado';
  }
  const ultimo = pasos[pasos.length - 1] as never;
  if (typeof nodo?.[ultimo] !== 'string' || !igual(nodo[ultimo], esperado)) return 'cambiado';
  nodo[ultimo] = nuevo;
  writeFileSync(ruta, `${JSON.stringify(datos, null, 2)}\n`);
  return 'ok';
}
