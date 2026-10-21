import { Map as MapaGL, Marker, NavigationControl, setWorkerUrl,
         type StyleSpecification, type LayerSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
/* MapLibre busca su worker al lado de su propio fichero, y Vite lo mueve al
   empaquetarlo: se le da el worker ya empaquetado por Vite. */
import worker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { sinMovimiento } from './motion.ts';

setWorkerUrl(worker);

/**
 * Mapa de un taller, con el estilo Positron de OpenFreeMap recoloreado.
 *
 * Positron es un mapa claro y casi sin color: se queda su geometria (que
 * calles se ven a cada zoom, que grosor llevan) y se le cambian los colores
 * por los del sitio. La tierra es negro carbon, el agua un punto mas honda,
 * las calles van subiendo de grafito a carbon y las autopistas son lo unico
 * con un poco de bronce, para que se lea por donde se llega. El bronce vivo
 * queda para el punto del taller.
 */
const ESTILO = 'https://tiles.openfreemap.org/styles/positron';

const C = {
  tierra:    '#141412',
  barrio:    '#171715',
  parque:    '#1A1B16',
  agua:      '#0B0B0B',
  edificio:  '#1F1E1B',
  borde:     '#262520',
  calle:     '#302D28',
  avenida:   '#433D35',
  autopista: '#6E5739',
  via:       '#2E2C28',
  texto:     '#9A958C',
  ciudad:    '#B5B0A7',
  textoAgua: '#5A5E62',
  halo:      '#0B0B0B',
};

function colorDe(l: LayerSpecification): Record<string, string> | null {
  const id = l.id;
  if (l.type === 'background') return { 'background-color': C.tierra };
  if (l.type === 'symbol') {
    if (/shield/.test(id)) return null;
    const texto = /^water/.test(id) ? C.textoAgua
      : /^label_(city|town|state|country)/.test(id) ? C.ciudad : C.texto;
    return { 'text-color': texto, 'text-halo-color': C.halo };
  }
  if (l.type === 'fill') {
    if (id === 'water') return { 'fill-color': C.agua };
    if (id === 'park' || /wood|landcover/.test(id)) return { 'fill-color': C.parque };
    if (id === 'building') return { 'fill-color': C.edificio, 'fill-outline-color': C.borde };
    if (/aeroway/.test(id)) return { 'fill-color': C.barrio };
    if (/pier/.test(id)) return { 'fill-color': C.tierra };
    return { 'fill-color': C.barrio };
  }
  if (l.type === 'line') {
    if (id === 'waterway') return { 'line-color': C.agua };
    if (/boundary/.test(id)) return { 'line-color': 'rgba(167, 162, 154, 0.14)' };
    if (/casing/.test(id)) return { 'line-color': C.tierra };
    if (/railway/.test(id)) return { 'line-color': /dash/.test(id) ? C.tierra : C.via };
    if (/motorway/.test(id)) return { 'line-color': C.autopista };
    if (/major/.test(id)) return { 'line-color': C.avenida };
    if (/pier/.test(id)) return { 'line-color': C.tierra };
    return { 'line-color': C.calle };
  }
  return {};
}

async function estilo(): Promise<StyleSpecification> {
  const base: StyleSpecification = await (await fetch(ESTILO)).json();
  base.layers = base.layers.flatMap((l) => {
    const pintura = colorDe(l);
    if (pintura === null) return [];
    return [{ ...l, paint: { ...(l as any).paint, ...pintura } } as LayerSpecification];
  });
  return base;
}

let estiloPedido: Promise<StyleSpecification> | undefined;

export async function pintarMapa(el: HTMLElement): Promise<void> {
  const centro = JSON.parse(el.dataset.mapa!) as [number, number];
  estiloPedido ??= estilo();
  const tactil = window.matchMedia('(pointer: coarse)').matches;

  const mapa = new MapaGL({
    container: el,
    style: await estiloPedido,
    center: centro,
    zoom: 15,
    minZoom: 11,
    maxZoom: 18,
    /* La rueda y el dedo son del scroll de la pagina: el mapa no los roba.
       Se acerca con los botones o con dos dedos. */
    scrollZoom: false,
    dragPan: !tactil,
    dragRotate: false,
    pitchWithRotate: false,
    attributionControl: { compact: true },
    fadeDuration: sinMovimiento() ? 0 : 300,
  });
  mapa.touchZoomRotate.disableRotation();
  mapa.addControl(new NavigationControl({ showCompass: false }), 'top-right');

  const punto = document.createElement('div');
  punto.className = 'mapa-punto';
  new Marker({ element: punto }).setLngLat(centro).addTo(mapa);
}
