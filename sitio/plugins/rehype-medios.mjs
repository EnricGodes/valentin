import { visit } from 'unist-util-visit';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/* Medidas reales de las 858 fotos del Magazine, de scripts/medir-imagenes.mjs.
   Si el manifiesto no esta, se sigue sin el: se pierde la reserva de espacio,
   no la pagina. */
let MEDIDAS = {};
try {
  MEDIDAS = JSON.parse(readFileSync(
    fileURLToPath(new URL('../src/datos/medidas-magazine.json', import.meta.url)), 'utf8'));
} catch {
  console.warn('rehype-medios: sin medidas-magazine.json, las fotos sueltas no reservaran espacio');
}

/**
 * Prepara las imagenes y videos que vienen del Markdown del Magazine.
 *
 * Astro no toca las <img> que salen de Markdown, asi que sin esto todas se
 * descargan de golpe: en un post de restauracion con cuarenta fotos eso son
 * varios megas antes de que el lector llegue a la segunda pantalla.
 *
 * La primera se deja en carga inmediata porque suele ser la imagen principal
 * del articulo y es la que mide el LCP.
 *
 * Tambien les pone el ancho y el alto. En Markdown no hay donde escribirlos,
 * asi que hasta ahora una foto suelta valia cero de alto hasta descargarse: la
 * pagina saltaba al cargar y, en la rejilla editorial, la columna se colapsaba
 * y la foto ya no llegaba a entrar nunca en pantalla.
 *
 * Aqui solo pasan las fotos SUELTAS: las de galeria las emite
 * remark-modulos.mjs como HTML y no llegan a este arbol. Se marcan para que
 * el lightbox las recoja, igual que las de galeria, porque una foto que no
 * se amplia al pincharla no se lee como una decision.
 */
export default function rehypeMedios() {
  return (arbol) => {
    const imagenes = [];
    visit(arbol, 'element', (nodo) => {
      if (nodo.tagName === 'img') imagenes.push(nodo);
      if (nodo.tagName === 'video') {
        nodo.properties.preload = 'metadata';
        nodo.properties.playsInline = true;
      }
      if (nodo.tagName === 'iframe') {
        nodo.properties.loading = 'lazy';
      }
    });

    imagenes.forEach((nodo, i) => {
      nodo.properties.decoding = 'async';
      if (i === 0) {
        nodo.properties.loading = 'eager';
        nodo.properties.fetchpriority = 'high';
      } else {
        nodo.properties.loading = 'lazy';
      }
      // Sin alt, una imagen decorativa es ruido para un lector de pantalla
      if (!nodo.properties.alt) nodo.properties.alt = '';

      const medida = MEDIDAS[nodo.properties.src];
      if (medida) {
        nodo.properties.width = medida[0];
        nodo.properties.height = medida[1];
      }

      // Enfocable y anunciada: si se anuncia como pulsable tiene que
      // responder al teclado, y de eso se encarga scripts/modulos.ts.
      nodo.properties.dataSuelta = String(i);
      nodo.properties.tabIndex = 0;
      nodo.properties.role = 'button';
      nodo.properties.ariaLabel =
        `Ampliar la fotografía ${i + 1} de ${imagenes.length}`;
    });
  };
}
