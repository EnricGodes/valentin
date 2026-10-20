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

/* Onda de color de los titulares (la de terminal-industries.com): cada letra
   arranca casi apagada, pasa por un bronce encendido y se asienta en su color
   final, una detras de otra de izquierda a derecha. */
const BRONCE_VIVO = '#E2B57E';

function apagado(color: string): string {
  const [r, g, b] = color.match(/\d+(\.\d+)?/g)!.map(Number);
  return `rgba(${r}, ${g}, ${b}, 0.14)`;
}

function onda(letras: Element[], opciones: gsap.TimelineVars = {}): gsap.core.Timeline {
  const tl = gsap.timeline(opciones);
  letras.forEach((l, i) => {
    const final = getComputedStyle(l).color;
    tl.fromTo(l, { color: apagado(final) }, {
      keyframes: { color: [apagado(final), BRONCE_VIVO, final], easeEach: 'none' },
      duration: 0.75, ease: 'none',
      /* Al acabar se quita el color en linea: asi la letra vuelve a heredar
         y un :hover o un cambio de tema siguen funcionando. */
      onComplete: () => { gsap.set(l, { clearProps: 'color' }); },
    } as gsap.TweenVars, i * 0.028);
  });
  return tl;
}

/* Estos titulares ademas suben linea a linea desde una mascara, como el h1. */
const CON_APARICION = '#venta .section-title, #opiniones .section-title';

/** Todos los titulares de seccion de la home entran con la onda. */
function titulares(): void {
  const aparicion = new Set($$(CON_APARICION));
  for (const h of $$('main .section-title, main .cita-titulo')) {
    const sube = aparicion.has(h);
    /* El .reveal de CabeceraSeccion los desplazaba a la vez que la mascara:
       aqui manda la mascara. */
    if (sube) h.classList.remove('reveal');
    const partes = SplitText.create(h, sube
      ? { type: 'lines,words,chars', mask: 'lines', linesClass: 'linea', charsClass: 'letra' }
      : { type: 'words,chars', charsClass: 'letra' });
    const tl = gsap.timeline({ paused: true });
    if (sube) tl.from(partes.lines, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.14 }, 0);
    tl.add(onda(partes.chars), sube ? 0.2 : 0);
    ScrollTrigger.create({ trigger: h, start: 'top 72%', once: true, onEnter: () => tl.play() });
  }
}

