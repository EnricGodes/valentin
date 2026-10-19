import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { punteroFino, sinMovimiento } from './motion.ts';

/**
 * Movimiento de la home. Todo parte de un estado final ya maquetado en el CSS:
 * aqui solo se anaden entradas (gsap.from), pins y scrubs. Si el usuario pide
 * movimiento reducido no se registra ninguna animacion y la pagina queda tal
 * cual, con los videos parados en su poster.
 *
 * El sitio no usa View Transitions: cada pagina carga de cero y este script
 * se ejecuta una sola vez, asi que no hace falta deshacer nada al salir.
 */
gsap.registerPlugin(ScrollTrigger, SplitText);
// Solo en desarrollo: para revisar las animaciones desde la consola
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });

const $ = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document) =>
  raiz.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document) =>
  [...raiz.querySelectorAll<T>(sel)];

const ESCRITORIO = '(min-width: 961px)';

function hero(): void {
  const seccion = $('.hero--home');
  if (!seccion) return;
  const titulo = $('.hero-title', seccion);
  const claim = $('.hero-claim', seccion);
  const capa = $('.hero-parallax', seccion);
  const contenido = $('.hero-content', seccion);

  if (titulo) {
    gsap.set([titulo, claim], { opacity: 1, animation: 'none' });
    const lineas = SplitText.create(titulo, { type: 'lines', mask: 'lines', linesClass: 'linea' });
    gsap.from(lineas.lines, {
      yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.14, delay: 0.25,
    });
    if (claim) gsap.from(claim, { opacity: 0, y: 24, duration: 1.2, ease: 'expo.out', delay: 0.75 });
  }

  /* Al bajar, el video se recoge en un marco con esquinas y el texto sube y se
     apaga: el hero cede el paso en vez de cortarse. */
  if (capa) {
    gsap.to(capa, {
      clipPath: 'inset(7% 5% 7% 5% round 28px)', ease: 'none',
      scrollTrigger: { trigger: seccion, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
  if (contenido) {
    gsap.to(contenido, {
      y: -120, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: seccion, start: 'top top', end: '60% top', scrub: true },
    });
  }
}

/** Las palabras del manifiesto se encienden a medida que se lee. */
function manifiesto(): void {
  for (const p of $$('[data-palabras]')) {
    const partes = SplitText.create(p, { type: 'words', wordsClass: 'palabra' });
    gsap.fromTo(partes.words, { opacity: 0.14 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 48%', scrub: true },
    });
  }
}

/** Entrada escalonada generica para bloques marcados con data-entra. */
function entradas(): void {
  ScrollTrigger.batch($$('[data-entra]'), {
    start: 'top 88%', once: true,
    onEnter: (lote) => gsap.from(lote, {
      y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12,
    }),
  });
}

/** Marquesina infinita que acelera y cambia de sentido con el scroll. */
function marquesina(): void {
  const pista = $('.marquesina-pista');
  if (!pista) return;
  const bucle = gsap.to(pista, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
  let sentido = 1;
  ScrollTrigger.create({
    trigger: pista, start: 'top bottom', end: 'bottom top',
    onUpdate: (st) => {
      sentido = st.direction;
      const empuje = gsap.utils.clamp(1, 6, Math.abs(st.getVelocity()) / 300);
      gsap.to(bucle, { timeScale: empuje * sentido, duration: 0.2, overwrite: true });
      gsap.to(bucle, { timeScale: sentido, duration: 1.4, delay: 0.2, ease: 'power2.out' });
    },
  });
}

/** Servicios: pin y recorrido horizontal en escritorio; cortinas en movil. */
function servicios(mm: gsap.MatchMedia): void {
  const seccion = $('.servicios-h');
  const pista = $('.servicios-h-pista');
  if (!seccion || !pista) return;
  const tarjetas = $$('.srv', pista);

  mm.add(ESCRITORIO, () => {
    const distancia = () => Math.max(0, pista.scrollWidth - window.innerWidth);
    const recorrido = gsap.to(pista, {
      x: () => -distancia(), ease: 'none',
      scrollTrigger: {
        trigger: seccion, start: 'top top', end: () => `+=${distancia()}`,
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    for (const t of tarjetas) {
      const img = $('img', t);
      if (img) {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: t, containerAnimation: recorrido, start: 'left right', end: 'right left', scrub: true },
        });
      }
      gsap.from($$('.srv-num, .srv-titulo, .srv-texto, .enlace-mono', t), {
        y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: t, containerAnimation: recorrido, start: 'left 75%' },
      });
    }
  });

  mm.add('(max-width: 960px)', () => {
    for (const t of tarjetas) {
      const foto = $('.srv-foto', t);
      if (!foto) continue;
      gsap.from(foto, {
        clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut',
        scrollTrigger: { trigger: t, start: 'top 85%' },
      });
      gsap.from($('img', foto), {
        scale: 1.3, duration: 1.6, ease: 'expo.out',
        scrollTrigger: { trigger: t, start: 'top 85%' },
      });
    }
  });
}

/** Coches: entrada en cascada con giro leve y tilt al pasar el cursor. */
function coches(): void {
  const tarjetas = $$('.cars-grid--home .car-card');
  if (!tarjetas.length) return;
  gsap.from(tarjetas, {
    y: 90, opacity: 0, rotateX: -12, transformOrigin: '50% 100%',
    duration: 1.2, ease: 'expo.out', stagger: 0.12,
    scrollTrigger: { trigger: '.cars-grid--home', start: 'top 85%' },
  });

  if (!punteroFino()) return;
  for (const t of tarjetas) {
    gsap.set(t, { transformPerspective: 900 });
    const rx = gsap.quickTo(t, 'rotateX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(t, 'rotateY', { duration: 0.5, ease: 'power3.out' });
    t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    t.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }
}

function opiniones(): void {
  const tarjetas = $$('.opinion');
  if (!tarjetas.length) return;
  gsap.from(tarjetas, {
    x: 120, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.opiniones-pista', start: 'top 85%' },
  });
  gsap.from($$('.opinion .estrellas svg'), {
    scale: 0, rotate: -90, duration: 0.6, ease: 'back.out(3)', stagger: 0.03,
    scrollTrigger: { trigger: '.opiniones-pista', start: 'top 80%' },
  });
}

/** Fotos de los centros: cortina lateral y zoom que se asienta. */
function cortinas(): void {
  for (const foto of $$('[data-cortina]')) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: foto, start: 'top 85%' } });
    tl.from(foto, { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
      .from($('img', foto), { scale: 1.35, duration: 1.8, ease: 'expo.out' }, 0.2);
  }
}

/** Reels: entran en abanico y flotan a distinta velocidad con el scroll. */
function reels(mm: gsap.MatchMedia): void {
  const tarjetas = $$('.reel');
  if (!tarjetas.length) return;
  gsap.from(tarjetas, {
    y: 160, opacity: 0, rotate: (i) => [-6, 0, 6][i % 3], duration: 1.3,
    ease: 'expo.out', stagger: 0.12,
    scrollTrigger: { trigger: '.reels', start: 'top 85%' },
  });
  mm.add(ESCRITORIO, () => {
    tarjetas.forEach((t, i) => {
      gsap.to(t, {
        y: [-40, 30, -70][i % 3], ease: 'none',
        scrollTrigger: { trigger: '.reels', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
}

/** Generaciones: el fondo pasa de negro a papel y los coches entran rodando. */
function modelos(): void {
  const seccion = $('.modelos');
  if (!seccion) return;
  gsap.from(seccion, {
    backgroundColor: '#0B0B0B', ease: 'none',
    scrollTrigger: { trigger: seccion, start: 'top 90%', end: 'top 35%', scrub: true },
  });
  const modelos = $$('.modelo', seccion);
  gsap.from(modelos.map((m) => $('.modelo-foto', m)).filter(Boolean), {
    xPercent: 60, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.modelos-pista', start: 'top 80%' },
  });
  gsap.from(modelos.flatMap((m) => $$('.modelo-num, .modelo-nombre, .modelo-texto, .modelo-enlace', m)), {
    y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.025, delay: 0.3,
    scrollTrigger: { trigger: '.modelos-pista', start: 'top 80%' },
  });
}

function cita(): void {
  const titulo = $('[data-titular]');
  if (!titulo) return;
  const partes = SplitText.create(titulo, { type: 'words', mask: 'words', wordsClass: 'palabra' });
  gsap.from(partes.words, {
    yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06,
    scrollTrigger: { trigger: titulo, start: 'top 85%' },
  });
  gsap.from($$('.cita .cita-texto, .cita .cita-acciones, .cita .cita-telefonos'), {
    y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.4,
    scrollTrigger: { trigger: titulo, start: 'top 85%' },
  });
}

/* ── Comportamiento que no es animacion: funciona tambien sin movimiento ── */

/** Pistas horizontales arrastrables con el raton (el tactil ya es nativo). */
function arrastrables(): void {
  for (const pista of $$('[data-arrastrable], [data-carrusel-pista]')) {
    let x0 = 0;
    let scroll0 = 0;
    let movido = false;
    pista.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      x0 = e.clientX; scroll0 = pista.scrollLeft; movido = false;
      const mover = (ev: PointerEvent) => {
        const dx = ev.clientX - x0;
        if (Math.abs(dx) > 4) { movido = true; pista.classList.add('arrastrando'); }
        pista.scrollLeft = scroll0 - dx;
      };
      const soltar = () => {
        pista.classList.remove('arrastrando');
        window.removeEventListener('pointermove', mover);
      };
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerup', soltar, { once: true });
    });
    // Un arrastre no es un clic: no abre el enlace de la tarjeta
    pista.addEventListener('click', (e) => { if (movido) e.preventDefault(); }, true);
  }
}

/** Carrusel de opiniones: botones, teclado y avance solo que se pausa. */
function carrusel(): void {
  const pista = $('[data-carrusel-pista]');
  if (!pista) return;
  const paso = () => ($('.opinion', pista)?.getBoundingClientRect().width ?? 400) + 2;
  const ir = (sentido: number) => {
    const fin = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 8;
    if (sentido > 0 && fin) pista.scrollTo({ left: 0, behavior: 'smooth' });
    else pista.scrollBy({ left: paso() * sentido, behavior: 'smooth' });
  };
  $$('[data-carrusel]').forEach((b) =>
    b.addEventListener('click', () => ir(b.dataset.carrusel === 'anterior' ? -1 : 1)));
  pista.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); }
  });

  if (sinMovimiento()) return;
  let pausado = false;
  const pausar = () => { pausado = true; };
  const seguir = () => { pausado = false; };
  pista.addEventListener('pointerenter', pausar);
  pista.addEventListener('pointerleave', seguir);
  pista.addEventListener('focusin', pausar);
  pista.addEventListener('focusout', seguir);
  pista.addEventListener('touchstart', pausar, { passive: true });
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(pista);
  window.setInterval(() => { if (visible && !pausado && !document.hidden) ir(1); }, 5500);
}

/** Los reels solo descargan y reproducen cuando estan en pantalla. */
function videosReels(): void {
  const videos = $$<HTMLVideoElement>('.reel-video');
  if (!videos.length || sinMovimiento()) return;
  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    }
  }, { threshold: 0.35 });
  videos.forEach((v) => obs.observe(v));
}

function iniciar(): void {
  arrastrables();
  carrusel();
  videosReels();

  if (sinMovimiento()) {
    document.documentElement.classList.remove('home-js');
    return;
  }
  const mm = gsap.matchMedia();
  hero();
  manifiesto();
  entradas();
  marquesina();
  servicios(mm);
  coches();
  opiniones();
  cortinas();
  reels(mm);
  modelos();
  cita();

  // Las fotos lazy cambian alturas al cargar: recalcula los pins al final
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

// Las cifras suben con el contador comun del sitio (contador.ts)
iniciar();
