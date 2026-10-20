/**
 * Resenas de Google de la home: reales, copiadas de la ficha de Google Maps de
 * Valentin Motors Barcelona (octubre de 2026). Solo de cinco estrellas y de
 * las mas largas.
 *
 * Dos estan cortadas (`truncada`): Google no deja leerlas enteras sin abrir la
 * ficha. Se muestran cortadas con un "Mas" que lleva a Google, que es lo mismo
 * que hace Google en su propio widget.
 *
 * Sin foto de perfil a proposito: la foto es un dato personal del autor y no
 * esta pensada para publicarse fuera de Google. Se usa la inicial sobre un
 * circulo de color, que es lo que Google pinta cuando el usuario no tiene foto.
 *
 * La fecha se guarda como mes (AAAA-MM) y el "Hace 2 meses" se calcula en el
 * build: escrito a mano se quedaria viejo.
 *
 * Sin schema Review/AggregateRating: Google no muestra estrellas de resenas que
 * un negocio publica sobre si mismo en su propia web.
 */
export interface Resena {
  autor: string;
  /** "Local Guide · 23 reseñas", como lo pinta Google bajo el nombre. */
  meta?: string;
  /** Mes de la resena, AAAA-MM. */
  fecha: string;
  estrellas: 5;
  texto: string;
  truncada?: boolean;
  respondida?: boolean;
  idioma?: 'en';
}

/** Ficha del negocio en Google Maps (por CID, estable aunque cambie el nombre). */
export const GOOGLE_FICHA = 'https://www.google.com/maps?cid=13602094847783077776';
export const GOOGLE_NOTA = { media: 4.3, total: 106 };

export const RESENAS: Resena[] = [
  {
    autor: 'Théo Garrouste',
    meta: '4 reseñas · 1 foto',
    fecha: '2026-08',
    estrellas: 5,
    texto: 'Dejé un 997 para un mantenimiento clásico, y desafortunadamente la correa accesoria se rompió durante una prueba en su taller. Jordi gestionó la situación de forma muy profesional y justa para ambas partes. Gracias por su ayuda y comprensión. Volveré y lo recomiendo.',
    respondida: true,
  },
  {
    autor: 'Frank Hoogeboom',
    fecha: '2026-08',
    estrellas: 5,
    texto: 'Un concesionario Porsche al que acudo con muchísimo gusto y en el que estoy realmente satisfecho. Es una auténtica empresa familiar, y eso se nota en todos los',
    truncada: true,
  },
  {
    autor: 'Sportback 20',
    meta: 'Local Guide · 23 reseñas · 17 fotos',
    fecha: '2021-10',
    estrellas: 5,
    texto: 'Grandes profesionales y mejores personas. Sin duda un taller especialista Porsche de referencia. Jordi y su equipo se implican al máximo para ayudar en cualquier problema, por importante que sea. Un 10!',
    respondida: true,
  },
  {
    autor: 'Richard Verburg',
    meta: '5 reseñas',
    fecha: '2025-10',
    estrellas: 5,
    texto: 'Fantastic experience with the Valentin Motors is what I can say. They are very professional. Their work is very detailed and at a level you would expect when you want to have work done on your Porsche. Prices are good, they are always available and very helpful! Keep up the good work',
    respondida: true,
    idioma: 'en',
  },
  {
    autor: 'Francesc Serrate',
    meta: '8 reseñas',
    fecha: '2025-10',
    estrellas: 5,
    texto: 'PROFESIONALES AL 100 x 100. He tenido un problema eléctrico en un 911 que solo ellos han sido capaces de resolver. No solo eso sino que estuvieron más de 1h asesorándome del mantenimiento',
    truncada: true,
    respondida: true,
  },
  {
    autor: 'Jordi Arquer',
    meta: '4 reseñas · 1 foto',
    fecha: '2026-03',
    estrellas: 5,
    texto: 'Trato impecable en la venta y post venta de mi 911. La profesionalidad con la que Jordi y su equipo tratan al cliente es excelente. Recomiendo Valentín Motors al 100%.',
    respondida: true,
  },
];

/** "Hace 2 meses", "Hace un año"... como Google, contado desde el build. */
export function haceCuanto(fecha: string, hoy = new Date()): string {
  const [a, m] = fecha.split('-').map(Number);
  const meses = (hoy.getFullYear() - a) * 12 + (hoy.getMonth() + 1 - m);
  if (meses < 1) return 'Hace unas semanas';
  if (meses === 1) return 'Hace un mes';
  if (meses < 12) return `Hace ${meses} meses`;
  const anos = Math.floor(meses / 12);
  return anos === 1 ? 'Hace un año' : `Hace ${anos} años`;
}
