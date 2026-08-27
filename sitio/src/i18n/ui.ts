import type { Idioma } from './config.ts';

/** Cadenas de interfaz. El contenido editorial vive en el CMS, no aqui. */
export const UI = {
  'nav.coches':      { es: 'Porsche en venta', en: 'Porsche for sale', fr: 'Porsche à vendre', it: 'Porsche in vendita', de: 'Porsche kaufen', ca: 'Porsche en venda' },
  'nav.taller':      { es: 'Taller', en: 'Workshop', fr: 'Atelier', it: 'Officina', de: 'Werkstatt', ca: 'Taller' },
  'nav.servicios':   { es: 'Servicios', en: 'Services', fr: 'Services', it: 'Servizi', de: 'Leistungen', ca: 'Serveis' },
  'nav.tarifas':     { es: 'Tarifas', en: 'Pricing', fr: 'Tarifs', it: 'Tariffe', de: 'Preise', ca: 'Tarifes' },
  'nav.magazine':    { es: 'Magazine', en: 'Magazine', fr: 'Magazine', it: 'Magazine', de: 'Magazine', ca: 'Magazine' },
  'nav.nosotros':    { es: 'Nosotros', en: 'About', fr: 'À propos', it: 'Chi siamo', de: 'Über uns', ca: 'Nosaltres' },
  'nav.contacto':    { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatti', de: 'Kontakt', ca: 'Contacte' },

  'a11y.saltar':     { es: 'Saltar al contenido', en: 'Skip to content', fr: 'Aller au contenu', it: 'Vai al contenuto', de: 'Zum Inhalt springen', ca: 'Salta al contingut' },
  'a11y.galeria':    { es: 'Galería de fotografías', en: 'Photo gallery', fr: 'Galerie photo', it: 'Galleria fotografica', de: 'Fotogalerie', ca: 'Galeria de fotografies' },
  'a11y.anterior':   { es: 'Foto anterior', en: 'Previous photo', fr: 'Photo précédente', it: 'Foto precedente', de: 'Vorheriges Foto', ca: 'Foto anterior' },
  'a11y.siguiente':  { es: 'Foto siguiente', en: 'Next photo', fr: 'Photo suivante', it: 'Foto successiva', de: 'Nächstes Foto', ca: 'Foto següent' },
  'a11y.irFoto':     { es: 'Ir a la foto', en: 'Go to photo', fr: 'Aller à la photo', it: 'Vai alla foto', de: 'Zum Foto', ca: 'Ves a la foto' },
  'a11y.idioma':     { es: 'Cambiar idioma', en: 'Change language', fr: 'Changer de langue', it: 'Cambia lingua', de: 'Sprache wechseln', ca: 'Canvia idioma' },

  'scroll':          { es: 'Desliza', en: 'Scroll', fr: 'Défiler', it: 'Scorri', de: 'Scrollen', ca: 'Llisca' },
  'precio':          { es: 'Precio', en: 'Price', fr: 'Prix', it: 'Prezzo', de: 'Preis', ca: 'Preu' },
  'estado.disponible': { es: 'Disponible', en: 'Available', fr: 'Disponible', it: 'Disponibile', de: 'Verfügbar', ca: 'Disponible' },
  'estado.reservado':  { es: 'Reservado', en: 'Reserved', fr: 'Réservé', it: 'Riservato', de: 'Reserviert', ca: 'Reservat' },
  'estado.vendido':    { es: 'Vendido', en: 'Sold', fr: 'Vendu', it: 'Venduta', de: 'Verkauft', ca: 'Venut' },
  'cta.info':        { es: 'Más información', en: 'Enquire', fr: 'Plus d’informations', it: 'Maggiori informazioni', de: 'Mehr erfahren', ca: 'Més informació' },
  'cta.ficha':       { es: 'Ver ficha', en: 'View details', fr: 'Voir la fiche', it: 'Vedi scheda', de: 'Details ansehen', ca: 'Veure fitxa' },

  'pie.legal':       { es: 'Aviso legal', en: 'Legal notice', fr: 'Mentions légales', it: 'Note legali', de: 'Impressum', ca: 'Avis legal' },
  'pie.privacidad':  { es: 'Privacidad', en: 'Privacy', fr: 'Confidentialité', it: 'Privacy', de: 'Datenschutz', ca: 'Privacitat' },
  'pie.cookies':     { es: 'Cookies', en: 'Cookies', fr: 'Cookies', it: 'Cookie', de: 'Cookies', ca: 'Cookies' },
  'pie.soloEspanol': { es: '', en: 'in Spanish', fr: 'en espagnol', it: 'in spagnolo', de: 'auf Spanisch', ca: 'en castellà' },

  'catalogo.titulo': {
    es: 'Porsche de colección en venta · Valentín Motors',
    en: 'Collector Porsche for sale · Valentín Motors',
    fr: 'Porsche de collection à vendre · Valentín Motors',
    it: 'Porsche da collezione in vendita · Valentín Motors',
    de: 'Sammler-Porsche zu verkaufen · Valentín Motors',
    ca: 'Porsche de col·lecció en venda · Valentín Motors' },
  'catalogo.descripcion': {
    es: 'Selección de Porsche verificados por un especialista independiente desde 1979. Cada coche con historial documentado y 12 meses de garantía.',
    en: 'A selection of Porsche vetted by an independent specialist since 1979. Every car with documented history and a 12-month warranty.',
    fr: 'Une sélection de Porsche vérifiées par un spécialiste indépendant depuis 1979. Chaque voiture avec historique documenté et douze mois de garantie.',
    it: 'Una selezione di Porsche verificate da uno specialista indipendente dal 1979. Ogni vettura con storia documentata e dodici mesi di garanzia.',
    de: 'Eine Auswahl von Porsche, geprüft von einem freien Spezialisten seit 1979. Jedes Fahrzeug mit dokumentierter Historie und zwölf Monaten Garantie.',
    ca: 'Selecció de Porsche verificats per un especialista independent des de 1979. Cada cotxe amb historial documentat i dotze mesos de garantia.' },

  'cookies.titulo':  { es: 'Cookies', en: 'Cookies', fr: 'Cookies', it: 'Cookie', de: 'Cookies', ca: 'Galetes' },
  'cookies.texto': {
    es: 'Usamos analítica sin cookies para saber qué páginas se leen. Si aceptas, añadimos Google Analytics para entender mejor de dónde llegas.',
    en: 'We use cookieless analytics to see which pages get read. If you accept, we add Google Analytics to better understand where you come from.',
    fr: 'Nous utilisons une analyse sans cookies pour savoir quelles pages sont lues. Si vous acceptez, nous ajoutons Google Analytics pour mieux comprendre d’où vous venez.',
    it: 'Usiamo analisi senza cookie per sapere quali pagine vengono lette. Se accetta, aggiungiamo Google Analytics per capire meglio da dove arriva.',
    de: 'Wir nutzen eine Analyse ohne Cookies, um zu sehen, welche Seiten gelesen werden. Wenn Sie zustimmen, ergänzen wir Google Analytics, um besser zu verstehen, woher Sie kommen.',
    ca: 'Fem servir analítica sense galetes per saber quines pàgines es llegeixen. Si ho acceptes, hi afegim Google Analytics per entendre millor d’on arribes.' },
  'cookies.aceptar':  { es: 'Aceptar', en: 'Accept', fr: 'Accepter', it: 'Accetto', de: 'Zustimmen', ca: 'Accepta' },
  'cookies.rechazar': { es: 'Solo lo necesario', en: 'Essential only', fr: 'Strictement nécessaire', it: 'Solo il necessario', de: 'Nur das Nötige', ca: 'Només el necessari' },
  'cookies.masInfo':  { es: 'Política de cookies', en: 'Cookie policy', fr: 'Politique de cookies', it: 'Informativa cookie', de: 'Cookie-Richtlinie', ca: 'Política de galetes' },

  'vendido.explicacion': {
    es: 'Este Porsche ya se ha vendido. Mantenemos su página porque forma parte del stock que ha pasado por nuestras manos, y porque quien buscaba este modelo merece encontrar algo mejor que un error.',
    en: 'This Porsche has been sold. We keep its page because it is part of the stock that has passed through our hands, and because anyone searching for this model deserves to find something better than an error.',
    fr: 'Cette Porsche a été vendue. Nous conservons sa page parce qu’elle fait partie des voitures passées entre nos mains, et parce que celui qui cherchait ce modèle mérite mieux qu’une page d’erreur.',
    it: 'Questa Porsche è stata venduta. Manteniamo la sua pagina perché fa parte delle vetture passate per le nostre mani, e perché chi cercava questo modello merita qualcosa di meglio di un errore.',
    de: 'Dieser Porsche ist verkauft. Wir behalten seine Seite, weil er zu den Fahrzeugen gehört, die durch unsere Hände gegangen sind, und weil wer dieses Modell sucht Besseres verdient als eine Fehlerseite.',
    ca: 'Aquest Porsche ja s’ha venut. Mantenim la seva pàgina perquè forma part de l’estoc que ha passat per les nostres mans, i perquè qui buscava aquest model mereix trobar alguna cosa millor que un error.' },
  'vendido.avisame': {
    es: 'Avísame si entra uno similar', en: 'Tell me if a similar one comes in',
    fr: 'Prévenez-moi si une similaire arrive', it: 'Avvisatemi se ne arriva una simile',
    de: 'Benachrichtigen Sie mich bei einem ähnlichen', ca: 'Avisa’m si n’entra un de similar' },
  'vendido.verStock': {
    es: 'Ver los Porsche disponibles', en: 'See available Porsche',
    fr: 'Voir les Porsche disponibles', it: 'Vedi le Porsche disponibili',
    de: 'Verfügbare Porsche ansehen', ca: 'Veure els Porsche disponibles' },

  'footer.desde':    { es: 'Especialistas Porsche desde 1979', en: 'Porsche specialists since 1979', fr: 'Spécialistes Porsche depuis 1979', it: 'Specialisti Porsche dal 1979', de: 'Porsche-Spezialisten seit 1979', ca: 'Especialistes Porsche des de 1979' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type ClaveUI = keyof typeof UI;

/** Devuelve el traductor para un idioma. */
export const traductor = (idioma: Idioma) => (clave: ClaveUI): string => UI[clave][idioma];
