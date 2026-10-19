import { observarUnaVez, sinMovimiento } from './motion.ts';

const DURACION = 1600;

/**
 * Contadores que suben hasta su cifra al entrar en pantalla.
 * Los numeros se formatean con la localizacion de la pagina: 122000 se lee
 * "122.000" en espanol y "122,000" en ingles. Las fichas actuales los
 * escupian sin separador.
 */
export function iniciarContadores(): void {
  const idioma = document.documentElement.lang || 'es';
  const formato = new Intl.NumberFormat(idioma);
  /* En espanol los numeros de cuatro cifras van sin punto (3820). Para cifras
     que no son anos, data-agrupar fuerza el separador: 3.820. */
  const agrupado = new Intl.NumberFormat(idioma, { useGrouping: 'always' } as Intl.NumberFormatOptions);

  observarUnaVez(document.querySelectorAll<HTMLElement>('.count-up'), (nodo) => {
    const el = nodo as HTMLElement;
    const destino = Number(el.dataset.target);
    if (!Number.isFinite(destino)) return;
    const fmt = el.dataset.agrupar !== undefined ? agrupado : formato;

    if (sinMovimiento()) {
      el.textContent = fmt.format(destino);
      return;
    }

    const inicio = performance.now();
    (function paso(ahora: number) {
      const p = Math.min((ahora - inicio) / DURACION, 1);
      const suave = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(suave * destino));
      if (p < 1) requestAnimationFrame(paso);
    })(inicio);
  }, 0.5);
}
