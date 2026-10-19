/**
 * Testimonios de la home.
 *
 * PROVISIONALES. Solo el de Daniel A. es real (viene de home.json, la home de
 * Squarespace). El resto son de relleno, para maquetar el carrusel, hasta que
 * Valentin Motors pase los comentarios reales de sus clientes.
 *
 * Por eso la home no publica schema Review ni AggregateRating: marcar como
 * resenas textos inventados va contra las directrices de Google. Cuando esten
 * los reales, se cambian aqui y se anade el marcado.
 */
export interface Testimonio {
  texto: string;
  autor: string;
  /** Coche y centro, en mono bajo la firma. */
  detalle: string;
  real?: boolean;
}

export const TESTIMONIOS: Testimonio[] = [
  {
    texto: 'Desde que conozco a Valentín Motors, no han dejado de sorprenderme con sus trabajos, su implicación y el trato recibido. Yo no buscaba un taller que me mantuviera el coche; buscaba un proyecto a largo plazo basado en el servicio, la profesionalidad y la calidad.',
    autor: 'Daniel A.',
    detalle: 'Cliente',
    real: true,
  },
  {
    texto: 'Llevé el 993 por un ruido que nadie encontraba. Lo localizaron en una mañana y me enseñaron la pieza antes de cambiarla.',
    autor: 'Marc R.',
    detalle: '993 Carrera · Barcelona',
  },
  {
    texto: 'El presupuesto del mantenimiento coincidió con la factura, céntimo a céntimo. Parece poca cosa, pero en este mundo no lo es.',
    autor: 'Javier L.',
    detalle: 'Cayman S · Madrid',
  },
  {
    texto: 'Me explicaron el problema del IMS con datos, sin meter miedo. Hicimos la reparación y el coche va mejor que cuando lo compré.',
    autor: 'Laura S.',
    detalle: '996 Carrera · Barcelona',
  },
  {
    texto: 'Restauraron el 911 de mi padre respetando cada detalle de época. Me entregaron un dossier con las fotos de todo el proceso.',
    autor: 'Antonio G.',
    detalle: '911 2.4 T · Madrid',
  },
  {
    texto: 'Preparan mi coche para la temporada desde hace tres años. Llega a cada carrera tal y como salió del taller.',
    autor: 'Óscar P.',
    detalle: '997 GT3 Cup · Barcelona',
  },
  {
    texto: 'Compré mi 964 con ellos. Sabían de ese coche más que el anterior propietario, y me lo contaron todo, también lo que no era perfecto.',
    autor: 'Elena M.',
    detalle: '964 Carrera 2 · Madrid',
  },
];
