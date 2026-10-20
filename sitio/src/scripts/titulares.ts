import { observarUnaVez, sinMovimiento } from './motion.ts';

/**
 * Aparicion de los h1 del sitio, la misma del hero de la home: las lineas
 * suben desde una mascara mientras pasa la onda de color letra a letra.
 *
 * GSAP solo se descarga si la pagina tiene un h1 que animar. Mientras llega,
 * el titulo espera oculto (.titular-espera); si el script no llega, el CSS lo
 * muestra igual a los 2,5 s. La home (hero propio en home.ts) y la PA10/01
 * (animacion propia en pa10.ts) se quedan fuera.
 */
type Gsap = typeof import('gsap').gsap;
type Split = typeof import('gsap/SplitText').SplitText;

/* Onda de color (la de terminal-industries.com): cada letra arranca casi
   apagada, pasa por un bronce encendido y se asienta en su color final, una
   detras de otra de izquierda a derecha. */
const BRONCE_VIVO = '#E2B57E';

function apagado(color: string): string {
  const [r, g, b] = color.match(/\d+(\.\d+)?/g)!.map(Number);
  return `rgba(${r}, ${g}, ${b}, 0.14)`;
}

export function onda(gsap: Gsap, letras: Element[], opciones: gsap.TimelineVars = {}): gsap.core.Timeline {
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

/** Lineas que suben desde la mascara y, encima, la onda de color. */
export function aparicion(gsap: Gsap, SplitText: Split, titulo: HTMLElement, retardo = 0): gsap.core.Timeline {
  const partes = SplitText.create(titulo, {
    type: 'lines,words,chars', mask: 'lines', linesClass: 'linea', charsClass: 'letra',
  });
  const tl = gsap.timeline({ delay: retardo });
  tl.from(partes.lines, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.14 }, 0);
  tl.add(onda(gsap, partes.chars), 0.2);
  return tl;
}

const EXCLUIDOS = '.hero--home h1, .p10 h1';

export function iniciarTitulares(): void {
  const titulos = [...document.querySelectorAll<HTMLElement>('main h1, .hero h1')]
    .filter((h) => !h.matches(EXCLUIDOS) && !h.dataset.titular);
  if (!titulos.length || sinMovimiento()) return;

  /* Fuera el .reveal: su desplazamiento chocaria con el de la mascara. */
  for (const h of titulos) {
    h.dataset.titular = '1';
    h.classList.remove('reveal');
    h.classList.add('titular-espera');
  }

  Promise.all([import('gsap'), import('gsap/SplitText'), document.fonts.ready]).then(
    ([{ gsap }, { SplitText }]) => {
      gsap.registerPlugin(SplitText);
      observarUnaVez(titulos, (el) => {
        const h = el as HTMLElement;
        h.classList.remove('titular-espera');
        // El del hero de las fichas sale tras el eyebrow, como antes
        aparicion(gsap, SplitText, h, h.closest('.hero') ? 0.45 : 0.1);
      });
    },
    () => titulos.forEach((h) => h.classList.remove('titular-espera')),
  );
}
