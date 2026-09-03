/**
 * Devuelve a su sitio las correcciones de revision/.
 *
 *   npm run revision:importar -- [--dir=revision/corregidos] [--limite=0.10] [--probar]
 *
 * `--limite` es cuanto puede cambiar una pieza, de 0 a 1. Una correccion
 * ortografica toca letras sueltas y se queda muy por debajo de 0.10; una que
 * cambia mas de eso ya no corrige, reescribe, y reescribir la voz de un texto
 * es una decision editorial que no se cuela dentro de una tanda de faltas.
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

/** Cuanto ha cambiado, de 0 (nada) a 1 (todo). Distancia de edicion normalizada. */
function magnitud(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  let fila = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let ant = fila[0];
    fila[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = fila[j];
      fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, ant + (a[i - 1] === b[j - 1] ? 0 : 1));
      ant = tmp;
    }
  }
  return fila[n] / Math.max(m, n);
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
    const cuanto = magnitud(fila.texto.trim(), nuevo);
    if (cuanto > limite) { grandes.push(`${fila.id} (${(cuanto * 100).toFixed(0)}%)`); continue; }
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
