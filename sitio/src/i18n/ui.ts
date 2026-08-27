import type { Idioma } from './config.ts';

/** Cadenas de interfaz. El contenido editorial vive en el CMS, no aqui. */
export const UI = {
  'nav.coches':      { es: 'Porsche en venta', en: 'Porsche for sale', fr: 'Porsche a vendre', it: 'Porsche in vendita', de: 'Porsche kaufen', ca: 'Porsche en venda' },
  'nav.taller':      { es: 'Taller', en: 'Workshop', fr: 'Atelier', it: 'Officina', de: 'Werkstatt', ca: 'Taller' },
  'nav.servicios':   { es: 'Servicios', en: 'Services', fr: 'Services', it: 'Servizi', de: 'Leistungen', ca: 'Serveis' },
  'nav.tarifas':     { es: 'Tarifas', en: 'Pricing', fr: 'Tarifs', it: 'Tariffe', de: 'Preise', ca: 'Tarifes' },
  'nav.magazine':    { es: 'Magazine', en: 'Magazine', fr: 'Magazine', it: 'Magazine', de: 'Magazine', ca: 'Magazine' },
  'nav.nosotros':    { es: 'Nosotros', en: 'About', fr: 'A propos', it: 'Chi siamo', de: 'Uber uns', ca: 'Nosaltres' },
  'nav.contacto':    { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatti', de: 'Kontakt', ca: 'Contacte' },

  'a11y.saltar':     { es: 'Saltar al contenido', en: 'Skip to content', fr: 'Aller au contenu', it: 'Vai al contenuto', de: 'Zum Inhalt springen', ca: 'Salta al contingut' },
  'a11y.galeria':    { es: 'Galeria de fotografias', en: 'Photo gallery', fr: 'Galerie photo', it: 'Galleria fotografica', de: 'Fotogalerie', ca: 'Galeria de fotografies' },
  'a11y.anterior':   { es: 'Foto anterior', en: 'Previous photo', fr: 'Photo precedente', it: 'Foto precedente', de: 'Vorheriges Foto', ca: 'Foto anterior' },
  'a11y.siguiente':  { es: 'Foto siguiente', en: 'Next photo', fr: 'Photo suivante', it: 'Foto successiva', de: 'Nachstes Foto', ca: 'Foto seguent' },
  'a11y.irFoto':     { es: 'Ir a la foto', en: 'Go to photo', fr: 'Aller a la photo', it: 'Vai alla foto', de: 'Zum Foto', ca: 'Ves a la foto' },
  'a11y.idioma':     { es: 'Cambiar idioma', en: 'Change language', fr: 'Changer de langue', it: 'Cambia lingua', de: 'Sprache wechseln', ca: 'Canvia idioma' },

  'scroll':          { es: 'Desliza', en: 'Scroll', fr: 'Defiler', it: 'Scorri', de: 'Scrollen', ca: 'Llisca' },
  'precio':          { es: 'Precio', en: 'Price', fr: 'Prix', it: 'Prezzo', de: 'Preis', ca: 'Preu' },
  'estado.disponible': { es: 'Disponible', en: 'Available', fr: 'Disponible', it: 'Disponibile', de: 'Verfugbar', ca: 'Disponible' },
  'estado.reservado':  { es: 'Reservado', en: 'Reserved', fr: 'Reserve', it: 'Riservato', de: 'Reserviert', ca: 'Reservat' },
  'estado.vendido':    { es: 'Vendido', en: 'Sold', fr: 'Vendu', it: 'Venduta', de: 'Verkauft', ca: 'Venut' },
  'cta.info':        { es: 'Mas informacion', en: 'Enquire', fr: 'Plus d’informations', it: 'Maggiori informazioni', de: 'Mehr erfahren', ca: 'Mes informacio' },
  'cta.ficha':       { es: 'Ver ficha', en: 'View details', fr: 'Voir la fiche', it: 'Vedi scheda', de: 'Details ansehen', ca: 'Veure fitxa' },

  'pie.legal':       { es: 'Aviso legal', en: 'Legal notice', fr: 'Mentions legales', it: 'Note legali', de: 'Impressum', ca: 'Avis legal' },
  'pie.privacidad':  { es: 'Privacidad', en: 'Privacy', fr: 'Confidentialite', it: 'Privacy', de: 'Datenschutz', ca: 'Privacitat' },
  'pie.cookies':     { es: 'Cookies', en: 'Cookies', fr: 'Cookies', it: 'Cookie', de: 'Cookies', ca: 'Cookies' },
  'pie.soloEspanol': { es: '', en: 'in Spanish', fr: 'en espagnol', it: 'in spagnolo', de: 'auf Spanisch', ca: 'en castella' },

  'footer.desde':    { es: 'Especialistas Porsche desde 1979', en: 'Porsche specialists since 1979', fr: 'Specialistes Porsche depuis 1979', it: 'Specialisti Porsche dal 1979', de: 'Porsche-Spezialisten seit 1979', ca: 'Especialistes Porsche des de 1979' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type ClaveUI = keyof typeof UI;

/** Devuelve el traductor para un idioma. */
export const traductor = (idioma: Idioma) => (clave: ClaveUI): string => UI[clave][idioma];
