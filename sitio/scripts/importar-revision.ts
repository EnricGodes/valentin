/**
 * Devuelve a su sitio las correcciones de revision/.
 *
 *   npm run revision:importar -- [--dir=revision/corregidos] [--limite=0.10] [--probar]
 *
 * `--limite` es que proporcion de PALABRAS puede cambiar una pieza. Se mide en
 * palabras y no en caracteres porque una coma anadida junto a una URL larga
 * mueve el 35% de los caracteres sin tocar una sola palabra.
 *
 * Una correccion que solo pone tildes o puntuacion vale 0 y entra siempre: las
 * palabras son las mismas. Cambiar dos palabras tambien entra, aunque el
 * parrafo sea corto y la proporcion se dispare. Lo que se queda fuera es la
 * reescritura, que no corrige la voz de un texto: la sustituye, y eso es una
 * decision editorial que no se cuela dentro de una tanda de faltas.
 * Con `--limite=1` entran todas.
 *
 * Solo aplica una pieza si el fichero sigue conteniendo exactamente el texto
 * que se exporto. Si no, la salta y lo dice: alguien la ha editado despues de
 * exportar y aplicar seria pisarle el cambio.
 *
 * Ademas comprueba que la correccion no toca la estructura. Una revision
 * ortografica cambia letras, no enlaces ni negritas ni directivas: si el
 * numero de esas marcas no coincide, la pieza se rechaza para mirarla a mano.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerPiezas, escribirPieza, raiz } from './revision-es.ts';

const probar = process.argv.includes('--probar');
const arg = (n: string, x: number) => {
  const v = process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1];
  return v === undefined ? x : Number(v);
};
const limite = arg('limite', 0.10);
const dir = process.argv.find((a) => a.startsWith('--dir='))?.split('=')[1] ?? 'revision';
const origen = join(raiz, dir);
if (!existsSync(origen)) {
  console.error('revision: no hay carpeta revision/. Ejecuta antes npm run revision:exportar');
  process.exit(1);
}

const porId = new Map(leerPiezas().map((p) => [p.id, p]));

/** Marcas que una correccion ortografica no puede alterar. */
const estructura = (t: string) => JSON.stringify([
  (t.match(/\[[^\]]*\]\([^)]*\)/g) ?? []).length,   // enlaces
  (t.match(/!\[/g) ?? []).length,                    // imagenes
  (t.match(/\*\*/g) ?? []).length,                   // negritas
  (t.match(/<[^>]+>/g) ?? []).length,                // html
  (t.match(/:::/g) ?? []).length,                    // directivas
]);

/** Palabras sin tildes ni puntuacion: la unidad en la que se mide el cambio. */
function desnudo(t: string): string[] {
  return t.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').match(/[a-z0-9]+/g) ?? [];
}

/** Cuantas palabras se han tocado y que proporcion del total suponen. */
function cambio(a: string, b: string): { palabras: number; proporcion: number } {
  const pa = desnudo(a), pb = desnudo(b);
  if (pa.join(' ') === pb.join(' ')) return { palabras: 0, proporcion: 0 };
  // Longitud de la subsecuencia comun mas larga: lo que sobra a cada lado son
  // las palabras que se han quitado y las que se han puesto.
  const t = Array.from({ length: pb.length + 1 }, () => 0);
  for (let i = 1; i <= pa.length; i++) {
    let diag = 0;
    for (let j = 1; j <= pb.length; j++) {
      const prev = t[j];
      t[j] = pa[i - 1] === pb[j - 1] ? diag + 1 : Math.max(t[j], t[j - 1]);
      diag = prev;
    }
  }
  const comunes = t[pb.length];
  const tocadas = Math.max(pa.length, pb.length) - comunes;
  return { palabras: tocadas, proporcion: tocadas / Math.max(pa.length, 1) };
}

let aplicadas = 0; const saltadas: string[] = []; const sospechosas: string[] = [];
const grandes: string[] = [];

for (const f of readdirSync(origen).filter((n) => n.endsWith('.json')).sort()) {
  for (const fila of JSON.parse(readFileSync(join(origen, f), 'utf8'))) {
    const nuevo = (fila.corregido ?? '').trim();
    if (!nuevo || nuevo === fila.texto.trim()) continue;

    const pieza = porId.get(fila.id);
    if (!pieza) { saltadas.push(`${fila.id} (ya no existe)`); continue; }
    if (estructura(fila.texto) !== estructura(nuevo)) {
      sospechosas.push(`${fila.id} (cambia enlaces, negritas o directivas)`);
      continue;
    }
    const c = cambio(fila.texto.trim(), nuevo);
    // Dos palabras sueltas son una correccion aunque el parrafo sea corto. Y
    // un limite de 1 o mas es "todas": un texto corregido puede ser mas largo
    // que el original, y entonces la proporcion pasa del 100% sin ser enorme.
    if (limite < 1 && c.palabras > 2 && c.proporcion > limite) {
      grandes.push(`${fila.id} (${c.palabras} palabras, ${(c.proporcion * 100).toFixed(0)}%)`);
      continue;
    }
    if (probar) { aplicadas++; continue; }
    const r = escribirPieza(pieza, fila.texto.trim(), nuevo);
    if (r === 'ok') aplicadas++;
    else saltadas.push(`${fila.id} (el fichero ha cambiado desde la exportacion)`);
  }
}

console.log(`revision: ${aplicadas} correcciones ${probar ? 'aplicables' : 'aplicadas'} (limite ${limite})`);
if (grandes.length) {
  console.warn(`  ${grandes.length} pasan del limite y no se aplican; son reescrituras, no faltas`);
  for (const g of grandes.slice(0, 5)) console.warn(`    ${g}`);
  if (grandes.length > 5) console.warn(`    ...y ${grandes.length - 5} mas`);
}
for (const s of sospechosas) console.warn(`  RECHAZADA ${s}`);
for (const s of saltadas) console.warn(`  SALTADA   ${s}`);
if (!probar && aplicadas) console.log('Comprueba el resultado con: npm run ortotipografia && npm run build');
