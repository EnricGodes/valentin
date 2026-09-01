import { visit } from 'unist-util-visit';

/**
 * Convierte las directivas de modulo del Magazine en HTML.
 *
 *   ::: galeria {diseno=cuadricula porFila=3 proporcion=square lightbox}
 *   ![alt](/img/a.jpg "pie")
 *   :::
 *
 * Existen porque el cuerpo de los posts venia de Squarespace con 67 galerias
 * (49 cuadriculas, 12 pases, 4 carruseles, 2 apiladas) que la primera
 * extraccion aplano en imagenes sueltas apiladas. La configuracion original
 * se recupero del snapshot y vive ahora en estos atributos.
 *
 * Se emite HTML plano en vez de componentes de Astro porque el contenido es
 * .md, no .mdx: asi el Magazine sigue siendo Markdown editable y el
 * comportamiento lo pone un unico script global, no una isla por galeria.
 */

const PROPORCIONES = {
  standard: '4 / 3',
  square: '1 / 1',
  'three-four-vertical': '3 / 4',
  widescreen: '16 / 9',
};

/* Donde se coloca cada modulo en la rejilla editorial del articulo. El pase
   y el carrusel se van a sangre porque son secuencias: ocupan la pantalla y
   el lector deja de leer para mirar. La cuadricula y la pila se quedan en el
   ancho de las dos columnas, que es donde acompanan al texto. */
const COLOCACION = {
  pase: 'a-sangre',
  carrusel: 'a-sangre',
  cuadricula: 'ancha',
  apilada: 'ancha',
};

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
           .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Recoge las imagenes de dentro de la directiva, en orden. */
function fotos(nodo) {
  const salida = [];
  visit(nodo, 'image', (img) => {
    salida.push({ src: img.url, alt: img.alt || '', pie: img.title || '' });
  });
  return salida;
}

function galeria(atributos, imagenes) {
  const diseno = atributos.diseno || 'cuadricula';
  const porFila = Number(atributos.porFila) || 3;
  const proporcion = PROPORCIONES[atributos.proporcion] || PROPORCIONES.standard;
  // Activo salvo que se apague a proposito. Squarespace lo traia desactivado
  // en 33 de las 67 galerias, y el lector que pincha una foto espera que se
  // abra: no abrirse no se lee como una decision, se lee como algo roto.
  const lightbox = atributos.lightbox !== 'no';

  const items = imagenes.map((f, i) => `
    <figure class="mod-foto">
      <img src="${esc(f.src)}" alt="${esc(f.alt)}" loading="lazy" decoding="async"
           ${lightbox ? `data-lightbox="${i}" tabindex="0" role="button"
           aria-label="Ampliar la fotografía ${i + 1} de ${imagenes.length}"` : ''}>
      ${f.pie ? `<figcaption>${esc(f.pie)}</figcaption>` : ''}
    </figure>`).join('');

  // El pase y el carrusel necesitan saber cuantas hay para los indicadores.
  return `<div class="mod-galeria mod-galeria--${esc(diseno)} ${COLOCACION[diseno] || 'ancha'} reveal-foto"
    data-diseno="${esc(diseno)}" data-total="${imagenes.length}"
    ${lightbox ? 'data-lightbox' : ''}
    style="--por-fila:${porFila};--proporcion:${proporcion}">
    <div class="mod-pista">${items}</div>
    ${diseno === 'pase' || diseno === 'carrusel' ? `
      <button class="mod-nav mod-nav--antes" type="button" aria-label="Anterior"></button>
      <button class="mod-nav mod-nav--luego" type="button" aria-label="Siguiente"></button>
      <p class="mod-contador"><span>1</span> / ${imagenes.length}</p>` : ''}
  </div>`;
}

export default function remarkModulos() {
  return (arbol) => {
    visit(arbol, (nodo) => {
      if (nodo.type !== 'containerDirective') return;
      const at = nodo.attributes || {};

      if (nodo.name === 'galeria') {
        const imgs = fotos(nodo);
        if (!imgs.length) return;
        nodo.type = 'html';
        nodo.value = galeria(at, imgs);
        nodo.children = [];
        return;
      }

      if (nodo.name === 'video') {
        nodo.type = 'html';
        // Los verticales de taller (1080x1920) caben en la columna lateral y
        // dejan el texto a su lado; los apaisados piden las dos columnas.
        const vertical = Number(at.alto) > Number(at.ancho);
        nodo.value = `<div class="mod-video ${vertical ? 'en-lateral' : 'ancha'} reveal">
          <video src="${esc(at.src)}" controls preload="metadata" playsinline
                 ${at.ancho ? `width="${esc(at.ancho)}"` : ''}
                 ${at.alto ? `height="${esc(at.alto)}"` : ''}></video>
        </div>`;
        nodo.children = [];
        return;
      }

      /* Herramienta incrustada. Solo deja el hueco: el componente lo pinta
         Astro una vez y el script lo mueve aqui, para no tener el formulario
         escrito dos veces ni el motor de reglas duplicado. */
      if (nodo.name === 'herramienta') {
        nodo.type = 'html';
        nodo.value = `<div class="ancha" data-ims-hueco="${esc(at.id)}"></div>`;
        nodo.children = [];
        return;
      }

      if (nodo.name === 'youtube') {
        nodo.type = 'html';
        nodo.value = `<div class="mod-incrustado ancha reveal">
          <iframe src="https://www.youtube-nocookie.com/embed/${esc(at.id)}"
                  title="Vídeo de YouTube" loading="lazy" allowfullscreen
                  referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>`;
        nodo.children = [];
      }
    });
  };
}
