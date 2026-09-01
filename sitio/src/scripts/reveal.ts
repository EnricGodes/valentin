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
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-foto, .shimmer-line, .kit-items li')
      .forEach(marcar);
    return;
  }

  observarUnaVez(
    document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-foto, .shimmer-line',
    ),
    marcar,
  );

  /* La portada del articulo ya esta en pantalla al cargar: si esperase al
     observador, la foto entraria despues del primer scroll y se veria el
     salto. Entra sola, como el hero de las fichas. */
  document.querySelectorAll('.post-portada').forEach((el) => {
    window.setTimeout(() => marcar(el), 80);
  });

  // Hero y portada: visibles de entrada, escalonados en el tiempo
  document.querySelectorAll('.hero .reveal, .post-portada .reveal').forEach((el, i) => {
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
