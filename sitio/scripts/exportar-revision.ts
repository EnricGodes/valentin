/**
 * Saca el castellano del sitio a ficheros de revision.
 *
 *   npm run revision:exportar [palabras-por-lote]
 *
 * Trocea en lotes para que cada uno quepa de una vez en la herramienta con la
 * que se revise. Cada pieza lleva su `id`, el `texto` tal cual esta y un campo
 * `corregido` vacio: se rellena SOLO donde haya cambio, y lo que se deja vacio
 * no se toca al importar.
 */
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerPiezas, raiz } from './revision-es.ts';

const porLote = Number(process.argv[2]) || 1200;
const destino = join(raiz, 'revision');

const piezas = leerPiezas();
if (existsSync(destino)) rmSync(destino, { recursive: true });
mkdirSync(destino, { recursive: true });

const lotes: (typeof piezas)[] = [];
let actual: typeof piezas = [];
let palabras = 0;
for (const p of piezas) {
  const n = p.texto.split(/\s+/).length;
  // Una pieza nunca se parte: si no cabe, empieza lote. Partir un parrafo
  // por la mitad es pedirle a quien revisa que corrija sin contexto.
  if (actual.length && palabras + n > porLote) {
    lotes.push(actual); actual = []; palabras = 0;
  }
  actual.push(p); palabras += n;
}
if (actual.length) lotes.push(actual);

lotes.forEach((lote, i) => {
  const nombre = `es-${String(i + 1).padStart(2, '0')}.json`;
  const contenido = lote.map((p) => ({ id: p.id, texto: p.texto, corregido: '' }));
  writeFileSync(join(destino, nombre), `${JSON.stringify(contenido, null, 2)}\n`);
});

const total = piezas.reduce((n, p) => n + p.texto.split(/\s+/).length, 0);
console.log(`revision: ${piezas.length} piezas, ${total} palabras, ${lotes.length} lotes en revision/`);
console.log('Rellena "corregido" solo donde haya cambio y luego: npm run revision:importar');
