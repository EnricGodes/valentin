/**
 * Los dos talleres.
 *
 * Vivían escritos dentro de Pie.astro y ahora los necesita también el panel
 * del menú en móvil, donde poder llamar de un toque vale más que cualquier
 * enlace. Un dato que se escribe en dos sitios acaba diciendo dos cosas.
 *
 * No se leen de barcelona.json ni de madrid.json porque allí están dentro de
 * párrafos con HTML: sacar la calle de una frase con expresiones regulares es
 * lo que se rompe el día que alguien reescribe el párrafo.
 */
export interface Centro {
  rutaId: 'barcelona' | 'madrid';
  nombre: string;
  calle: string;
  ciudad: string;
  /** Como se enseña. */
  tel: string;
  /** Como se marca: sin espacios, para el href tel:. */
  telHref: string;
  email: string;
  /** [que, cuando] — el rotulo se traduce en quien lo pinta. */
  horas: { que: 'taller' | 'ventas'; cuando: string }[];
}

export const CENTROS: Centro[] = [
  {
    rutaId: 'barcelona', nombre: 'Barcelona',
    calle: 'Carrer de Varsòvia, 65', ciudad: '08041 Barcelona',
    tel: '+34 933 479 856', telHref: '+34933479856',
    email: 'info@valentinmotors.es',
    horas: [{ que: 'taller', cuando: '8:00 – 18:00' }],
  },
  {
    rutaId: 'madrid', nombre: 'Madrid',
    calle: 'Calle Puig Adam, 10 · Parque Sur', ciudad: '28914 Leganés, Madrid',
    tel: '+34 913 017 575', telHref: '+34913017575',
    email: 'madrid@valentinmotors.es',
    horas: [{ que: 'taller', cuando: '8:30 – 18:00' },
            { que: 'ventas', cuando: '8:30 – 19:00' }],
  },
];
