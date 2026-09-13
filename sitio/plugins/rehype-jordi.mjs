/**
 * "La opinion de Jordi" y "El consejo tecnico de Jordi" en el Magazine.
 *
 * Venian de Squarespace como un H3 mas, con los parrafos de Jordi debajo
 * indistinguibles del resto del articulo, y a veces con una foto suya justo
 * antes. Aqui se convierten en lo que son en el resto del sitio, una voz con
 * cara: el retrato de Jordi a la izquierda, como en la opinion de las fichas
 * de coche, y a la derecha su texto como testimonio, en serif y con firma,
 * como en la pagina del taller.
 *
 * El bloque lo delimita la forma, no el idioma: un H2 o H3 que contiene
 * "Jordi" y lo que le sigue hasta el siguiente encabezado, foto o modulo.
 * La foto que lo precedia (su retrato de Squarespace o la de "al volante",
 * que se repetia en tres articulos) se quita: el retrato ya va dentro.
 *
 * Corre antes de rehype-editorial, que es quien coloca cada bloque en la
 * rejilla; el aside sale con la clase `ancha` puesta para que lo respete.
 */
const ROL = {
  es: 'Especialista Porsche · Valentin Motors',
  en: 'Porsche specialist · Valentin Motors',
  fr: 'Spécialiste Porsche · Valentin Motors',
  it: 'Specialista Porsche · Valentin Motors',
  de: 'Porsche-Spezialist · Valentin Motors',
  ca: 'Especialista Porsche · Valentin Motors',
};
const RETRATO = '/img/ruf/jordi.jpg';

const vacio = (n) => n.type === 'text' && !n.value.trim();
const texto = (n) => n.type === 'text' ? n.value : (n.children || []).map(texto).join('');
const esEncabezado = (n) => n.type === 'element' && /^h[1-4]$/.test(n.tagName);
const esModulo = (n) => n.type === 'raw' || (n.type === 'element' && n.tagName !== 'p' && n.tagName !== 'ul' && n.tagName !== 'ol');
function fotoSuelta(n) {
  if (n.type !== 'element' || n.tagName !== 'p') return null;
  const h = n.children.filter((x) => !vacio(x));
  const img = h.find((x) => x.type === 'element' && x.tagName === 'img');
  return img && !h.some((x) => x !== img && x.type === 'element') ? img : null;
}
const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const txt = (value) => ({ type: 'text', value });

export default function rehypeJordi() {
  return (arbol, file) => {
    const idioma = (String(file?.path || '').match(/magazine\/(\w\w)\//) || [])[1] || 'es';
    const hijos = arbol.children;
    for (let i = 0; i < hijos.length; i++) {
      const n = hijos[i];
      if (!esEncabezado(n) || !/jordi/i.test(texto(n))) continue;

      // Lo que dice: hasta el siguiente encabezado, foto o modulo.
      let j = i + 1;
      const cuerpo = [];
      while (j < hijos.length) {
        const m = hijos[j];
        if (vacio(m)) { j++; continue; }
        if (esEncabezado(m) || fotoSuelta(m) || esModulo(m)) break;
        cuerpo.push(m); j++;
      }
      if (!cuerpo.length) continue;

      // La foto que lo precedia, si era de Jordi.
      let k = i - 1;
      while (k >= 0 && vacio(hijos[k])) k--;
      const previa = k >= 0 ? fotoSuelta(hijos[k]) : null;
      const quitarPrevia = previa && /foto-jordi|IMG_5792/i.test(String(previa.properties?.src || ''));

      const aside = el('aside', { className: ['jordi-nota', 'ancha'] }, [
        el('div', { className: ['jordi-nota-foto'] }, [
          el('div', { className: ['jordi-photo-wrap'] }, [
            el('img', { src: RETRATO, alt: 'Jordi Edo', width: 800, height: 999, loading: 'lazy', decoding: 'async' }),
            el('span', { className: ['jordi-photo-border'], ariaHidden: 'true' }),
          ]),
          el('p', { className: ['jordi-name'] }, [txt('Jordi Edo')]),
          el('p', { className: ['jordi-role'] }, [txt(ROL[idioma] || ROL.es)]),
        ]),
        el('div', { className: ['jordi-nota-texto'] }, [
          el('p', { className: ['section-label'] }, [txt(texto(n).trim())]),
          el('figure', { className: ['testimonio', 'testimonio--jordi'] }, [
            el('span', { className: ['testimonio-comilla'], ariaHidden: 'true' }, [txt('“')]),
            el('blockquote', { className: ['testimonio-cita'] }, cuerpo),
          ]),
        ]),
      ]);

      const desde = quitarPrevia ? k : i;
      hijos.splice(desde, j - desde, aside);
      i = desde;
    }
  };
}
