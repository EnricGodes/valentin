import { punteroFino, sinMovimiento } from './motion.ts';

/** Punto que sigue al raton al instante y anillo con inercia. */
export function iniciarCursor(): void {
  if (!punteroFino() || sinMovimiento()) return;

  const punto = document.getElementById('cursor');
  const anillo = document.getElementById('cursor-ring');
  if (!punto || !anillo) return;

  document.body.classList.add('cursor-propio');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    punto.style.left = `${mx}px`;
    punto.style.top = `${my}px`;
  }, { passive: true });

  (function seguir() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    anillo.style.left = `${rx}px`;
    anillo.style.top = `${ry}px`;
    requestAnimationFrame(seguir);
  })();

  // El estado de hover se marca con clases, no escribiendo estilos a mano,
  // para que el CSS siga siendo el unico dueno de la apariencia.
  const activables = 'a, button, .gallery-slide, .closeup-item, .interior-item, .kit-category, .jordi-photo-wrap';
  document.querySelectorAll(activables).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      punto.classList.add('activo');
      anillo.classList.add('activo');
    });
    el.addEventListener('mouseleave', () => {
      punto.classList.remove('activo');
      anillo.classList.remove('activo');
    });
  });
}
