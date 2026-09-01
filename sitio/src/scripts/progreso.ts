import { sinMovimiento } from './motion.ts';

/**
 * Barra de progreso de lectura del articulo.
 *
 * Un post de restauracion puede tener sesenta fotos y quince pantallas de
 * scroll. Sin una referencia no se sabe si queda un minuto o diez, y eso se
 * nota en cuanta gente llega al final.
 *
 * Se mide sobre el articulo, no sobre el documento: el pie y el nav no son
 * lectura y contarlos daria una barra que nunca llega al final.
 */
export function iniciarProgreso(): void {
  const barra = document.querySelector<HTMLElement>('[data-progreso]');
  const articulo = barra?.closest('article');
  if (!barra || !articulo || sinMovimiento()) return;

  let pendiente = false;

  const pintar = () => {
    pendiente = false;
    const alto = articulo.offsetHeight - window.innerHeight;
    if (alto <= 0) return;
    const hecho = (window.scrollY - articulo.offsetTop) / alto;
    barra.style.transform = `scaleX(${Math.min(Math.max(hecho, 0), 1)})`;
  };

  const alScroll = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(pintar);
  };

  window.addEventListener('scroll', alScroll, { passive: true });
  window.addEventListener('resize', alScroll, { passive: true });
  pintar();
}
