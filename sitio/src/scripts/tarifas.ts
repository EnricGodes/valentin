/**
 * Comportamiento de la consulta de tarifas.
 *
 * Dos columnas encadenadas, como el Finder: elegir familia cambia la lista de
 * modelos, elegir modelo cambia la tabla. Elegir familia selecciona ademas su
 * primer modelo, para que la tabla nunca quede hablando de un coche que ya no
 * esta en la lista de al lado.
 *
 * Los precios viajan como datos en un <script type="application/json"> y la
 * tabla se monta aqui: pintar los 57 paneles en el servidor costaba 195 KB de
 * HTML para 7 KB de precios.
 */
interface Modelo {
  id: string;
  n: string;
  /** [concepto, detalle, importe ya formateado, 1 si es "desde"] */
  s: [string, string, string, number][];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function iniciarTarifas(): void {
  for (const raiz of document.querySelectorAll<HTMLElement>('[data-tarifas]')) {
    const panel = raiz.querySelector<HTMLElement>('[data-tarifas-panel]');
    const crudo = raiz.querySelector<HTMLScriptElement>('[data-tarifas-datos]');
    if (!panel || !crudo) continue;

    const porId = new Map<string, Modelo>(
      (JSON.parse(crudo.textContent || '[]') as Modelo[]).map((m) => [m.id, m]),
    );
    const familias = [...raiz.querySelectorAll<HTMLButtonElement>('[data-familia]')];
    const modelos = [...raiz.querySelectorAll<HTMLButtonElement>('[data-modelo]')];

    function pintaModelo(id: string) {
      const m = porId.get(id);
      if (!m || !panel) return;
      const filas = m.s.map(([concepto, detalle, importe, desde]) => `
        <div class="tarifas-fila">
          <dt>${esc(concepto)}${detalle ? `<span class="tarifas-detalle">${esc(detalle)}</span>` : ''}</dt>
          <dd>${desde ? '<span class="tarifas-desde">desde</span>' : ''}${esc(importe)} €</dd>
        </div>`).join('');
      panel.innerHTML =
        `<h3 class="tarifas-panel-titulo">${esc(m.n)}</h3><dl class="tarifas-tabla">${filas}</dl>`;
      for (const b of modelos) b.setAttribute('aria-pressed', String(b.dataset.modelo === id));
    }

    function abreFamilia(id: string) {
      let primero: HTMLButtonElement | null = null;
      for (const b of modelos) {
        const fila = b.closest('li');
        const suya = fila?.dataset.de === id;
        if (fila) fila.hidden = !suya;
        if (suya && !primero) primero = b;
      }
      for (const f of familias) f.setAttribute('aria-pressed', String(f.dataset.familia === id));
      if (primero) pintaModelo(primero.dataset.modelo!);
    }

    for (const f of familias) f.addEventListener('click', () => abreFamilia(f.dataset.familia!));
    for (const b of modelos) b.addEventListener('click', () => pintaModelo(b.dataset.modelo!));
  }
}
