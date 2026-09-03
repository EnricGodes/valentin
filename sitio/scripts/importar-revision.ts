/**
 * Devuelve a su sitio las correcciones de revision/.
 *
 *   npm run revision:importar [--probar]
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
const origen = join(raiz, 'revision');
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

let aplicadas = 0; const saltadas: string[] = []; const sospechosas: string[] = [];

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
    if (probar) { aplicadas++; continue; }
    const r = escribirPieza(pieza, fila.texto.trim(), nuevo);
    if (r === 'ok') aplicadas++;
    else saltadas.push(`${fila.id} (el fichero ha cambiado desde la exportacion)`);
  }
}

console.log(`revision: ${aplicadas} correcciones ${probar ? 'aplicables' : 'aplicadas'}`);
for (const s of sospechosas) console.warn(`  RECHAZADA ${s}`);
for (const s of saltadas) console.warn(`  SALTADA   ${s}`);
if (!probar && aplicadas) console.log('Comprueba el resultado con: npm run ortotipografia && npm run build');
