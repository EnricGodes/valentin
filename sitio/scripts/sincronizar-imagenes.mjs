/**
 * Copia img/ (raiz del repo) a sitio/public/img/.
 *
 * Mientras el sitio viejo siga en Railway sirviendo /img/... desde la raiz, las
 * fotos tienen que existir en los dos sitios. Se copian en vez de versionarse
 * dos veces: public/img esta en .gitignore y la fuente de verdad sigue siendo
 * img/ en la raiz. Al apagar el sitio viejo, img/ se mueve aqui y esto se borra.
 */
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const origen = resolve(aqui, '../../img');
const destino = resolve(aqui, '../public/img');

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });
await cp(origen, destino, { recursive: true });
console.log(`imagenes sincronizadas: ${origen} -> ${destino}`);
