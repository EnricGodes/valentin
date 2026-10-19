/**
 * PA10/01: animaciones de la pagina /builds/pa10-01.
 *
 * Revelado al hacer scroll, barra de lectura, paralaje del hero y la secuencia
 * de detalles de "El oficio" (imagen fija que cambia con el texto en escritorio;
 * en movil se lee en vertical). Viene del paquete original sin su menu propio.
 * Solo actua si la pagina tiene .p10; el resto del sitio no lo ejecuta.
 */
const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(selector)];

function iniciarPa10(): void {
  const raiz = $('.p10');
  const hero = $('.p10-hero');
  const heroImg = $<HTMLImageElement>('.p10-hero-media img');
  const carImg = $<HTMLImageElement>('.p10-hero-car img');
  const progreso = $('.p10-reading-progress');
  const historia = $('[data-detail-story]');
  if (!raiz || !hero || !heroImg || !carImg || !progreso || !historia) return;

  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  if ('IntersectionObserver' in window && !reducido.matches) {
    raiz.classList.add('p10-motion-ready');
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('p10-is-visible'); observador.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    $$('.p10-reveal').forEach((el) => observador.observe(el));
  }

  const frames = $$('.p10-story-frame', historia);
  const pasos = $$('.p10-story-step', historia);
  const puntos = $$('.p10-story-progress span', historia);
  const escritorio = window.matchMedia('(min-width: 761px)');
  let activo = -1;

  function fijarPaso(i: number): void {
    if (i === activo) return;
    activo = i;
    frames.forEach((f, k) => {
      f.classList.toggle('p10-is-active', k === i);
      f.inert = escritorio.matches && k !== i;
    });
    puntos.forEach((p, k) => p.classList.toggle('p10-is-active', k === i));
  }

  function actualizarHistoria(): void {
    if (!escritorio.matches) return;
    const centro = window.innerHeight * 0.55;
    let mejor = 0;
    let distancia = Infinity;
    pasos.forEach((paso, i) => {
      const r = paso.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - centro);
      if (d < distancia) { mejor = i; distancia = d; }
    });
    fijarPaso(mejor);
  }

  function prepararHistoria(): void {
    historia!.classList.toggle('p10-story-enhanced', escritorio.matches);
    activo = -1;
    if (!escritorio.matches) frames.forEach((f) => { f.inert = false; });
    else actualizarHistoria();
  }

  let pendiente = false;
  function alScroll(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progreso!.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    // Titulo: de 0 a 1 mientras el hero esta fijo (ver .p10-hero-pin); llega a 1 antes de soltarse.
    const pin = hero!.parentElement!;
    const recorrido = pin.offsetHeight - hero!.offsetHeight;
    const t = recorrido > 0
      ? Math.max(0, Math.min(1, (parseFloat(getComputedStyle(raiz!).getPropertyValue('--header')) - pin.getBoundingClientRect().top) / (recorrido * 0.8)))
      : 1;
    raiz!.style.setProperty('--p10-t', String(t));
    // Fondo y recorte del coche llevan la misma transformacion: si no, el coche se despega.
    const paralaje = !reducido.matches && y < hero!.offsetHeight + 100 && window.innerWidth > 760
      ? `translateY(${Math.min(y * 0.08, 30)}px) scale(1.1)` : '';
    heroImg!.style.transform = paralaje;
    carImg!.style.transform = paralaje;
    actualizarHistoria();
    pendiente = false;
  }
  const encolar = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); } };

  window.addEventListener('scroll', encolar, { passive: true });
  window.addEventListener('resize', encolar, { passive: true });
  window.addEventListener('load', encolar);
  escritorio.addEventListener('change', prepararHistoria);
  reducido.addEventListener('change', () => {
    if (reducido.matches) {
      raiz.classList.remove('p10-motion-ready');
      heroImg.style.transform = '';
      carImg.style.transform = '';
    }
  });

  prepararHistoria();
  encolar();
}

iniciarPa10();
