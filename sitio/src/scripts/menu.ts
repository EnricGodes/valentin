/**
 * Lo que el menú de hamburguesa necesita y `<details>` no trae.
 *
 * El interruptor es HTML nativo a propósito: sin JavaScript el menú se abre
 * igual y se recorre con teclado. Aquí solo se añade lo que falta para que se
 * comporte como un menú y no como un desplegable:
 *
 *   - Escape lo cierra, que es lo que espera cualquiera.
 *   - Navegar lo cierra, o al volver atrás el panel sigue abierto encima.
 *   - La página no se desplaza por detrás del panel mientras está abierto.
 *   - Cada sección con hijos se pliega y trae su propio botón para abrirla.
 *     Sin esto el panel mide nueve secciones más treinta enlaces de una vez.
 */
export function iniciarMenu(): void {
  const menu = document.querySelector<HTMLDetailsElement>('[data-nav-menu]');
  if (!menu) return;

  /* Marca que hay JavaScript: la hoja de estilos usa `.js` para plegar los
     submenús, de forma que sin script se queden todos a la vista. */
  document.documentElement.classList.add('js');

  const estrecha = () => window.matchMedia('(max-width: 1180px)').matches;

  /* El menú viene abierto del servidor para que exista sin JavaScript. Lo
     primero que se hace aquí es cerrarlo si la pantalla es estrecha, antes de
     que se llegue a ver desplegado. */
  const ajustarApertura = () => { menu.open = !estrecha(); };
  ajustarApertura();
  window.addEventListener('resize', ajustarApertura);

  // ── Plegar los submenús y darles su botón ────────────────────────────────
  for (const item of menu.querySelectorAll<HTMLElement>('.nav-item--con-hijos')) {
    const sub = item.querySelector<HTMLElement>('.nav-sub');
    const enlace = item.querySelector('a');
    if (!sub || !enlace) continue;

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'nav-desplegar';
    boton.setAttribute('aria-expanded', 'false');
    /* El nombre de la sección va en el aria-label: "Desplegar" a secas no
       dice nada cuando hay cinco botones iguales seguidos. */
    boton.setAttribute('aria-label', enlace.textContent?.trim() ?? '');
    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      sub.hidden = abierto;
    });
    item.append(boton);

    /* El estado inicial depende del ancho, y se recalcula al girar el móvil:
       en pantalla ancha el submenú lo gobierna el hover, no este botón. */
    const ajustar = () => { sub.hidden = estrecha(); };
    ajustar();
    window.addEventListener('resize', ajustar);
  }

  // ── Cerrar ───────────────────────────────────────────────────────────────
  const cerrar = () => { menu.open = false; };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) {
      cerrar();
      menu.querySelector<HTMLElement>('summary')?.focus();
    }
  });

  // Un clic en cualquier enlace del panel cierra: se está navegando.
  menu.addEventListener('click', (e) => {
    if ((e.target as Element)?.closest?.('a')) cerrar();
  });

  /* Con el panel abierto, la página de detrás no debe desplazarse. Se marca
     en el <html> y lo aplica la hoja de estilos. */
  menu.addEventListener('toggle', () => {
    document.body.classList.toggle('sin-scroll', menu.open && estrecha());
  });
}
