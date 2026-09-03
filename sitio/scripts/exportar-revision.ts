/**
 * Saca el castellano del sitio a ficheros de revision.
 *
 *   npm run revision:exportar [palabras-por-lote]
 *
 * Trocea en lotes para que cada uno quepa de una vez en la herramienta con la
 * que se revise, y escribe junto a ellos las instrucciones de como revisarlos
 * y como devolverlos. Van aqui y no en un fichero suelto porque la carpeta
 * revision/ se borra en cuanto la tanda esta aplicada: si las instrucciones
 * vivieran dentro, se irian con ella. Cada pieza lleva su `id`, el `texto` tal cual esta y un campo
 * `corregido` vacio: se rellena SOLO donde haya cambio, y lo que se deja vacio
 * no se toca al importar.
 */
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerPiezas, raiz } from './revision-es.ts';

const LEEME = `# Revisión ortográfica y de estilo del castellano

Los ficheros \`es-NN.json\` traen toda la prosa en castellano del sitio, troceada
en lotes que caben de una vez en cualquier herramienta de revisión.

## Cómo se revisa

Cada fila tiene tres campos:

\`\`\`json
{ "id": "src/content/magazine/es/porsche-964.md#b3",
  "texto": "El texto tal como está hoy",
  "corregido": "" }
\`\`\`

Se rellena **\`corregido\` solo donde haya algo que cambiar**. Lo que se deja
vacío no se toca. \`id\` y \`texto\` no se tocan nunca: son los que devuelven la
pieza a su sitio.

## Qué corregir

- Faltas de ortografía y tildes.
- Puntuación: interrogaciones y exclamaciones sin abrir, mayúscula después de
  dos puntos (en castellano va minúscula salvo nombre propio o cita).
- Mayúsculas caprichosas dentro de la frase ("Reimaginado de forma Integral").
- Concordancia y frases que no cierran.
- Tono: contenido, preciso, editorial. Sin exclamaciones ni lenguaje de
  concesionario. Sin guion largo (—): en castellano va coma, punto y coma o
  dos puntos.

## Qué NO tocar

- El marcado: \`**negritas**\`, \`[enlaces](/ruta)\`, \`![imágenes]()\`,
  \`:::directivas\` y etiquetas HTML. El importador rechaza cualquier pieza donde
  cambie el número de esas marcas.
- Los términos técnicos, que se escriben igual en los seis idiomas: IMS, IMSB,
  M96, M97, Mezger, 9A1/MA1, 6204, 6305, bore scoring, backdating, glass-out.
- Los nombres de modelo: Targa y Carrera van en mayúscula en los seis idiomas.
- Nombres propios, referencias de motor y matrículas.
- Las cifras.

## Cómo vuelve

\`\`\`bash
npm run revision:importar -- --probar    # dice qué haría, sin tocar nada
npm run revision:importar                # aplica solo lo que corrige
npm run revision:importar -- --limite=1  # aplica también lo que reescribe
npm run ortotipografia && npm run build  # comprueba que todo sigue en pie
\`\`\`

Por defecto entra lo que cambia como mucho dos palabras o el 10% de ellas: eso
es una corrección. Lo que pasa de ahí reescribe la voz del texto, que es una
decisión editorial, y necesita \`--limite\` explícito.

Una pieza no se aplica si el fichero ya no contiene el texto que se exportó
(alguien lo editó mientras tanto) o si la corrección altera el marcado. En los
dos casos el importador lo dice y sigue con las demás.

Solo castellano: las traducciones se dan por buenas y no se regeneran. La
excepción son los términos invariantes, que el glosario obliga a escribir igual
en los seis idiomas.
`;

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

writeFileSync(join(destino, 'LEEME.md'), LEEME);

const total = piezas.reduce((n, p) => n + p.texto.split(/\s+/).length, 0);
console.log(`revision: ${piezas.length} piezas, ${total} palabras, ${lotes.length} lotes en revision/`);
console.log('Rellena "corregido" solo donde haya cambio y luego: npm run revision:importar');
