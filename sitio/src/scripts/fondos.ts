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
  /* Los fondos de cierre quedan al final de la pagina: la foto se pide al
     acercarse, no al entrar, para no quitarle red a la del hero. */
  const cargar = (el: HTMLElement) => {
    const src = el.dataset.fondo;
    if (!src) return;
    if (!el.classList.contains('hero-bg')) el.style.backgroundImage = `url('${src}')`;
    const img = new Image();
    img.src = src;
    if (img.complete) el.classList.add('loaded');
    else img.addEventListener('load', () => el.classList.add('loaded'), { once: true });
  };
  const cerca = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      cerca.unobserve(e.target);
      cargar(e.target as HTMLElement);
    }
  }, { rootMargin: '600px 0px' });
  for (const el of document.querySelectorAll<HTMLElement>('[data-fondo]')) {
    if (el.classList.contains('hero-bg')) cargar(el);
    else cerca.observe(el);
  }

  /* Video del hero: se revela cuando hay fotograma que ensenar, no antes, para
     que no se vea el rectangulo negro sobre la imagen. Con movimiento reducido
     no se reproduce y se queda la foto. */
  for (const v of document.querySelectorAll<HTMLVideoElement>('video.hero-video')) {
    if (sinMovimiento()) continue;
    /* El src llega despues del load: hasta entonces la red es para la imagen
       del hero, que es lo que mide Google (LCP). En movil, la version ligera. */
    const arrancar = () => {
      const movil = v.dataset.srcMovil && matchMedia('(max-width: 900px)').matches;
      v.src = (movil ? v.dataset.srcMovil : v.dataset.src) ?? '';
      v.addEventListener('loadeddata', () => v.classList.add('loaded'), { once: true });
      /* Safari en iOS con ahorro de energia ignora el autoplay del atributo. */
      v.play().catch(() => {});
    };
    if (document.readyState === 'complete') arrancar();
    else window.addEventListener('load', arrancar, { once: true });
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
