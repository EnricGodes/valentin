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

  observarUnaVez(document.querySelectorAll<HTMLElement>('.count-up'), (nodo) => {
    const el = nodo as HTMLElement;
    const destino = Number(el.dataset.target);
    if (!Number.isFinite(destino)) return;

    if (sinMovimiento()) {
      el.textContent = formato.format(destino);
      return;
    }

    const inicio = performance.now();
    (function paso(ahora: number) {
      const p = Math.min((ahora - inicio) / DURACION, 1);
      const suave = 1 - Math.pow(1 - p, 3);
      el.textContent = formato.format(Math.round(suave * destino));
      if (p < 1) requestAnimationFrame(paso);
    })(inicio);
  }, 0.5);
}
