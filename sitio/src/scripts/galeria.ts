import { sinMovimiento } from './motion.ts';

const INTERVALO = 5000;
const SWIPE_MIN = 50;

/**
 * Galeria de crossfade con autoplay, swipe tactil y barra de progreso.
 *
 * Respecto a las fichas actuales: se puede montar mas de una por pagina (antes
 * los ids eran unicos y globales), no se autoreproduce si el usuario pide
 * movimiento reducido, y los controles anuncian su estado a un lector de
 * pantalla.
 */
export function iniciarGalerias(): void {
  document.querySelectorAll<HTMLElement>('[data-galeria]').forEach(montar);
}

function montar(raiz: HTMLElement): void {
  const slides = [...raiz.querySelectorAll<HTMLElement>('.gallery-slide')];
  const puntos = [...raiz.querySelectorAll<HTMLElement>('.gallery-dot')];
  const escenario = raiz.querySelector<HTMLElement>('.gallery-stage');
  const contador = raiz.querySelector<HTMLElement>('.gallery-counter');
  const barra = raiz.querySelector<HTMLElement>('.gallery-progress-bar');
  const total = slides.length;
  if (!escenario || total === 0) return;

  const estatica = sinMovimiento();
  let actual = 0;
  let temporizador: number | null = null;

  const dosCifras = (n: number) => String(n).padStart(2, '0');

  function ir(indice: number): void {
    slides[actual]?.classList.remove('active');
    puntos[actual]?.classList.remove('active');
    puntos[actual]?.setAttribute('aria-selected', 'false');

    actual = (indice + total) % total;

    slides[actual]?.classList.add('active');
    puntos[actual]?.classList.add('active');
    puntos[actual]?.setAttribute('aria-selected', 'true');
    if (contador) contador.textContent = `${dosCifras(actual + 1)} / ${dosCifras(total)}`;
    // Solo la visible es alcanzable con el tabulador
    slides.forEach((s, i) => s.toggleAttribute('inert', i !== actual));
    arrancarProgreso();
  }

  function arrancarProgreso(): void {
    if (!barra || estatica) return;
    barra.style.transition = 'none';
    barra.style.width = '0%';
    // Doble rAF: fuerza el reflow antes de reanimar el ancho
    requestAnimationFrame(() => requestAnimationFrame(() => {
      barra.style.transition = `width ${INTERVALO}ms linear`;
      barra.style.width = '100%';
    }));
  }

  function arrancar(): void {
    if (estatica) return;
    parar();
    temporizador = window.setInterval(() => ir(actual + 1), INTERVALO);
  }

  function parar(): void {
    if (temporizador !== null) window.clearInterval(temporizador);
    temporizador = null;
    if (barra) {
      barra.style.transition = 'none';
      barra.style.width = '0%';
    }
  }

  const saltar = (destino: number) => { parar(); ir(destino); arrancar(); };

  raiz.querySelector('[data-galeria-prev]')?.addEventListener('click', () => saltar(actual - 1));
  raiz.querySelector('[data-galeria-next]')?.addEventListener('click', () => saltar(actual + 1));
  puntos.forEach((p, i) => p.addEventListener('click', () => saltar(i)));

  // Con el teclado, flechas izquierda y derecha
  raiz.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); saltar(actual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); saltar(actual + 1); }
  });

  escenario.addEventListener('mouseenter', parar);
  escenario.addEventListener('mouseleave', arrancar);
  // Si el usuario esta navegando con el teclado dentro, no se mueve sola
  raiz.addEventListener('focusin', parar);
  raiz.addEventListener('focusout', (e) => {
    if (!raiz.contains(e.relatedTarget as Node)) arrancar();
  });
  // Ni cuando la pestana esta en segundo plano
  document.addEventListener('visibilitychange', () => {
    document.hidden ? parar() : arrancar();
  });

  let inicioX = 0;
  escenario.addEventListener('touchstart', (e) => {
    inicioX = e.touches[0]!.clientX;
  }, { passive: true });
  escenario.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0]!.clientX - inicioX;
    if (Math.abs(dx) > SWIPE_MIN) saltar(actual + (dx < 0 ? 1 : -1));
  }, { passive: true });

  ir(0);
  arrancar();
}
