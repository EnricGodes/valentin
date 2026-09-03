import { readFileSync, existsSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { visit } from 'unist-util-visit';

/**
 * Convierte las directivas de modulo del Magazine en HTML.
 *
 *   ::: articulos {ids=backdating-964-2023,restauracion-pinzas-freno}
 *   :::
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

/* Solo lo que hace falta para una tarjeta. No se parsea YAML entero: el
   frontmatter del Magazine lo escribe la migracion y es plano. */
function frontmatter(texto) {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texto);
  if (!fm) return null;
  const campo = (k) => {
    const m = new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(fm[1]);
    if (!m) return '';
    return m[1].trim().replace(/^"(.*)"$/s, '$1').trim();
  };
  return {
    title: campo('title'),
    excerpt: campo('excerpt').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    slugFinal: campo('slugFinal'),
    date: campo('date'),
    categoria: (/^categories:\s*\[\s*"([^"]+)"/m.exec(fm[1]) || [])[1] || '',
    cuerpo: texto.slice(fm[0].length),
  };
}

/**
 * Tarjetas de otros articulos del Magazine.
 *
 * En Squarespace esto era un "bloque de resumen": el editor elegia articulos y
 * el bloque pintaba foto, titulo y entradilla de cada uno. La migracion lo
 * aplano a parrafos sueltos sin foto ni enlace.
 *
 * Se pinta con los datos del articulo enlazado, no con texto copiado: asi el
 * titulo y la entradilla salen ya en el idioma de la pagina y no hay que
 * mantener diez frases repetidas en seis ficheros. Las clases son las del
 * listado del Magazine, para que una tarjeta se lea igual en todas partes.
 */
function articulos(atributos, rutaDelPost) {
  const ids = String(atributos.ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!ids.length) return '';

  const carpeta = dirname(rutaDelPost);
  const idioma = basename(carpeta);
  const fmt = new Intl.DateTimeFormat(idioma, { month: 'short', year: 'numeric' });
  const prefijo = idioma === 'es' ? '' : `/${idioma}`;

  const tarjetas = ids.map((id) => {
    // Si el articulo aun no esta traducido, la ficha se toma del castellano:
    // mejor una tarjeta en el idioma de origen que un hueco.
    const propio = resolve(carpeta, `${id}.md`);
    const ruta = existsSync(propio) ? propio : resolve(carpeta, '..', 'es', `${id}.md`);
    if (!existsSync(ruta)) return '';

    const d = frontmatter(readFileSync(ruta, 'utf8'));
    if (!d) return '';

    const foto = (d.cuerpo.match(/!\[[^\]]*\]\(([^)\s]+)/)?.[1] ?? '')
      .replace('/img/magazine/', '/img/magazine/card/');
    const fecha = d.date ? fmt.format(new Date(d.date)) : '';
    const href = `${prefijo}/magazine/${d.slugFinal || id}`;

    return `
      <a class="mag-card reveal-foto" href="${esc(href)}">
        <div class="mag-card-foto">
          ${foto
            ? `<img src="${esc(foto)}" alt="" width="700" height="525"
                    loading="lazy" decoding="async">`
            : '<span class="mag-card-sinfoto"></span>'}
        </div>
        ${fecha || d.categoria ? `<p class="mag-meta">${esc(fecha)}${
          d.categoria ? ` &middot; ${esc(d.categoria)}` : ''}</p>` : ''}
        <h3 class="mag-card-titulo">${esc(d.title)}</h3>
        ${d.excerpt ? `<p class="mag-card-deck">${esc(d.excerpt.slice(0, 130))}</p>` : ''}
      </a>`;
  }).join('');

  if (!tarjetas.trim()) return '';
  return `<div class="mag-lista mod-articulos ancha" style="--columnas:${
    Number(atributos.columnas) || 2}">${tarjetas}</div>`;
}

export default function remarkModulos() {
  return (arbol, fichero) => {
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

      if (nodo.name === 'articulos') {
        const html = articulos(at, fichero?.path || fichero?.history?.[0] || '');
        if (!html) return;
        nodo.type = 'html';
        nodo.value = html;
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