function hero(): void {
  const seccion = $('.hero--home');
  if (!seccion) return;
  const titulo = $('.hero-title', seccion);
  const claim = $('.hero-claim', seccion);
  const capa = $('.hero-parallax', seccion);
  const contenido = $('.hero-content', seccion);

  if (titulo) {
    gsap.set([titulo, claim], { opacity: 1, animation: 'none' });
    const partes = SplitText.create(titulo, {
      type: 'lines,words,chars', mask: 'lines', linesClass: 'linea', charsClass: 'letra',
    });
    gsap.from(partes.lines, {
      yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.14, delay: 0.25,
    });
    onda(partes.chars, { delay: 0.45 });
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

/** Marca la palabra de la marquesina que cruza el centro de la pantalla. */
function marquesinaCentro(): void {
  const pista = $('.marquesina-pista');
  if (!pista) return;
  const items = $$('.marquesina-item', pista);
  let actual: HTMLElement | null = null;
  const marcar = () => {
    const centro = window.innerWidth / 2;
    const elegido = items.find((it) => {
      const r = it.getBoundingClientRect();
      return r.left <= centro && r.right >= centro;
    }) ?? null;
    if (elegido === actual) return;
    actual?.classList.remove('activo');
    elegido?.classList.add('activo');
    actual = elegido;
  };
  marcar();
  if (sinMovimiento()) return;
  // Solo mientras se ve: fuera de pantalla no se mide nada
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(pista);
  gsap.ticker.add(() => { if (visible) marcar(); });
}

/** Servicios: pin y recorrido horizontal en escritorio; cortinas en movil. */
function servicios(mm: gsap.MatchMedia): void {
  const seccion = $('.servicios-h');
  const pista = $('.servicios-h-pista');
  if (!seccion || !pista) return;
  const tarjetas = $$('.srv', pista);

  mm.add(ESCRITORIO, () => {
    /* Todas las tarjetas con el bloque de texto del alto del mas largo, para
       que las cuatro fotos midan lo mismo. Se recalcula en cada refresh
       (cambio de tamano), que es cuando puede cambiar el corte de lineas. */
    const cuerpos = tarjetas.map((t) => $('.srv-cuerpo', t)!);
    const igualar = () => {
      cuerpos.forEach((c) => { c.style.flexBasis = ''; });
      const alto = Math.max(...cuerpos.map((c) => c.offsetHeight));
      cuerpos.forEach((c) => { c.style.flexBasis = `${alto}px`; });
    };
    igualar();
    ScrollTrigger.addEventListener('refreshInit', igualar);

    const distancia = () => Math.max(0, pista.scrollWidth - window.innerWidth);
    const recorrido = gsap.to(pista, {
      x: () => -distancia(), ease: 'none',
      scrollTrigger: {
        trigger: seccion, start: 'top top', end: () => `+=${distancia()}`,
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    for (const t of tarjetas) {
      gsap.from($$('.srv-num, .srv-titulo, .srv-texto, .enlace-mono', t), {
        y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: t, containerAnimation: recorrido, start: 'left 75%' },
      });
    }
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', igualar);
      cuerpos.forEach((c) => { c.style.flexBasis = ''; });
    };
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
  const tarjetas = $$('.resena');
  if (!tarjetas.length) return;
  gsap.from(tarjetas, {
    x: 120, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.opiniones-pista', start: 'top 80%' },
  });
  gsap.from($$('.resena .estrellas-g svg'), {
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

/** Carrusel de resenas: botones, teclado y avance solo que se pausa. */
function carrusel(): void {
  const pista = $('[data-carrusel-pista]');
  if (!pista) return;
  const paso = () => ($('.resena', pista)?.getBoundingClientRect().width ?? 400) + 2;
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

/**
 * Reels en un anillo 3D. Seis tarjetas repartidas en circulo; la del frente
 * es la grande y nitida y reproduce su fragmento. Al acabar el fragmento el
 * anillo gira a la siguiente. Las de los lados se ven mas pequenas por la
 * perspectiva, y ademas desenfocadas y oscurecidas segun su profundidad.
 * Clic en una lateral la trae al frente; la del frente abre Instagram.
 */
function anillo(): void {
  const raiz = $('[data-anillo]');
  if (!raiz) return;
  const tarjetas = $$<HTMLAnchorElement>('.reel', raiz);
  const n = tarjetas.length;
  const videos = tarjetas.map((t) => $<HTMLVideoElement>('.reel-video', t)!);
  const barras = tarjetas.map((t) => $('.reel-progreso i', t)!);
  const quieto = sinMovimiento();
  raiz.classList.add('listo');

  let frente = 0;
  let visible = false;

  const cargar = (i: number) => {
    const v = videos[(i + n) % n];
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
  };

  /* Posiciones por distancia al frente (0 = frente, 3 = detras): en un
     circulo real las de distancia 2 quedaban tapadas por las de 1, asi que
     el anillo se abre un poco mas en los lados. */
  const DX = [0, 0.92, 1.62, 0];
  const DZ = [0, -260, -540, -760];
  const GIRO = [0, 26, 40, 0];

  const colocar = (animar: boolean) => {
    const ancho = tarjetas[0].offsetWidth;
    const escala = Math.min(1, window.innerWidth / (ancho * 4.2));
    tarjetas.forEach((t, i) => {
      // Distancia circular al frente: -2..3 con seis tarjetas
      let d = (i - frente) % n;
      if (d > n / 2) d -= n;
      if (d <= -n / 2) d += n;
      const lejos = Math.abs(d);
      const lado = Math.sign(d);
      (animar && !quieto ? gsap.to : gsap.set)(t, {
        x: lado * DX[lejos] * ancho * escala,
        z: DZ[lejos],
        rotationY: -lado * GIRO[lejos],
        scale: d === 0 ? 1 : 0.86,
        filter: `blur(${lejos * 2.5}px) brightness(${1 - lejos * 0.24})`,
        opacity: lejos >= 3 ? 0 : 1,
        zIndex: 10 - lejos,
        duration: 1.1, ease: 'power3.inOut', overwrite: 'auto',
      });
      t.classList.toggle('frente', d === 0);
      t.tabIndex = d === 0 ? 0 : -1;
    });
  };

  const reproducir = () => {
    videos.forEach((v, i) => { if (i !== frente) { v.pause(); } });
    barras.forEach((b) => gsap.set(b, { scaleX: 0 }));
    if (quieto || !visible) return;
    const v = videos[frente];
    cargar(frente);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const ir = (paso: number) => {
    frente = (frente + paso + n) % n;
    colocar(true);
    cargar(frente + 1); cargar(frente - 1);
    reproducir();
  };

  // Fragmento terminado: gira a la siguiente. La barra sigue al video.
  videos.forEach((v, i) => {
    v.addEventListener('timeupdate', () => {
      if (i === frente && v.duration) gsap.set(barras[i], { scaleX: v.currentTime / v.duration });
    });
    v.addEventListener('ended', () => { if (i === frente) ir(1); });
  });

  tarjetas.forEach((t, i) => t.addEventListener('click', (e) => {
    if (i === frente) return;
    e.preventDefault();
    const d = ((i - frente + n) % n);
    ir(d > n / 2 ? d - n : d);
  }));
  $$('[data-anillo-ir]').forEach((b) =>
    b.addEventListener('click', () => ir(Number(b.dataset.anilloIr))));
  raiz.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); }
  });
  // Deslizar con el dedo
  let x0: number | null = null;
  raiz.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  raiz.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1);
  });

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) reproducir();
    else videos[frente].pause();
  }, { threshold: 0.4 }).observe(raiz);
  window.addEventListener('resize', () => colocar(false));

  cargar(0); cargar(1); cargar(n - 1);
  colocar(false);
  /* La entrada va sobre el contenedor, no sobre las tarjetas: animar sus
     opacidades peleaba con las del anillo y se veia una tarjeta colocarse. */
  if (!quieto) {
    gsap.from(raiz, {
      opacity: 0, y: 80, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: raiz, start: 'top 85%' },
    });
  }
}

