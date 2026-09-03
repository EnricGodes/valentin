/**
 * Comportamiento de la consulta de tarifas.
 *
 * Los precios viajan como datos en un <script type="application/json"> y la
 * tabla se monta aqui. Asi la pagina lleva 7 KB de precios en vez de los 195
 * que ocupaban los 57 paneles pintados uno a uno.
 *
 * Sin JavaScript se ve el primer modelo, que es el que viene pintado del
 * servidor, y los nombres de los 57 siguen en el HTML.
 */
interface Modelo {
  id: string;
  n: string;
  f: string;
  /** [concepto, detalle, importe ya formateado, 1 si es "desde"] */
  s: [string, string, string, number][];
}

export function iniciarTarifas(): void {
  for (const raiz of document.querySelectorAll<HTMLElement>('[data-tarifas]')) {
    const buscar = raiz.querySelector<HTMLInputElement>('[data-tarifas-buscar]');
    const panel = raiz.querySelector<HTMLElement>('[data-tarifas-panel]');
    const vacio = raiz.querySelector<HTMLElement>('[data-tarifas-vacio]');
    const crudo = raiz.querySelector<HTMLScriptElement>('[data-tarifas-datos]');
    if (!buscar || !panel || !crudo) continue;

    const modelos: Modelo[] = JSON.parse(crudo.textContent || '[]');
    const porId = new Map(modelos.map((m) => [m.id, m]));
    const botones = [...raiz.querySelectorAll<HTMLButtonElement>('[data-modelo]')];

    function pinta(id: string) {
      const m = porId.get(id);
      if (!m || !panel) return;
      const filas = m.s.map(([concepto, detalle, importe, desde]) => `
        <div class="tarifas-fila">
          <dt>${esc(concepto)}${detalle ? `<span class="tarifas-detalle">${esc(detalle)}</span>` : ''}</dt>
          <dd>${desde ? '<span class="tarifas-desde">desde</span>' : ''}${esc(importe)} €</dd>
        </div>`).join('');
      panel.innerHTML =
        `<h3 class="tarifas-panel-titulo">${esc(m.n)}</h3><dl class="tarifas-tabla">${filas}</dl>`;
      for (const b of botones) b.setAttribute('aria-pressed', String(b.dataset.modelo === id));
    }

    for (const b of botones) b.addEventListener('click', () => pinta(b.dataset.modelo!));

    /* Sin acentos ni mayusculas: quien busca "911 carrera" no deberia perder
       su coche por una tilde. */
    const llano = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '');

    const filtrar = () => {
      const q = llano(buscar.value.trim());
      let visibles: HTMLButtonElement[] = [];
      for (const b of botones) {
        const m = porId.get(b.dataset.modelo!);
        const cabe = !q || llano(`${m?.n ?? ''} ${m?.f ?? ''}`).includes(q);
        b.hidden = !cabe;
        if (cabe) visibles.push(b);
      }
      if (vacio) vacio.hidden = visibles.length > 0;
      // Si la busqueda deja un solo modelo, se abre sin tener que pulsarlo.
      if (q && visibles.length === 1) pinta(visibles[0].dataset.modelo!);
    };

    buscar.addEventListener('input', filtrar);
    /* Al volver atras el navegador restaura lo escrito, pero no dispara input:
       sin esto la caja dice "997.1 gt3" y debajo estan los 57 modelos. */
    if (buscar.value.trim()) filtrar();
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
