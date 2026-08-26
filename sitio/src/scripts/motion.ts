/**
 * Utilidades compartidas de movimiento.
 *
 * Todo el JS de comportamiento del sitio pasa por aqui para respetar una sola
 * regla: si el usuario pide movimiento reducido, no se anima. Ninguna de las
 * seis fichas actuales lo comprueba.
 */

export const sinMovimiento = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const punteroFino = (): boolean =>
  window.matchMedia('(pointer: fine)').matches;

/** Observa una vez y deja de observar: los reveals no se repiten al volver. */
export function observarUnaVez(
  elementos: Iterable<Element>,
  alEntrar: (el: Element) => void,
  threshold = 0.1,
): void {
  const els = [...elementos];
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(alEntrar);
    return;
  }
  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      alEntrar(e.target);
      obs.unobserve(e.target);
    }
  }, { threshold });
  els.forEach((el) => obs.observe(el));
}

/** Agrupa escrituras de estilo en un rAF: un solo repintado por frame. */
export function enFrame(fn: (t: number) => void): () => void {
  let pedido = false;
  return () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame((t) => {
      pedido = false;
      fn(t);
    });
  };
}
