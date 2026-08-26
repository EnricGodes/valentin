import { visit } from 'unist-util-visit';

/**
 * Prepara las imagenes y videos que vienen del Markdown del Magazine.
 *
 * Astro no toca las <img> que salen de Markdown, asi que sin esto todas se
 * descargan de golpe: en un post de restauracion con cuarenta fotos eso son
 * varios megas antes de que el lector llegue a la segunda pantalla.
 *
 * La primera se deja en carga inmediata porque suele ser la imagen principal
 * del articulo y es la que mide el LCP.
 */
export default function rehypeMedios() {
  return (arbol) => {
    let n = 0;
    visit(arbol, 'element', (nodo) => {
      if (nodo.tagName === 'img') {
        n++;
        nodo.properties.decoding = 'async';
        if (n === 1) {
          nodo.properties.loading = 'eager';
          nodo.properties.fetchpriority = 'high';
        } else {
          nodo.properties.loading = 'lazy';
        }
        // Sin alt, una imagen decorativa es ruido para un lector de pantalla
        if (!nodo.properties.alt) nodo.properties.alt = '';
      }
      if (nodo.tagName === 'video') {
        nodo.properties.preload = 'metadata';
        nodo.properties.playsInline = true;
      }
      if (nodo.tagName === 'iframe') {
        nodo.properties.loading = 'lazy';
      }
    });
  };
}