/** Magazine: tres articulos al azar de la bolsa, de categorias distintas. */
function articulosAlAzar(): void {
  const lista = $('.mag-lista--azar');
  if (!lista) return;
  const items = $$('.mag-item', lista);
  const categoria = (it: HTMLElement) =>
    ($('.mag-meta', it)?.textContent ?? '').split('·')[1]?.trim() || 'otros';
  const barajados = gsap.utils.shuffle([...items]);
  const elegidos: HTMLElement[] = [];
  const vistas = new Set<string>();
  // Primero uno por categoria; si no hay tres categorias, se completa
  for (const it of barajados) {
    if (elegidos.length === 3) break;
    if (!vistas.has(categoria(it))) { elegidos.push(it); vistas.add(categoria(it)); }
  }
  for (const it of barajados) {
    if (elegidos.length === 3) break;
    if (!elegidos.includes(it)) elegidos.push(it);
  }
  items.forEach((it) => { if (!elegidos.includes(it)) it.remove(); });
  elegidos.forEach((it) => lista.append(it));
}

function iniciar(): void {
  arrastrables();
  carrusel();
  articulosAlAzar();
  marquesinaCentro();
  anillo();

  if (sinMovimiento()) {
    document.documentElement.classList.remove('home-js');
    return;
  }
  const mm = gsap.matchMedia();
  hero();
  titulares();
  manifiesto();
  entradas();
  marquesina();
  servicios(mm);
  coches();
  opiniones();
  cortinas();
  modelos();
  cita();

  /* Los triggers se calculan en el orden en que se crean, y los titulares se
     crean antes que el pin de Servicios: sin esto, todo lo que va por debajo
     del pin se disparaba casi una pantalla antes de tiempo (el titular de
     Opiniones ya estaba montado al llegar). Se reordenan por posicion. */
  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  // Las fotos lazy cambian alturas al cargar: recalcula los pins al final
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

// Las cifras suben con el contador comun del sitio (contador.ts)
iniciar();
