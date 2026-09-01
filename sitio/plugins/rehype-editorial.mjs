/**
 * Coloca el cuerpo del Magazine en la rejilla editorial.
 *
 * El Markdown es una secuencia plana de parrafos, fotos y modulos, y el
 * layout que queremos no lo es: la columna de texto vive a la derecha y la
 * fotografia entra y sale de ella. Decidirlo a mano articulo por articulo son
 * 252 ficheros; decidirlo aqui es una regla de ritmo que se aplica sola.
 *
 * Lo que hace, en orden de documento:
 *
 *   1. Si el articulo abre con una foto suelta, la marca como portada. Esa
 *      foto pasa a la cabecera a sangre y se oculta en el cuerpo, para no
 *      verla dos veces. Abren asi 33 de los 42 posts.
 *   2. Envuelve cada foto suelta en un <figure> y les alterna el ancho:
 *      la primera visible ocupa las dos columnas, la siguiente se va a la
 *      columna lateral, y asi. La rejilla coloca el parrafo siguiente a su
 *      lado, que es de donde sale el aire de la pagina.
 *   3. El pie de foto (que en este contenido es un parrafo en cursiva justo
 *      debajo) hereda la colocacion de su foto, para que quede alineado con
 *      ella y no con el texto. El de la foto de apertura se oculta con ella.
 *   4. Marca las citas, su firma y los separadores.
 *   5. Pone .reveal en todo lo de primer nivel, que es lo que recoge el
 *      observador de scripts/reveal.ts.
 *
 * Las galerias y los videos no pasan por aqui: remark-modulos.mjs los emite
 * como HTML crudo y en este arbol no son elementos. Su colocacion la deciden
 * ellos mismos, con las mismas clases.
 */

const anadeClase = (nodo, ...clases) => {
  const previas = nodo.properties.className || [];
  nodo.properties.className = [
    ...(Array.isArray(previas) ? previas : [previas]), ...clases,
  ];
};

/** Un nodo que no pinta nada: salto de linea entre bloques. */
const vacio = (n) =>
  (n.type === 'text' || n.type === 'raw') && !String(n.value).trim();

/** <p> cuyo unico contenido real es una imagen: una foto suelta. */
function fotoSuelta(nodo) {
  if (nodo.type !== 'element' || nodo.tagName !== 'p') return null;
  const hijos = nodo.children.filter((h) => !vacio(h));
  const img = hijos.find((h) => h.type === 'element' && h.tagName === 'img');
  if (!img || hijos.some((h) => h !== img && h.type === 'element')) return null;
  return img;
}

/** <p><em>…</em></p>: el pie de foto tal y como quedo al salir de Squarespace. */
function pieDeFoto(nodo) {
  if (nodo.type !== 'element' || nodo.tagName !== 'p') return false;
  const hijos = nodo.children.filter((h) => !vacio(h));
  return hijos.length === 1 && hijos[0].type === 'element' && hijos[0].tagName === 'em';
}

/** Una cita que solo lleva la atribucion: "— Jordi Edo". */
function esFirma(nodo) {
  const texto = [];
  (function recoge(n) {
    if (n.type === 'text') texto.push(n.value);
    (n.children || []).forEach(recoge);
  })(nodo);
  const t = texto.join(' ').trim();
  return t.length < 90 && /^[—–-]\s*\S/.test(t);
}

export default function rehypeEditorial() {
  return (arbol) => {
    const hijos = arbol.children;
    const primero = hijos.find((n) => !vacio(n));

    let sueltas = 0;
    let ultimaColocacion = null;

    for (const nodo of hijos) {
      if (vacio(nodo)) continue;

      const img = fotoSuelta(nodo);
      if (img) {
        // La foto de apertura sube a la cabecera; aqui se oculta.
        const esPortada = nodo === primero;
        // Ancha, lateral, ancha, lateral: el ritmo de la pagina.
        const colocacion = esPortada ? 'es-portada' : (sueltas % 2 === 0 ? 'ancha' : 'en-lateral');
        if (!esPortada) sueltas += 1;
        ultimaColocacion = colocacion;

        nodo.tagName = 'figure';
        nodo.children = [img];
        nodo.properties = {};
        anadeClase(nodo, 'mod-suelta');
        if (esPortada) {
          nodo.properties.dataPortada = '';
        } else {
          anadeClase(nodo, colocacion, 'reveal-foto');
        }
        continue;
      }

      if (pieDeFoto(nodo) && ultimaColocacion !== null) {
        // El pie de la foto de apertura se va con ella: la portada ya lleva
        // titular y creditos, y un pie suelto ahi no describe nada.
        if (ultimaColocacion === 'es-portada') {
          nodo.properties.dataPortada = '';
          anadeClase(nodo, 'mod-pie');
        } else {
          anadeClase(nodo, 'mod-pie', ultimaColocacion, 'reveal');
        }
        ultimaColocacion = null;
        continue;
      }
      ultimaColocacion = null;

      if (nodo.type !== 'element') continue;

      if (nodo.tagName === 'blockquote') {
        anadeClase(nodo, esFirma(nodo) ? 'cita-firma' : 'cita', 'ancha', 'reveal');
        continue;
      }
      if (nodo.tagName === 'hr') {
        anadeClase(nodo, 'ancha');
        continue;
      }
      anadeClase(nodo, 'reveal');
    }
  };
}
