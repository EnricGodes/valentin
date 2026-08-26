import { punteroFino, sinMovimiento } from './motion.ts';

/** Botones que se desplazan levemente hacia el cursor. */
export function iniciarMagneticos(): void {
  if (!punteroFino() || sinMovimiento()) return;

  document.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((btn) => {
    const fuerza = Number(btn.dataset.magnetico) || 0.35;
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * fuerza;
      const dy = (e.clientY - (r.top + r.height / 2)) * fuerza;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}
