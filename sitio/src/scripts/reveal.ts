import { observarUnaVez, sinMovimiento } from './motion.ts';

/**
 * Entradas por scroll: .reveal, sus variantes y la linea shimmer de bronce.
 * El hero no usa observer porque ya esta en pantalla al cargar: entra por
 * temporizador escalonado.
 */
export function iniciarReveals(): void {
  const marcar = (el: Element) => el.classList.add('visible');

  if (sinMovimiento()) {
    document
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .shimmer-line, .kit-items li')
      .forEach(marcar);
    return;
  }

  observarUnaVez(
    document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .shimmer-line',
    ),
    marcar,
  );

  // Hero: visible de entrada, escalonado en el tiempo
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    window.setTimeout(() => marcar(el), 400 + i * 180);
  });

  // Listas del kit: cascada dentro de cada categoria al entrar
  observarUnaVez(
    document.querySelectorAll('.kit-category'),
    (cat) => {
      cat.querySelectorAll('.kit-items li').forEach((li, i) => {
        window.setTimeout(() => marcar(li), 100 + i * 80);
      });
    },
    0.2,
  );
}
