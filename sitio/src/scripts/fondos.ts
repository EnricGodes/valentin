import { enFrame, sinMovimiento } from './motion.ts';

/**
 * Fondos de hero y cierre: Ken Burns al cargar la imagen y parallax al hacer
 * scroll.
 *
 * En las fichas actuales el parallax escribe `transform: translateY(...)`
 * directamente sobre el mismo elemento que tiene el `scale()` del Ken Burns, y
 * lo pisa: el zoom lento deja de verse en cuanto el usuario hace scroll.
 * Aqui el desplazamiento va en una custom property y el CSS compone las dos
 * transformaciones, asi que conviven.
 */
export function iniciarFondos(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-fondo]')) {
    const src = el.dataset.fondo;
    if (!src) continue;
    const img = new Image();
    img.src = src;
    if (img.complete) el.classList.add('loaded');
    else img.addEventListener('load', () => el.classList.add('loaded'), { once: true });
  }

  /* Video del hero: se revela cuando hay fotograma que ensenar, no antes, para
     que no se vea el rectangulo negro sobre la imagen. Con movimiento reducido
     no se reproduce y se queda la foto. */
  for (const v of document.querySelectorAll<HTMLVideoElement>('video.hero-video')) {
    if (sinMovimiento()) { v.removeAttribute('autoplay'); v.pause(); continue; }
    const mostrar = () => v.classList.add('loaded');
    if (v.readyState >= 2) mostrar();
    else v.addEventListener('loadeddata', mostrar, { once: true });
    /* Safari en iOS con ahorro de energia ignora el autoplay del atributo. */
    v.play().catch(() => {});
  }

  if (sinMovimiento()) return;

  const hero = document.querySelector<HTMLElement>('.hero-parallax[data-parallax]');
  if (!hero) return;

  const factor = Number(hero.dataset.parallax) || 0.28;
  const actualizar = enFrame(() => {
    hero.style.setProperty('--desplazamiento', `${window.scrollY * factor}px`);
  });
  window.addEventListener('scroll', actualizar, { passive: true });
  actualizar();
}
