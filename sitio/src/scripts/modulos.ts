/**
 * Comportamiento de los modulos del Magazine: pase, carrusel y lightbox.
 *
 * Un solo script para toda la pagina y un solo lightbox reutilizado, en vez
 * de una isla por galeria: hay posts con doce galerias y 63 fotos, y montar
 * doce componentes ahi seria pagar JavaScript por algo que resuelven el
 * scroll nativo con anclaje y un dialogo.
 */

const foco = { anterior: null as HTMLElement | null };

function navegacion(galeria: HTMLElement) {
  const pista = galeria.querySelector<HTMLElement>('.mod-pista');
  const antes = galeria.querySelector<HTMLButtonElement>('.mod-nav--antes');
  const luego = galeria.querySelector<HTMLButtonElement>('.mod-nav--luego');
  const cuenta = galeria.querySelector<HTMLElement>('.mod-contador span');
  if (!pista || !antes || !luego) return;

  const paso = () => pista.querySelector<HTMLElement>('.mod-foto')?.offsetWidth ?? pista.clientWidth;

  const refrescar = () => {
    const max = pista.scrollWidth - pista.clientWidth - 2;
    antes.disabled = pista.scrollLeft <= 2;
    luego.disabled = pista.scrollLeft >= max;
    if (cuenta) {
      const total = Number(galeria.dataset.total) || 1;
      const i = Math.round(pista.scrollLeft / (paso() + 10)) + 1;
      cuenta.textContent = String(Math.min(Math.max(i, 1), total));
    }
  };

  antes.addEventListener('click', () => pista.scrollBy({ left: -(paso() + 10) }));
  luego.addEventListener('click', () => pista.scrollBy({ left: paso() + 10 }));
  pista.addEventListener('scroll', refrescar, { passive: true });
  refrescar();
}

function lightbox() {
  const galerias = [...document.querySelectorAll<HTMLElement>('.mod-galeria[data-lightbox]')];
  if (!galerias.length) return;

  const lupa = document.createElement('div');
  lupa.className = 'mod-lupa';
  lupa.setAttribute('role', 'dialog');
  lupa.setAttribute('aria-modal', 'true');
  lupa.setAttribute('aria-label', 'Fotografía ampliada');
  lupa.innerHTML = `
    <button class="mod-nav mod-lupa-cerrar" type="button" aria-label="Cerrar"></button>
    <button class="mod-nav mod-nav--antes" type="button" aria-label="Anterior"></button>
    <img alt="">
    <button class="mod-nav mod-nav--luego" type="button" aria-label="Siguiente"></button>
    <p class="mod-lupa-pie"></p>`;
  document.body.append(lupa);

  const img = lupa.querySelector('img')!;
  const pie = lupa.querySelector<HTMLElement>('.mod-lupa-pie')!;
  const cerrar = lupa.querySelector<HTMLButtonElement>('.mod-lupa-cerrar')!;
  const antes = lupa.querySelector<HTMLButtonElement>('.mod-nav--antes')!;
  const luego = lupa.querySelector<HTMLButtonElement>('.mod-nav--luego')!;

  let fotos: HTMLImageElement[] = [];
  let i = 0;

  const pintar = () => {
    const f = fotos[i];
    img.src = f.src;
    img.alt = f.alt;
    pie.textContent = f.closest('.mod-foto')?.querySelector('figcaption')?.textContent
      ?? `${i + 1} / ${fotos.length}`;
    antes.disabled = i === 0;
    luego.disabled = i === fotos.length - 1;
  };

  const abrir = (galeria: HTMLElement, indice: number) => {
    fotos = [...galeria.querySelectorAll<HTMLImageElement>('.mod-foto img')];
    i = indice;
    foco.anterior = document.activeElement as HTMLElement;
    lupa.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    pintar();
    // El dialogo tarda un fotograma en dejar de ser `visibility: hidden`, y
    // un elemento invisible no acepta el foco: sin esta espera el foco se
    // queda en el body y quien navega con teclado se queda fuera del
    // lightbox, con el resto de la pagina detras.
    requestAnimationFrame(() => cerrar.focus());
  };

  const salir = () => {
    lupa.removeAttribute('open');
    document.body.style.overflow = '';
    // Devolver el foco a la foto de la que se salio. Sin esto se queda en el
    // boton de cerrar, que ya esta oculto, y quien navega con teclado
    // reaparece al principio del documento.
    (foco.anterior ?? fotos[i])?.focus();
  };

  const mover = (paso: number) => {
    i = Math.min(Math.max(i + paso, 0), fotos.length - 1);
    pintar();
  };

  for (const g of galerias) {
    const desde = (e: Event) => {
      const objetivo = (e.target as HTMLElement).closest<HTMLImageElement>('.mod-foto img');
      if (!objetivo) return;
      const todas = [...g.querySelectorAll<HTMLImageElement>('.mod-foto img')];
      abrir(g, todas.indexOf(objetivo));
    };

    g.addEventListener('click', desde);

    // Las fotos llevan tabindex y role="button": sin esto se anuncian como
    // pulsables y luego no responden al teclado, que es peor que no
    // anunciarlas. Espacio ademas hace scroll si no se frena.
    g.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (!(e.target as HTMLElement).closest('.mod-foto img')) return;
      e.preventDefault();
      desde(e);
    });
  }

  cerrar.addEventListener('click', salir);
  antes.addEventListener('click', () => mover(-1));
  luego.addEventListener('click', () => mover(1));
  lupa.addEventListener('click', (e) => { if (e.target === lupa) salir(); });

  document.addEventListener('keydown', (e) => {
    if (!lupa.hasAttribute('open')) return;
    if (e.key === 'Escape') salir();
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
    // Encierra el foco dentro del dialogo mientras esta abierto.
    if (e.key === 'Tab') {
      const focales = [cerrar, antes, luego].filter((b) => !b.disabled);
      const pos = focales.indexOf(document.activeElement as HTMLButtonElement);
      e.preventDefault();
      focales[(pos + (e.shiftKey ? -1 : 1) + focales.length) % focales.length]?.focus();
    }
  });
}

export function iniciarModulos(): void {
  document.querySelectorAll<HTMLElement>('.mod-galeria--pase, .mod-galeria--carrusel')
    .forEach(navegacion);
  lightbox();
}
