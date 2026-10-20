/**
 * Textos de la pagina "Quienes somos", en los seis idiomas.
 *
 * El castellano es el de docs/about_us/valentin_motors_sobre_nosotros_voz_de_marca.md,
 * tal cual. Los otros cinco estan traducidos a mano con src/i18n/glosario.md.
 * Los campos que llevan <strong> o <br> se pintan con set:html.
 */
import type { Idioma } from '../i18n/config';

const es = {
  apertura: {
    etiqueta: 'Sobre nosotros',
    titulo: 'Desde 1979.<br>Y siempre mirando hacia delante.',
    lema: 'Somos Valentin Motors. Especialistas Porsche desde 1979.',
    parrafos: [
      'Nacimos en Barcelona, en una época en la que un Porsche 911 podía llevarte al trabajo de lunes a viernes y competir en un circuito durante el fin de semana. Empezamos preparando coches para quienes exigían algo más de su mecánica. Y esa manera de entender el automóvil sigue formando parte de nosotros.',
      'Han cambiado los modelos, las tecnologías y las instalaciones. Nosotros también hemos evolucionado. Hoy, con <strong>Jordi Edo al frente</strong>, somos un equipo especializado en mantenimiento, reparación, restauración, preparación y proyectos a medida para Porsche de distintas generaciones.',
      'Trabajamos desde <strong>Barcelona y Madrid</strong> con una idea muy clara: conocer cada coche en profundidad, cuidar cada detalle y ofrecer a sus propietarios un servicio a la altura de lo que conducen.',
      'Más de 45 años después, seguimos haciendo lo que mejor sabemos hacer. Y seguimos pensando en todo lo que está por venir.',
    ],
    fotoAlt: 'El equipo de Valentin Motors frente a la sala de motores',
  },
  origenes: {
    etiqueta: 'Nuestros orígenes',
    titulo: 'Todo empezó con una forma de entender la mecánica.',
    parrafos: [
      'En <strong>1979</strong>, Valentín Ibán puso en marcha Valentin Motors en Barcelona. Los Porsche 911 y 914 fueron los protagonistas de nuestros primeros años, con trabajos centrados en la preparación deportiva, la mecánica de competición y la búsqueda del mejor rendimiento.',
      'La competición nos enseñó a trabajar con precisión, a comprender el comportamiento de cada componente y a no conformarnos con que algo simplemente funcione. Aprendimos a buscar el porqué de cada problema y la mejor manera de resolverlo.',
      'A partir de ahí, nuestro taller fue creciendo con los coches y con los clientes. Pasamos de preparar deportivos para carretera y circuito a atender nuevas generaciones de Porsche, incorporar más especialidades y abordar proyectos de restauración cada vez más completos.',
    ],
    cierre: 'Nuestro origen está en la mecánica. Nuestra manera de trabajar, en el conocimiento.',
    fotoAlt: 'Valentín Ibán, fundador de Valentin Motors',
    fotoPie: 'Valentín Ibán · Fundador, 1979',
  },
  generacion: {
    etiqueta: 'Una segunda generación, una nueva etapa',
    titulo: 'Lo que hemos aprendido nos permite ir más lejos.',
    parrafos: [
      'Somos una empresa familiar, y estamos orgullosos de serlo. Pero nuestra historia no consiste únicamente en conservar un legado. Consiste en hacerlo evolucionar.',
      'Con <strong>Jordi Edo liderando Valentin Motors</strong>, hemos impulsado una nueva etapa de crecimiento y especialización. Hemos ampliado nuestras instalaciones, incorporado nuevas capacidades técnicas, desarrollado proyectos propios y llevado nuestra forma de trabajar más allá de Barcelona con la apertura de Madrid.',
      'Nos gustan tanto los Porsche que merecen conservarse exactamente como fueron concebidos como aquellos que pueden transformarse para responder a una nueva idea. Nos interesa la historia de la marca, pero también su presente y sus posibilidades de futuro.',
      'Por eso seguimos invirtiendo en personas, espacios y conocimiento. Porque la experiencia solo tiene valor si nos ayuda a hacer mejor el siguiente trabajo.',
    ],
    jordi: {
      cargo: 'Dirección y visión de futuro',
      parrafos: [
        'Jordi está al frente de Valentin Motors y lidera el crecimiento de la empresa. Su objetivo es que sigamos siendo un especialista cercano, con el conocimiento de un taller de toda la vida y las capacidades necesarias para afrontar los retos de los Porsche actuales.',
        'Bajo su dirección hemos ampliado nuestra presencia a Madrid, renovado nuestras instalaciones en Barcelona y desarrollado una propuesta que abarca desde el mantenimiento cotidiano hasta restauraciones integrales, preparaciones deportivas y proyectos singulares.',
        'Su manera de entender Valentin Motors parte de una convicción que compartimos todos: cada coche tiene una historia, cada propietario tiene unas expectativas y nuestro trabajo consiste en encontrar la mejor respuesta para ambos.',
      ],
    },
    olga: {
      cargo: 'Continuidad, confianza y atención al detalle',
      parrafos: [
        'Olga forma parte de la segunda generación de Valentin Motors y, junto a Jordi, ha acompañado nuestra evolución durante años. Conoce el taller, nuestros procesos y, sobre todo, el valor de la relación que mantenemos con cada cliente.',
        'En un trabajo de mantenimiento, restauración o preparación, tan importante como la intervención técnica es saber escuchar, planificar correctamente y mantener una comunicación clara durante todo el proceso. Esa atención personal forma parte de nuestra identidad y es algo que Olga nos ayuda a preservar mientras crecemos.',
      ],
    },
    equipo: {
      titulo: 'Nuestro equipo',
      lema: 'El conocimiento se construye entre todos.',
      parrafos: [
        'En cada proyecto intervienen profesionales con especialidades distintas: diagnóstico, mecánica, motores, carrocería, pintura, restauración y preparación. Compartimos información, contrastamos soluciones y trabajamos con un objetivo común: que cada Porsche salga de nuestras instalaciones como debe salir.',
        'Las instalaciones son importantes. La tecnología también. Pero son las personas y el criterio con el que trabajan los que marcan la diferencia.',
      ],
    },
  },
  talleres: {
    etiqueta: 'Los talleres que nos han traído hasta aquí',
    titulo: 'Barcelona es nuestro origen. Madrid, un paso natural en nuestra evolución.',
    entradilla: 'Hemos crecido sin alejarnos de nuestra esencia. Cada nueva instalación ha respondido a una necesidad concreta: disponer de más espacio, incorporar más especialidades o estar más cerca de nuestros clientes.',
    lista: [
      {
        nombre: 'Passatge Simó, Barcelona',
        lema: 'Donde consolidamos nuestra especialización.',
        parrafos: [
          'Nuestro taller de <strong>Passatge Simó, 14</strong> forma parte de la historia de Valentin Motors. Allí seguimos desarrollando el trabajo que nos había dado a conocer: mecánica Porsche, preparación deportiva y una relación directa con los propietarios que confiaban sus coches a nuestras manos.',
          'Fueron años en los que reforzamos nuestra experiencia, ampliamos nuestra actividad y construimos muchas de las relaciones que han acompañado a la empresa durante décadas.',
        ],
      },
      {
        nombre: 'Gran Via de les Corts Catalanes, Barcelona',
        lema: 'Una nueva dimensión para nuestro taller.',
        parrafos: [
          'En <strong>Gran Via de les Corts Catalanes, 752</strong> continuamos nuestra evolución. Fue una etapa de crecimiento en la que convivieron el mantenimiento de Porsche de uso diario, la mecánica de altas prestaciones y los proyectos de restauración y preparación.',
          'Durante años, Gran Via fue el punto de encuentro de nuestro equipo y de clientes que compartían una misma pasión por Porsche.',
        ],
      },
      {
        nombre: 'Madrid, Leganés',
        lema: 'En 2023 abrimos nuestro segundo centro.',
        parrafos: [
          'La apertura de Valentin Motors Madrid, en <strong>calle Puig Adam, 10, Leganés</strong>, fue uno de los pasos más importantes de nuestra historia reciente.',
          'Queríamos estar más cerca de los propietarios de Porsche de Madrid y del centro de España, sin que tuvieran que desplazarse a Barcelona para acceder a nuestra experiencia y nuestros servicios. Lo hicimos llevando allí la misma manera de trabajar: atención directa, especialización técnica y cuidado por cada vehículo.',
          'Madrid no es una extensión secundaria de Valentin Motors. Es una parte esencial de lo que somos hoy.',
        ],
      },
      {
        nombre: 'Varsòvia, Barcelona',
        lema: 'En 2025 abrimos una nueva etapa en nuestra ciudad.',
        parrafos: [
          'Nos trasladamos a <strong>calle Varsòvia, 65</strong>, a unas nuevas instalaciones de <strong>1.320 m² distribuidos en dos plantas</strong>, donde reunimos más recursos, mejor organización de los procesos y nuevas capacidades, incluidos los trabajos de carrocería y pintura.',
          'El nuevo taller refleja nuestra ambición: seguir creciendo, dar respuesta a proyectos más complejos y ofrecer una experiencia mejor a nuestros clientes sin perder el trato personal que siempre nos ha caracterizado.',
        ],
      },
    ],
    cierre: 'Hoy, <strong>Barcelona y Madrid trabajan con una misma filosofía y una misma exigencia</strong>.',
  },
  especialidades: {
    etiqueta: 'Especialistas Porsche, de principio a fin',
    titulo: 'Un solo universo. Muchas formas de disfrutarlo.',
    parrafos: [
      'Para nosotros, no hay dos Porsche iguales. Cambia la generación, cambia el uso, cambia la historia del coche y cambia lo que espera su propietario. Por eso no trabajamos con respuestas automáticas.',
      'Nos dedicamos a conocer cada modelo y a intervenir con el criterio que necesita:',
    ],
    lista: [
      { titulo: 'Mantenimiento y diagnóstico', texto: 'Cuidamos el funcionamiento y la fiabilidad de cada Porsche, clásico o moderno, con revisiones, diagnosis y reparaciones específicas.' },
      { titulo: 'Motores y transmisiones', texto: 'Revisamos, reparamos y reconstruimos conjuntos mecánicos con el rigor que requieren las diferentes generaciones de Porsche.' },
      { titulo: 'Restauración integral', texto: 'Recuperamos vehículos con una visión completa del proyecto, desde la mecánica y la carrocería hasta los acabados y los detalles originales.' },
      { titulo: 'Carrocería y pintura', texto: 'Trabajamos tanto en la recuperación como en el acabado de cada vehículo, respetando su carácter y sus necesidades.' },
      { titulo: 'Preparación deportiva y personalización', texto: 'Desarrollamos soluciones para quienes quieren adaptar su coche a un uso concreto o hacerlo verdaderamente propio.' },
      { titulo: 'Selección de vehículos', texto: 'Acompañamos la compra y venta de Porsche con el conocimiento técnico que adquirimos cada día en el taller.' },
    ],
    cierre: 'Podemos encargarnos de un mantenimiento programado, resolver una avería compleja o acompañar una transformación que dure meses. En todos los casos aplicamos la misma filosofía: <strong>hacer lo que necesita el coche, hacerlo bien y explicar por qué</strong>.',
  },
  proyectos: {
    etiqueta: 'Del respeto por la historia a los proyectos propios',
    titulo: 'Un Porsche puede tener muchas vidas.',
    parrafos: [
      'Nos apasionan los Porsche que conservan intacta su personalidad original. También los que regresan a la carretera después de una restauración minuciosa y aquellos que se transforman para responder a la visión de su propietario.',
      'La experiencia que acumulamos durante décadas nos permite abordar esos proyectos desde una perspectiva completa. No se trata solo de elegir materiales o mejorar prestaciones. Hay que entender la ingeniería del coche, respetar sus proporciones, anticipar cómo se comportará y cuidar cada elemento del conjunto.',
      'El <strong>PA10/01</strong>, presentado en 2025, representa esta faceta de Valentin Motors: nuestra capacidad para reinterpretar un Porsche 911 con un lenguaje propio, combinando experiencia, técnica y una visión contemporánea del automóvil.',
      'Seguiremos restaurando, manteniendo y preparando Porsche. Y seguiremos explorando nuevas formas de llevar nuestro conocimiento un poco más lejos.',
    ],
    enlace: 'Descubrir el PA10/01',
    fotoAlt: 'El PA10/01, de perfil',
  },
  hitos: {
    etiqueta: 'Los hitos de nuestra historia',
    titulo: 'Más de cuatro décadas de evolución constante.',
    lista: [
      ['1979', 'Nacemos en Barcelona y empezamos a especializarnos en los Porsche 911 y 914 de carretera y competición.'],
      ['Años 80', 'Crecemos alrededor de la preparación deportiva, la mecánica y el trabajo de motores.'],
      ['Passatge Simó', 'Consolidamos nuestra actividad en el taller de Passatge Simó, 14, y nuestra relación con los propietarios Porsche de Barcelona.'],
      ['2009', 'Jordi Edo y Olga Ibán impulsan una nueva etapa al frente de la gestión de Valentin Motors.'],
      ['Gran Via', 'Ampliamos nuestra trayectoria en el taller de Gran Via de les Corts Catalanes, 752.'],
      ['2023', 'Abrimos Valentin Motors Madrid en Leganés y acercamos nuestros servicios a los clientes del centro de España.'],
      ['2024', 'Celebramos nuestros primeros 45 años.'],
      ['2025', 'Inauguramos el nuevo taller de Barcelona en Varsòvia, 65, con más espacio y nuevas capacidades.'],
      ['2025', 'Presentamos el PA10/01, nuestra reinterpretación integral del Porsche 911.'],
      ['Hoy', 'Con Jordi al frente y un equipo especializado en Barcelona y Madrid, continuamos escribiendo nuestra historia.'],
    ] as [string, string][],
  },
  relacion: {
    etiqueta: 'Una relación que va mucho más allá del taller',
    titulo: 'Cuidamos coches. Y la confianza de quienes los conducen.',
    parrafos: [
      'Muchos de nuestros clientes llevan años con nosotros. Algunos han pasado por nuestras instalaciones con varios Porsche; otros nos confían un coche que han conservado toda la vida. Cada historia es distinta, pero todas merecen la misma atención.',
      'Creemos en explicar las cosas con claridad, compartir lo que sabemos y acompañar al propietario en las decisiones que afectan a su coche. A veces la mejor solución es una intervención importante. Otras veces es hacer menos, conservar más y esperar al momento adecuado.',
      'Esa relación cercana es una parte esencial de Valentin Motors. Queremos que quien entre en cualquiera de nuestros talleres encuentre a personas que conocen su Porsche, escuchan lo que necesita y se responsabilizan del trabajo hasta el final.',
    ],
  },
  futuro: {
    titulo: 'Lo mejor de nuestra historia es lo que viene.',
    parrafos: [
      'Empezamos en 1979 con los Porsche que se disfrutaban tanto en carretera como en circuito. Hoy trabajamos con clásicos, deportivos modernos, vehículos de competición y proyectos construidos alrededor de una idea única.',
      'Tenemos más conocimientos, más recursos y dos centros desde los que atender a nuestros clientes. Pero mantenemos lo que nos hizo empezar: la curiosidad por entender cada coche y la exigencia de hacer bien nuestro trabajo.',
    ],
    firma: 'Con Jordi Edo al frente, Olga Ibán y todo nuestro equipo, seguimos construyendo el siguiente capítulo de Valentin Motors.',
    lema: 'Valentin Motors. Especialistas Porsche desde 1979.',
    cta: 'Hablemos de tu Porsche',
  },
};

export type TextosNosotros = typeof es;

const en: TextosNosotros = {
  apertura: {
    etiqueta: 'About us',
    titulo: 'Since 1979.<br>And always looking ahead.',
    lema: 'We are Valentin Motors. Porsche specialists since 1979.',
    parrafos: [
      'We were born in Barcelona, at a time when a Porsche 911 could take you to work from Monday to Friday and race on a circuit at the weekend. We started by preparing cars for drivers who asked more of their mechanics. That way of understanding the automobile is still part of who we are.',
      'The models, the technology and the premises have changed. We have evolved too. Today, <strong>led by Jordi Edo</strong>, we are a team specialising in servicing, repair, restoration, performance preparation and bespoke projects for Porsche cars of every generation.',
      'We work from <strong>Barcelona and Madrid</strong> with a very clear idea: to know every car in depth, to look after every detail and to give its owner a service that lives up to what they drive.',
      'More than 45 years on, we keep doing what we do best. And we keep thinking about everything that is still to come.',
    ],
    fotoAlt: 'The Valentin Motors team in front of the engine room',
  },
  origenes: {
    etiqueta: 'Our origins',
    titulo: 'It all began with a way of understanding mechanics.',
    parrafos: [
      'In <strong>1979</strong>, Valentín Ibán founded Valentin Motors in Barcelona. The Porsche 911 and 914 defined our early years, with work centred on performance preparation, competition mechanics and the pursuit of the best possible performance.',
      'Racing taught us to work with precision, to understand how every component behaves and never to settle for something that simply works. We learned to look for the reason behind every problem and the best way to solve it.',
      'From there, our workshop grew with the cars and with our clients. We went from preparing sports cars for road and track to looking after new Porsche generations, adding more specialities and taking on ever more complete restoration projects.',
    ],
    cierre: 'Our origins lie in mechanics. Our way of working, in knowledge.',
    fotoAlt: 'Valentín Ibán, founder of Valentin Motors',
    fotoPie: 'Valentín Ibán · Founder, 1979',
  },
  generacion: {
    etiqueta: 'A second generation, a new chapter',
    titulo: 'What we have learned lets us go further.',
    parrafos: [
      'We are a family business, and proud of it. But our story is not only about preserving a legacy. It is about taking it forward.',
      'With <strong>Jordi Edo leading Valentin Motors</strong>, we have opened a new chapter of growth and specialisation. We have enlarged our premises, added new technical capabilities, developed our own projects and taken our way of working beyond Barcelona with the opening in Madrid.',
      'We love the Porsche cars that deserve to be kept exactly as they were conceived just as much as those that can be transformed to answer a new idea. We care about the history of the marque, but also about its present and its future possibilities.',
      'That is why we keep investing in people, spaces and knowledge. Because experience is only worth something if it helps us do the next job better.',
    ],
    jordi: {
      cargo: 'Leadership and vision',
      parrafos: [
        'Jordi heads Valentin Motors and leads the growth of the company. His aim is for us to remain a close, personal specialist, with the know-how of a long-established workshop and the capabilities needed to meet the challenges of today’s Porsche cars.',
        'Under his leadership we have expanded to Madrid, renewed our premises in Barcelona and built an offer that ranges from everyday servicing to complete restorations, performance preparation and one-off projects.',
        'His way of understanding Valentin Motors rests on a conviction we all share: every car has a story, every owner has expectations, and our job is to find the best answer for both.',
      ],
    },
    olga: {
      cargo: 'Continuity, trust and attention to detail',
      parrafos: [
        'Olga belongs to the second generation of Valentin Motors and, together with Jordi, has guided our evolution for years. She knows the workshop, our processes and, above all, the value of the relationship we keep with every client.',
        'In servicing, restoration or preparation work, listening, planning properly and keeping clear communication throughout the process matter as much as the technical work itself. That personal attention is part of our identity, and Olga helps us preserve it as we grow.',
      ],
    },
    equipo: {
      titulo: 'Our team',
      lema: 'Knowledge is built together.',
      parrafos: [
        'Every project involves professionals with different specialities: diagnostics, mechanics, engines, bodywork, paint, restoration and preparation. We share information, compare solutions and work towards a common goal: that every Porsche leaves our premises as it should.',
        'Premises matter. So does technology. But it is people, and the judgement they bring to their work, that make the difference.',
      ],
    },
  },
  talleres: {
    etiqueta: 'The workshops that brought us here',
    titulo: 'Barcelona is where we began. Madrid, a natural step in our evolution.',
    entradilla: 'We have grown without straying from who we are. Each new site answered a specific need: more space, more specialities or being closer to our clients.',
    lista: [
      {
        nombre: 'Passatge Simó, Barcelona',
        lema: 'Where we consolidated our specialisation.',
        parrafos: [
          'Our workshop at <strong>Passatge Simó, 14</strong> is part of the history of Valentin Motors. There we kept developing the work that had made our name: Porsche mechanics, performance preparation and a direct relationship with the owners who placed their cars in our hands.',
          'Those were years in which we strengthened our experience, broadened our activity and built many of the relationships that have stayed with the company for decades.',
        ],
      },
      {
        nombre: 'Gran Via de les Corts Catalanes, Barcelona',
        lema: 'A new scale for our workshop.',
        parrafos: [
          'At <strong>Gran Via de les Corts Catalanes, 752</strong> our evolution continued. It was a period of growth in which the servicing of everyday Porsche cars, high-performance mechanics and restoration and preparation projects worked side by side.',
          'For years, Gran Via was the meeting point for our team and for clients who shared the same passion for Porsche.',
        ],
      },
      {
        nombre: 'Madrid, Leganés',
        lema: 'In 2023 we opened our second centre.',
        parrafos: [
          'Opening Valentin Motors Madrid, at <strong>calle Puig Adam, 10, Leganés</strong>, was one of the most important steps in our recent history.',
          'We wanted to be closer to Porsche owners in Madrid and central Spain, without them having to travel to Barcelona for our experience and our services. We did it by taking the same way of working with us: direct attention, technical specialisation and care for every vehicle.',
          'Madrid is not a secondary branch of Valentin Motors. It is an essential part of who we are today.',
        ],
      },
      {
        nombre: 'Varsòvia, Barcelona',
        lema: 'In 2025 we began a new chapter in our city.',
        parrafos: [
          'We moved to <strong>calle Varsòvia, 65</strong>, to new premises of <strong>1,320 m² over two floors</strong>, where we brought together more resources, better-organised processes and new capabilities, including bodywork and paint.',
          'The new workshop reflects our ambition: to keep growing, to take on more complex projects and to offer our clients a better experience without losing the personal touch that has always defined us.',
        ],
      },
    ],
    cierre: 'Today, <strong>Barcelona and Madrid work with the same philosophy and the same standards</strong>.',
  },
  especialidades: {
    etiqueta: 'Porsche specialists, from start to finish',
    titulo: 'One world. Many ways to enjoy it.',
    parrafos: [
      'For us, no two Porsche cars are the same. The generation changes, the use changes, the car’s history changes and so does what its owner expects. That is why we never work with ready-made answers.',
      'We set out to know every model and to work on it with the judgement it needs:',
    ],
    lista: [
      { titulo: 'Servicing and diagnostics', texto: 'We look after the running and reliability of every Porsche, classic or modern, with specific inspections, diagnostics and repairs.' },
      { titulo: 'Engines and transmissions', texto: 'We inspect, repair and rebuild mechanical assemblies with the rigour each Porsche generation demands.' },
      { titulo: 'Complete restoration', texto: 'We bring cars back with a complete view of the project, from the mechanics and the body to the finishes and the original details.' },
      { titulo: 'Bodywork and paint', texto: 'We work on both the recovery and the finish of every vehicle, respecting its character and its needs.' },
      { titulo: 'Performance preparation and personalisation', texto: 'We develop solutions for owners who want to adapt their car to a specific use or make it truly their own.' },
      { titulo: 'Vehicle selection', texto: 'We support the buying and selling of Porsche cars with the technical knowledge we gain every day in the workshop.' },
    ],
    cierre: 'We can take care of scheduled servicing, solve a complex fault or see through a transformation that lasts months. In every case we apply the same philosophy: <strong>do what the car needs, do it well and explain why</strong>.',
  },
  proyectos: {
    etiqueta: 'From respect for history to our own projects',
    titulo: 'A Porsche can have many lives.',
    parrafos: [
      'We are passionate about the Porsche cars that keep their original personality intact. Also about those that return to the road after a meticulous restoration, and those transformed to answer their owner’s vision.',
      'The experience we have gathered over decades lets us approach these projects from a complete perspective. It is not only about choosing materials or improving performance. You have to understand the engineering of the car, respect its proportions, anticipate how it will behave and look after every element of the whole.',
      'The <strong>PA10/01</strong>, unveiled in 2025, represents this side of Valentin Motors: our ability to reinterpret a Porsche 911 in a language of our own, combining experience, technique and a contemporary view of the automobile.',
      'We will keep restoring, servicing and preparing Porsche cars. And we will keep exploring new ways to take our knowledge a little further.',
    ],
    enlace: 'Discover the PA10/01',
    fotoAlt: 'The PA10/01 in profile',
  },
  hitos: {
    etiqueta: 'Milestones in our history',
    titulo: 'More than four decades of constant evolution.',
    lista: [
      ['1979', 'We are founded in Barcelona and begin to specialise in road and competition Porsche 911 and 914 models.'],
      ['1980s', 'We grow around performance preparation, mechanics and engine work.'],
      ['Passatge Simó', 'We consolidate our activity at the Passatge Simó, 14 workshop, and our relationship with Porsche owners in Barcelona.'],
      ['2009', 'Jordi Edo and Olga Ibán begin a new chapter at the head of Valentin Motors.'],
      ['Gran Via', 'Our story continues at the workshop on Gran Via de les Corts Catalanes, 752.'],
      ['2023', 'We open Valentin Motors Madrid in Leganés and bring our services closer to clients in central Spain.'],
      ['2024', 'We celebrate our first 45 years.'],
      ['2025', 'We open the new Barcelona workshop at Varsòvia, 65, with more space and new capabilities.'],
      ['2025', 'We unveil the PA10/01, our complete reinterpretation of the Porsche 911.'],
      ['Today', 'Led by Jordi and with a specialist team in Barcelona and Madrid, we keep writing our story.'],
    ],
  },
  relacion: {
    etiqueta: 'A relationship that goes far beyond the workshop',
    titulo: 'We look after cars. And the trust of those who drive them.',
    parrafos: [
      'Many of our clients have been with us for years. Some have come to us with several Porsche cars; others trust us with a car they have kept all their lives. Every story is different, but all of them deserve the same attention.',
      'We believe in explaining things clearly, sharing what we know and supporting owners in the decisions that affect their car. Sometimes the best solution is major work. Other times it is doing less, preserving more and waiting for the right moment.',
      'That close relationship is an essential part of Valentin Motors. We want anyone who walks into either of our workshops to find people who know their Porsche, listen to what it needs and take responsibility for the work until the very end.',
    ],
  },
  futuro: {
    titulo: 'The best part of our story is what comes next.',
    parrafos: [
      'We started in 1979 with Porsche cars that were enjoyed as much on the road as on the track. Today we work on classics, modern sports cars, competition cars and projects built around a unique idea.',
      'We have more knowledge, more resources and two centres from which to serve our clients. But we keep what made us start: the curiosity to understand every car and the determination to do our work well.',
    ],
    firma: 'With Jordi Edo at the helm, Olga Ibán and our whole team, we keep building the next chapter of Valentin Motors.',
    lema: 'Valentin Motors. Porsche specialists since 1979.',
    cta: 'Talk to us about your Porsche',
  },
};

const fr: TextosNosotros = {
  apertura: {
    etiqueta: 'À propos',
    titulo: 'Depuis 1979.<br>Et toujours tournés vers l’avenir.',
    lema: 'Nous sommes Valentin Motors. Spécialistes Porsche depuis 1979.',
    parrafos: [
      'Nous sommes nés à Barcelone, à une époque où une Porsche 911 pouvait vous conduire au travail du lundi au vendredi et courir sur circuit le week-end. Nous avons commencé par préparer des voitures pour ceux qui exigeaient davantage de leur mécanique. Cette manière de comprendre l’automobile fait toujours partie de nous.',
      'Les modèles, les technologies et les locaux ont changé. Nous avons évolué, nous aussi. Aujourd’hui, <strong>sous la direction de Jordi Edo</strong>, nous sommes une équipe spécialisée dans l’entretien, la réparation, la restauration, la préparation et les projets sur mesure pour des Porsche de toutes les générations.',
      'Nous travaillons depuis <strong>Barcelone et Madrid</strong> avec une idée très claire : connaître chaque voiture en profondeur, soigner chaque détail et offrir à son propriétaire un service à la hauteur de ce qu’il conduit.',
      'Plus de 45 ans plus tard, nous continuons à faire ce que nous savons faire de mieux. Et nous continuons à penser à tout ce qui reste à venir.',
    ],
    fotoAlt: 'L’équipe de Valentin Motors devant la salle des moteurs',
  },
  origenes: {
    etiqueta: 'Nos origines',
    titulo: 'Tout a commencé par une façon de comprendre la mécanique.',
    parrafos: [
      'En <strong>1979</strong>, Valentín Ibán fonde Valentin Motors à Barcelone. Les Porsche 911 et 914 sont au cœur de nos premières années, avec un travail centré sur la préparation sportive, la mécanique de compétition et la recherche de la meilleure performance.',
      'La compétition nous a appris à travailler avec précision, à comprendre le comportement de chaque composant et à ne jamais nous contenter de ce qui fonctionne simplement. Nous avons appris à chercher la cause de chaque problème et la meilleure façon de le résoudre.',
      'À partir de là, notre atelier a grandi avec les voitures et avec les clients. Nous sommes passés de la préparation de sportives pour la route et le circuit à l’entretien de nouvelles générations de Porsche, en ajoutant des spécialités et en abordant des projets de restauration toujours plus complets.',
    ],
    cierre: 'Notre origine est dans la mécanique. Notre façon de travailler, dans la connaissance.',
    fotoAlt: 'Valentín Ibán, fondateur de Valentin Motors',
    fotoPie: 'Valentín Ibán · Fondateur, 1979',
  },
  generacion: {
    etiqueta: 'Une deuxième génération, une nouvelle étape',
    titulo: 'Ce que nous avons appris nous permet d’aller plus loin.',
    parrafos: [
      'Nous sommes une entreprise familiale, et nous en sommes fiers. Mais notre histoire ne se résume pas à préserver un héritage. Elle consiste à le faire évoluer.',
      'Avec <strong>Jordi Edo à la tête de Valentin Motors</strong>, nous avons ouvert une nouvelle étape de croissance et de spécialisation. Nous avons agrandi nos locaux, intégré de nouvelles compétences techniques, développé nos propres projets et porté notre façon de travailler au-delà de Barcelone avec l’ouverture de Madrid.',
      'Nous aimons autant les Porsche qui méritent d’être conservées exactement telles qu’elles ont été conçues que celles qui peuvent se transformer pour répondre à une idée nouvelle. L’histoire de la marque nous intéresse, mais aussi son présent et ses possibilités d’avenir.',
      'C’est pourquoi nous continuons à investir dans les personnes, les lieux et la connaissance. Car l’expérience n’a de valeur que si elle nous aide à mieux faire le travail suivant.',
    ],
    jordi: {
      cargo: 'Direction et vision d’avenir',
      parrafos: [
        'Jordi dirige Valentin Motors et conduit la croissance de l’entreprise. Son objectif : que nous restions un spécialiste proche, avec le savoir d’un atelier de toujours et les moyens nécessaires pour relever les défis des Porsche actuelles.',
        'Sous sa direction, nous nous sommes implantés à Madrid, avons renouvelé nos installations de Barcelone et développé une offre qui va de l’entretien courant aux restaurations complètes, aux préparations sportives et aux projets singuliers.',
        'Sa vision de Valentin Motors part d’une conviction que nous partageons tous : chaque voiture a une histoire, chaque propriétaire a des attentes, et notre travail consiste à trouver la meilleure réponse pour les deux.',
      ],
    },
    olga: {
      cargo: 'Continuité, confiance et souci du détail',
      parrafos: [
        'Olga fait partie de la deuxième génération de Valentin Motors et, aux côtés de Jordi, accompagne notre évolution depuis des années. Elle connaît l’atelier, nos processus et, surtout, la valeur de la relation que nous entretenons avec chaque client.',
        'Dans un travail d’entretien, de restauration ou de préparation, savoir écouter, bien planifier et communiquer clairement tout au long du processus compte autant que l’intervention technique. Cette attention personnelle fait partie de notre identité, et Olga nous aide à la préserver à mesure que nous grandissons.',
      ],
    },
    equipo: {
      titulo: 'Notre équipe',
      lema: 'La connaissance se construit ensemble.',
      parrafos: [
        'Chaque projet réunit des professionnels aux spécialités différentes : diagnostic, mécanique, moteurs, carrosserie, peinture, restauration et préparation. Nous partageons l’information, confrontons les solutions et travaillons vers un objectif commun : que chaque Porsche quitte nos ateliers comme elle le doit.',
        'Les installations comptent. La technologie aussi. Mais ce sont les personnes, et le discernement avec lequel elles travaillent, qui font la différence.',
      ],
    },
  },
  talleres: {
    etiqueta: 'Les ateliers qui nous ont menés jusqu’ici',
    titulo: 'Barcelone est notre origine. Madrid, une étape naturelle de notre évolution.',
    entradilla: 'Nous avons grandi sans nous éloigner de notre essence. Chaque nouveau site a répondu à un besoin précis : plus d’espace, davantage de spécialités ou plus de proximité avec nos clients.',
    lista: [
      {
        nombre: 'Passatge Simó, Barcelone',
        lema: 'Là où nous avons consolidé notre spécialisation.',
        parrafos: [
          'Notre atelier du <strong>Passatge Simó, 14</strong> fait partie de l’histoire de Valentin Motors. Nous y avons poursuivi le travail qui nous avait fait connaître : la mécanique Porsche, la préparation sportive et une relation directe avec les propriétaires qui nous confiaient leurs voitures.',
          'Ce furent des années où nous avons renforcé notre expérience, élargi notre activité et construit bon nombre des relations qui accompagnent l’entreprise depuis des décennies.',
        ],
      },
      {
        nombre: 'Gran Via de les Corts Catalanes, Barcelone',
        lema: 'Une nouvelle dimension pour notre atelier.',
        parrafos: [
          'Au <strong>752, Gran Via de les Corts Catalanes</strong>, notre évolution s’est poursuivie. Ce fut une période de croissance où se côtoyaient l’entretien de Porsche de tous les jours, la mécanique de hautes performances et les projets de restauration et de préparation.',
          'Pendant des années, Gran Via a été le point de rencontre de notre équipe et de clients qui partageaient la même passion pour Porsche.',
        ],
      },
      {
        nombre: 'Madrid, Leganés',
        lema: 'En 2023, nous avons ouvert notre deuxième centre.',
        parrafos: [
          'L’ouverture de Valentin Motors Madrid, <strong>calle Puig Adam, 10, à Leganés</strong>, a été l’une des étapes les plus importantes de notre histoire récente.',
          'Nous voulions être plus près des propriétaires de Porsche de Madrid et du centre de l’Espagne, sans qu’ils aient à se rendre à Barcelone pour profiter de notre expérience et de nos services. Nous l’avons fait en y apportant la même façon de travailler : un contact direct, une spécialisation technique et le soin de chaque véhicule.',
          'Madrid n’est pas une antenne secondaire de Valentin Motors. C’est une part essentielle de ce que nous sommes aujourd’hui.',
        ],
      },
      {
        nombre: 'Varsòvia, Barcelone',
        lema: 'En 2025, une nouvelle étape dans notre ville.',
        parrafos: [
          'Nous avons emménagé <strong>calle Varsòvia, 65</strong>, dans de nouveaux locaux de <strong>1 320 m² répartis sur deux niveaux</strong>, où nous réunissons davantage de moyens, une meilleure organisation des processus et de nouvelles compétences, dont la carrosserie et la peinture.',
          'Le nouvel atelier reflète notre ambition : continuer à grandir, répondre à des projets plus complexes et offrir une meilleure expérience à nos clients sans perdre le contact personnel qui nous a toujours caractérisés.',
        ],
      },
    ],
    cierre: 'Aujourd’hui, <strong>Barcelone et Madrid travaillent avec la même philosophie et la même exigence</strong>.',
  },
  especialidades: {
    etiqueta: 'Spécialistes Porsche, de bout en bout',
    titulo: 'Un seul univers. Mille façons d’en profiter.',
    parrafos: [
      'Pour nous, il n’y a pas deux Porsche identiques. La génération change, l’usage change, l’histoire de la voiture change, et ce qu’attend son propriétaire aussi. C’est pourquoi nous ne travaillons jamais avec des réponses toutes faites.',
      'Nous nous attachons à connaître chaque modèle et à intervenir avec le discernement qu’il exige :',
    ],
    lista: [
      { titulo: 'Entretien et diagnostic', texto: 'Nous veillons au bon fonctionnement et à la fiabilité de chaque Porsche, classique ou moderne, avec des révisions, des diagnostics et des réparations spécifiques.' },
      { titulo: 'Moteurs et transmissions', texto: 'Nous révisons, réparons et reconstruisons les ensembles mécaniques avec la rigueur qu’exige chaque génération de Porsche.' },
      { titulo: 'Restauration complète', texto: 'Nous remettons les voitures en état avec une vision globale du projet, de la mécanique et de la carrosserie jusqu’aux finitions et aux détails d’origine.' },
      { titulo: 'Carrosserie et peinture', texto: 'Nous intervenons aussi bien sur la remise en état que sur la finition de chaque véhicule, dans le respect de son caractère et de ses besoins.' },
      { titulo: 'Préparation sportive et personnalisation', texto: 'Nous développons des solutions pour ceux qui veulent adapter leur voiture à un usage précis ou la rendre véritablement personnelle.' },
      { titulo: 'Sélection de véhicules', texto: 'Nous accompagnons l’achat et la vente de Porsche avec la connaissance technique que nous acquérons chaque jour à l’atelier.' },
    ],
    cierre: 'Nous pouvons prendre en charge un entretien programmé, résoudre une panne complexe ou accompagner une transformation de plusieurs mois. Dans tous les cas, la même philosophie : <strong>faire ce dont la voiture a besoin, le faire bien et expliquer pourquoi</strong>.',
  },
  proyectos: {
    etiqueta: 'Du respect de l’histoire aux projets maison',
    titulo: 'Une Porsche peut avoir plusieurs vies.',
    parrafos: [
      'Nous sommes passionnés par les Porsche qui conservent intacte leur personnalité d’origine. Mais aussi par celles qui reprennent la route après une restauration minutieuse, et par celles qui se transforment pour répondre à la vision de leur propriétaire.',
      'L’expérience accumulée au fil des décennies nous permet d’aborder ces projets dans leur globalité. Il ne s’agit pas seulement de choisir des matériaux ou d’améliorer les performances. Il faut comprendre l’ingénierie de la voiture, respecter ses proportions, anticiper son comportement et soigner chaque élément de l’ensemble.',
      'La <strong>PA10/01</strong>, présentée en 2025, incarne cette facette de Valentin Motors : notre capacité à réinterpréter une Porsche 911 avec un langage propre, alliant expérience, technique et vision contemporaine de l’automobile.',
      'Nous continuerons à restaurer, entretenir et préparer des Porsche. Et nous continuerons à explorer de nouvelles façons de porter notre savoir un peu plus loin.',
    ],
    enlace: 'Découvrir la PA10/01',
    fotoAlt: 'La PA10/01, de profil',
  },
  hitos: {
    etiqueta: 'Les grandes étapes de notre histoire',
    titulo: 'Plus de quatre décennies d’évolution constante.',
    lista: [
      ['1979', 'Naissance à Barcelone et premiers pas dans la spécialisation sur les Porsche 911 et 914 de route et de compétition.'],
      ['Années 80', 'Nous grandissons autour de la préparation sportive, de la mécanique et du travail des moteurs.'],
      ['Passatge Simó', 'Nous consolidons notre activité dans l’atelier du Passatge Simó, 14, et notre relation avec les propriétaires de Porsche de Barcelone.'],
      ['2009', 'Jordi Edo et Olga Ibán ouvrent une nouvelle étape à la tête de Valentin Motors.'],
      ['Gran Via', 'Notre parcours se poursuit dans l’atelier du 752, Gran Via de les Corts Catalanes.'],
      ['2023', 'Ouverture de Valentin Motors Madrid à Leganés, au plus près des clients du centre de l’Espagne.'],
      ['2024', 'Nous fêtons nos 45 premières années.'],
      ['2025', 'Inauguration du nouvel atelier de Barcelone, Varsòvia, 65, avec plus d’espace et de nouvelles compétences.'],
      ['2025', 'Présentation de la PA10/01, notre réinterprétation complète de la Porsche 911.'],
      ['Aujourd’hui', 'Avec Jordi à notre tête et une équipe spécialisée à Barcelone et à Madrid, nous continuons d’écrire notre histoire.'],
    ],
  },
  relacion: {
    etiqueta: 'Une relation qui va bien au-delà de l’atelier',
    titulo: 'Nous prenons soin des voitures. Et de la confiance de ceux qui les conduisent.',
    parrafos: [
      'Beaucoup de nos clients sont avec nous depuis des années. Certains sont passés chez nous avec plusieurs Porsche ; d’autres nous confient une voiture qu’ils ont gardée toute leur vie. Chaque histoire est différente, mais toutes méritent la même attention.',
      'Nous croyons qu’il faut expliquer les choses clairement, partager ce que nous savons et accompagner le propriétaire dans les décisions qui concernent sa voiture. Parfois, la meilleure solution est une intervention importante. D’autres fois, c’est faire moins, conserver davantage et attendre le bon moment.',
      'Cette relation de proximité est une part essentielle de Valentin Motors. Nous voulons que quiconque entre dans l’un de nos ateliers y trouve des personnes qui connaissent sa Porsche, écoutent ce dont elle a besoin et assument le travail jusqu’au bout.',
    ],
  },
  futuro: {
    titulo: 'Le meilleur de notre histoire reste à venir.',
    parrafos: [
      'Nous avons commencé en 1979 avec des Porsche que l’on appréciait autant sur la route que sur circuit. Aujourd’hui, nous travaillons sur des classiques, des sportives modernes, des voitures de compétition et des projets construits autour d’une idée unique.',
      'Nous avons plus de connaissances, plus de moyens et deux centres pour accueillir nos clients. Mais nous gardons ce qui nous a fait commencer : la curiosité de comprendre chaque voiture et l’exigence de bien faire notre travail.',
    ],
    firma: 'Avec Jordi Edo à notre tête, Olga Ibán et toute notre équipe, nous continuons d’écrire le prochain chapitre de Valentin Motors.',
    lema: 'Valentin Motors. Spécialistes Porsche depuis 1979.',
    cta: 'Parlons de votre Porsche',
  },
};

const it: TextosNosotros = {
  apertura: {
    etiqueta: 'Chi siamo',
    titulo: 'Dal 1979.<br>E sempre con lo sguardo avanti.',
    lema: 'Siamo Valentin Motors. Specialisti Porsche dal 1979.',
    parrafos: [
      'Siamo nati a Barcellona, in un’epoca in cui una Porsche 911 poteva portarti al lavoro dal lunedì al venerdì e correre in pista nel fine settimana. Abbiamo iniziato preparando auto per chi pretendeva qualcosa in più dalla propria meccanica. Quel modo di intendere l’automobile fa ancora parte di noi.',
      'Sono cambiati i modelli, le tecnologie e le sedi. Anche noi ci siamo evoluti. Oggi, <strong>con Jordi Edo alla guida</strong>, siamo un team specializzato in manutenzione, riparazione, restauro, preparazione e progetti su misura per Porsche di ogni generazione.',
      'Lavoriamo da <strong>Barcellona e Madrid</strong> con un’idea molto chiara: conoscere ogni auto a fondo, curare ogni dettaglio e offrire al suo proprietario un servizio all’altezza di ciò che guida.',
      'Più di 45 anni dopo, continuiamo a fare ciò che sappiamo fare meglio. E continuiamo a pensare a tutto ciò che deve ancora venire.',
    ],
    fotoAlt: 'Il team di Valentin Motors davanti alla sala motori',
  },
  origenes: {
    etiqueta: 'Le nostre origini',
    titulo: 'Tutto è iniziato da un modo di intendere la meccanica.',
    parrafos: [
      'Nel <strong>1979</strong> Valentín Ibán fonda Valentin Motors a Barcellona. Le Porsche 911 e 914 sono le protagoniste dei nostri primi anni, con un lavoro concentrato sulla preparazione sportiva, sulla meccanica da competizione e sulla ricerca delle migliori prestazioni.',
      'Le corse ci hanno insegnato a lavorare con precisione, a capire il comportamento di ogni componente e a non accontentarci di qualcosa che semplicemente funziona. Abbiamo imparato a cercare il perché di ogni problema e il modo migliore per risolverlo.',
      'Da lì la nostra officina è cresciuta insieme alle auto e ai clienti. Siamo passati dal preparare sportive per strada e pista a seguire nuove generazioni di Porsche, aggiungendo specialità e affrontando progetti di restauro sempre più completi.',
    ],
    cierre: 'La nostra origine è nella meccanica. Il nostro modo di lavorare, nella conoscenza.',
    fotoAlt: 'Valentín Ibán, fondatore di Valentin Motors',
    fotoPie: 'Valentín Ibán · Fondatore, 1979',
  },
  generacion: {
    etiqueta: 'Una seconda generazione, una nuova fase',
    titulo: 'Ciò che abbiamo imparato ci permette di andare più lontano.',
    parrafos: [
      'Siamo un’azienda di famiglia, e ne siamo orgogliosi. Ma la nostra storia non consiste soltanto nel conservare un’eredità. Consiste nel farla evolvere.',
      'Con <strong>Jordi Edo alla guida di Valentin Motors</strong> abbiamo avviato una nuova fase di crescita e specializzazione. Abbiamo ampliato le nostre sedi, aggiunto nuove capacità tecniche, sviluppato progetti propri e portato il nostro modo di lavorare oltre Barcellona con l’apertura di Madrid.',
      'Amiamo allo stesso modo le Porsche che meritano di essere conservate esattamente come sono state concepite e quelle che possono trasformarsi per rispondere a un’idea nuova. Ci interessa la storia del marchio, ma anche il suo presente e le sue possibilità future.',
      'Per questo continuiamo a investire in persone, spazi e conoscenza. Perché l’esperienza ha valore solo se ci aiuta a fare meglio il lavoro successivo.',
    ],
    jordi: {
      cargo: 'Direzione e visione',
      parrafos: [
        'Jordi è alla guida di Valentin Motors e ne dirige la crescita. Il suo obiettivo è che restiamo uno specialista vicino ai clienti, con il sapere di un’officina di una volta e le capacità necessarie per affrontare le sfide delle Porsche di oggi.',
        'Sotto la sua direzione abbiamo esteso la nostra presenza a Madrid, rinnovato la sede di Barcellona e sviluppato un’offerta che va dalla manutenzione quotidiana ai restauri completi, alle preparazioni sportive e ai progetti unici.',
        'Il suo modo di intendere Valentin Motors nasce da una convinzione che condividiamo tutti: ogni auto ha una storia, ogni proprietario ha delle aspettative e il nostro lavoro consiste nel trovare la risposta migliore per entrambi.',
      ],
    },
    olga: {
      cargo: 'Continuità, fiducia e cura del dettaglio',
      parrafos: [
        'Olga fa parte della seconda generazione di Valentin Motors e, insieme a Jordi, ha accompagnato la nostra evoluzione per anni. Conosce l’officina, i nostri processi e soprattutto il valore del rapporto che manteniamo con ogni cliente.',
        'In un lavoro di manutenzione, restauro o preparazione, saper ascoltare, pianificare correttamente e comunicare con chiarezza durante tutto il processo conta quanto l’intervento tecnico. Questa attenzione personale fa parte della nostra identità, e Olga ci aiuta a preservarla mentre cresciamo.',
      ],
    },
    equipo: {
      titulo: 'Il nostro team',
      lema: 'La conoscenza si costruisce insieme.',
      parrafos: [
        'In ogni progetto intervengono professionisti con specialità diverse: diagnosi, meccanica, motori, carrozzeria, verniciatura, restauro e preparazione. Condividiamo informazioni, confrontiamo soluzioni e lavoriamo con un obiettivo comune: che ogni Porsche esca dalle nostre officine come deve uscire.',
        'Le strutture sono importanti. La tecnologia anche. Ma sono le persone, e il criterio con cui lavorano, a fare la differenza.',
      ],
    },
  },
  talleres: {
    etiqueta: 'Le officine che ci hanno portato fin qui',
    titulo: 'Barcellona è la nostra origine. Madrid, un passo naturale nella nostra evoluzione.',
    entradilla: 'Siamo cresciuti senza allontanarci dalla nostra essenza. Ogni nuova sede ha risposto a un’esigenza concreta: più spazio, più specialità o una maggiore vicinanza ai clienti.',
    lista: [
      {
        nombre: 'Passatge Simó, Barcellona',
        lema: 'Dove abbiamo consolidato la nostra specializzazione.',
        parrafos: [
          'La nostra officina di <strong>Passatge Simó, 14</strong> fa parte della storia di Valentin Motors. Lì abbiamo continuato a sviluppare il lavoro che ci aveva fatto conoscere: meccanica Porsche, preparazione sportiva e un rapporto diretto con i proprietari che ci affidavano le loro auto.',
          'Furono anni in cui rafforzammo la nostra esperienza, ampliammo l’attività e costruimmo molti dei rapporti che accompagnano l’azienda da decenni.',
        ],
      },
      {
        nombre: 'Gran Via de les Corts Catalanes, Barcellona',
        lema: 'Una nuova dimensione per la nostra officina.',
        parrafos: [
          'In <strong>Gran Via de les Corts Catalanes, 752</strong> la nostra evoluzione è proseguita. Fu una fase di crescita in cui convivevano la manutenzione delle Porsche di tutti i giorni, la meccanica ad alte prestazioni e i progetti di restauro e preparazione.',
          'Per anni Gran Via è stata il punto d’incontro del nostro team e di clienti che condividevano la stessa passione per Porsche.',
        ],
      },
      {
        nombre: 'Madrid, Leganés',
        lema: 'Nel 2023 abbiamo aperto il nostro secondo centro.',
        parrafos: [
          'L’apertura di Valentin Motors Madrid, in <strong>calle Puig Adam, 10, a Leganés</strong>, è stata uno dei passi più importanti della nostra storia recente.',
          'Volevamo essere più vicini ai proprietari di Porsche di Madrid e del centro della Spagna, senza che dovessero spostarsi a Barcellona per accedere alla nostra esperienza e ai nostri servizi. Lo abbiamo fatto portando lì lo stesso modo di lavorare: rapporto diretto, specializzazione tecnica e cura per ogni vettura.',
          'Madrid non è una sede secondaria di Valentin Motors. È una parte essenziale di ciò che siamo oggi.',
        ],
      },
      {
        nombre: 'Varsòvia, Barcellona',
        lema: 'Nel 2025 una nuova fase nella nostra città.',
        parrafos: [
          'Ci siamo trasferiti in <strong>calle Varsòvia, 65</strong>, in una nuova sede di <strong>1.320 m² su due piani</strong>, dove abbiamo riunito più risorse, una migliore organizzazione dei processi e nuove capacità, tra cui i lavori di carrozzeria e verniciatura.',
          'La nuova officina riflette la nostra ambizione: continuare a crescere, rispondere a progetti più complessi e offrire ai clienti un’esperienza migliore senza perdere il rapporto personale che ci ha sempre contraddistinto.',
        ],
      },
    ],
    cierre: 'Oggi <strong>Barcellona e Madrid lavorano con la stessa filosofia e la stessa esigenza</strong>.',
  },
  especialidades: {
    etiqueta: 'Specialisti Porsche, dall’inizio alla fine',
    titulo: 'Un solo universo. Molti modi di viverlo.',
    parrafos: [
      'Per noi non esistono due Porsche uguali. Cambia la generazione, cambia l’uso, cambia la storia dell’auto e cambia ciò che si aspetta il suo proprietario. Per questo non lavoriamo mai con risposte automatiche.',
      'Ci dedichiamo a conoscere ogni modello e a intervenire con il criterio che richiede:',
    ],
    lista: [
      { titulo: 'Manutenzione e diagnosi', texto: 'Curiamo il funzionamento e l’affidabilità di ogni Porsche, classica o moderna, con controlli, diagnosi e riparazioni specifiche.' },
      { titulo: 'Motori e trasmissioni', texto: 'Revisioniamo, ripariamo e ricostruiamo i gruppi meccanici con il rigore che richiede ogni generazione di Porsche.' },
      { titulo: 'Restauro completo', texto: 'Recuperiamo le vetture con una visione completa del progetto, dalla meccanica e dalla carrozzeria fino alle finiture e ai dettagli originali.' },
      { titulo: 'Carrozzeria e verniciatura', texto: 'Lavoriamo sia sul recupero sia sulla finitura di ogni vettura, nel rispetto del suo carattere e delle sue esigenze.' },
      { titulo: 'Preparazione sportiva e personalizzazione', texto: 'Sviluppiamo soluzioni per chi vuole adattare la propria auto a un uso preciso o renderla davvero sua.' },
      { titulo: 'Selezione di vetture', texto: 'Accompagniamo l’acquisto e la vendita di Porsche con la conoscenza tecnica che acquisiamo ogni giorno in officina.' },
    ],
    cierre: 'Possiamo occuparci di una manutenzione programmata, risolvere un guasto complesso o seguire una trasformazione che dura mesi. In ogni caso applichiamo la stessa filosofia: <strong>fare ciò di cui l’auto ha bisogno, farlo bene e spiegare perché</strong>.',
  },
  proyectos: {
    etiqueta: 'Dal rispetto per la storia ai progetti propri',
    titulo: 'Una Porsche può avere molte vite.',
    parrafos: [
      'Ci appassionano le Porsche che conservano intatta la loro personalità originale. Ma anche quelle che tornano su strada dopo un restauro accurato e quelle che si trasformano per rispondere alla visione del loro proprietario.',
      'L’esperienza accumulata in decenni ci permette di affrontare questi progetti con uno sguardo completo. Non si tratta solo di scegliere materiali o migliorare le prestazioni. Bisogna capire l’ingegneria dell’auto, rispettarne le proporzioni, prevederne il comportamento e curare ogni elemento dell’insieme.',
      'La <strong>PA10/01</strong>, presentata nel 2025, rappresenta questo lato di Valentin Motors: la nostra capacità di reinterpretare una Porsche 911 con un linguaggio proprio, unendo esperienza, tecnica e una visione contemporanea dell’automobile.',
      'Continueremo a restaurare, mantenere e preparare Porsche. E continueremo a esplorare nuovi modi per portare la nostra conoscenza un po’ più lontano.',
    ],
    enlace: 'Scopri la PA10/01',
    fotoAlt: 'La PA10/01 di profilo',
  },
  hitos: {
    etiqueta: 'Le tappe della nostra storia',
    titulo: 'Oltre quattro decenni di evoluzione costante.',
    lista: [
      ['1979', 'Nasciamo a Barcellona e iniziamo a specializzarci nelle Porsche 911 e 914 da strada e da competizione.'],
      ['Anni ’80', 'Cresciamo intorno alla preparazione sportiva, alla meccanica e al lavoro sui motori.'],
      ['Passatge Simó', 'Consolidiamo la nostra attività nell’officina di Passatge Simó, 14, e il rapporto con i proprietari Porsche di Barcellona.'],
      ['2009', 'Jordi Edo e Olga Ibán avviano una nuova fase alla guida di Valentin Motors.'],
      ['Gran Via', 'Il nostro percorso prosegue nell’officina di Gran Via de les Corts Catalanes, 752.'],
      ['2023', 'Apriamo Valentin Motors Madrid a Leganés e avviciniamo i nostri servizi ai clienti del centro della Spagna.'],
      ['2024', 'Festeggiamo i nostri primi 45 anni.'],
      ['2025', 'Inauguriamo la nuova officina di Barcellona in Varsòvia, 65, con più spazio e nuove capacità.'],
      ['2025', 'Presentiamo la PA10/01, la nostra reinterpretazione integrale della Porsche 911.'],
      ['Oggi', 'Con Jordi alla guida e un team specializzato a Barcellona e Madrid, continuiamo a scrivere la nostra storia.'],
    ],
  },
  relacion: {
    etiqueta: 'Un rapporto che va ben oltre l’officina',
    titulo: 'Ci prendiamo cura delle auto. E della fiducia di chi le guida.',
    parrafos: [
      'Molti dei nostri clienti sono con noi da anni. Alcuni sono passati dalle nostre officine con diverse Porsche; altri ci affidano un’auto che hanno conservato per tutta la vita. Ogni storia è diversa, ma tutte meritano la stessa attenzione.',
      'Crediamo nello spiegare le cose con chiarezza, nel condividere ciò che sappiamo e nell’accompagnare il proprietario nelle decisioni che riguardano la sua auto. A volte la soluzione migliore è un intervento importante. Altre volte è fare meno, conservare di più e aspettare il momento giusto.',
      'Questo rapporto di vicinanza è una parte essenziale di Valentin Motors. Vogliamo che chi entra in una delle nostre officine trovi persone che conoscono la sua Porsche, ascoltano ciò di cui ha bisogno e si assumono la responsabilità del lavoro fino alla fine.',
    ],
  },
  futuro: {
    titulo: 'Il meglio della nostra storia deve ancora venire.',
    parrafos: [
      'Abbiamo iniziato nel 1979 con Porsche che si guidavano con lo stesso piacere su strada e in pista. Oggi lavoriamo su classiche, sportive moderne, auto da competizione e progetti costruiti intorno a un’idea unica.',
      'Abbiamo più conoscenze, più risorse e due centri da cui seguire i nostri clienti. Ma conserviamo ciò che ci ha fatto iniziare: la curiosità di capire ogni auto e l’esigenza di fare bene il nostro lavoro.',
    ],
    firma: 'Con Jordi Edo alla guida, Olga Ibán e tutto il nostro team, continuiamo a costruire il prossimo capitolo di Valentin Motors.',
    lema: 'Valentin Motors. Specialisti Porsche dal 1979.',
    cta: 'Ci parli della sua Porsche',
  },
};

const de: TextosNosotros = {
  apertura: {
    etiqueta: 'Über uns',
    titulo: 'Seit 1979.<br>Und immer mit Blick nach vorn.',
    lema: 'Wir sind Valentin Motors. Porsche-Spezialisten seit 1979.',
    parrafos: [
      'Wir sind in Barcelona entstanden, in einer Zeit, in der ein Porsche 911 einen von Montag bis Freitag zur Arbeit brachte und am Wochenende auf der Rennstrecke fuhr. Wir begannen damit, Fahrzeuge für Kunden vorzubereiten, die mehr von ihrer Technik verlangten. Diese Art, das Automobil zu verstehen, ist bis heute ein Teil von uns.',
      'Modelle, Technologien und Räumlichkeiten haben sich verändert. Auch wir haben uns weiterentwickelt. Heute sind wir <strong>unter der Leitung von Jordi Edo</strong> ein Team, das sich auf Wartung, Reparatur, Restaurierung, Fahrzeugaufbau und Projekte nach Maß für Porsche aller Generationen spezialisiert hat.',
      'Wir arbeiten in <strong>Barcelona und Madrid</strong> mit einer klaren Idee: jedes Fahrzeug genau zu kennen, auf jedes Detail zu achten und seinem Besitzer einen Service zu bieten, der dem gerecht wird, was er fährt.',
      'Mehr als 45 Jahre später tun wir weiterhin, was wir am besten können. Und wir denken weiter an alles, was noch kommt.',
    ],
    fotoAlt: 'Das Team von Valentin Motors vor dem Motorenraum',
  },
  origenes: {
    etiqueta: 'Unsere Anfänge',
    titulo: 'Alles begann mit einer Art, Technik zu verstehen.',
    parrafos: [
      '<strong>1979</strong> gründete Valentín Ibán Valentin Motors in Barcelona. Porsche 911 und 914 prägten unsere ersten Jahre: Sportvorbereitung, Rennsporttechnik und die Suche nach der besten Leistung.',
      'Der Rennsport hat uns gelehrt, präzise zu arbeiten, das Verhalten jedes Bauteils zu verstehen und uns nicht damit zufriedenzugeben, dass etwas einfach funktioniert. Wir haben gelernt, nach der Ursache jedes Problems zu suchen und nach dem besten Weg, es zu lösen.',
      'Von dort aus wuchs unsere Werkstatt mit den Fahrzeugen und mit den Kunden. Aus der Vorbereitung von Sportwagen für Straße und Rennstrecke wurde die Betreuung neuer Porsche-Generationen. Neue Fachbereiche kamen hinzu, und die Restaurierungsprojekte wurden immer umfassender.',
    ],
    cierre: 'Unser Ursprung liegt in der Technik. Unsere Arbeitsweise im Wissen.',
    fotoAlt: 'Valentín Ibán, Gründer von Valentin Motors',
    fotoPie: 'Valentín Ibán · Gründer, 1979',
  },
  generacion: {
    etiqueta: 'Eine zweite Generation, ein neues Kapitel',
    titulo: 'Was wir gelernt haben, lässt uns weiter gehen.',
    parrafos: [
      'Wir sind ein Familienunternehmen, und darauf sind wir stolz. Doch in unserer Geschichte geht es nicht nur darum, ein Erbe zu bewahren. Es geht darum, es weiterzuentwickeln.',
      'Mit <strong>Jordi Edo an der Spitze von Valentin Motors</strong> haben wir ein neues Kapitel des Wachstums und der Spezialisierung aufgeschlagen. Wir haben unsere Räumlichkeiten erweitert, neue technische Möglichkeiten geschaffen, eigene Projekte entwickelt und mit der Eröffnung in Madrid unsere Arbeitsweise über Barcelona hinausgetragen.',
      'Wir schätzen die Porsche, die es verdienen, genau so erhalten zu werden, wie sie konzipiert wurden, ebenso wie jene, die sich für eine neue Idee verwandeln lassen. Uns interessiert die Geschichte der Marke, aber auch ihre Gegenwart und ihre Zukunft.',
      'Deshalb investieren wir weiter in Menschen, Räume und Wissen. Denn Erfahrung hat nur dann einen Wert, wenn sie uns hilft, den nächsten Auftrag besser zu machen.',
    ],
    jordi: {
      cargo: 'Geschäftsführung und Zukunftsvision',
      parrafos: [
        'Jordi leitet Valentin Motors und führt das Wachstum des Unternehmens. Sein Ziel: dass wir ein nahbarer Spezialist bleiben, mit dem Wissen einer traditionsreichen Werkstatt und den Möglichkeiten, die die heutigen Porsche verlangen.',
        'Unter seiner Leitung sind wir nach Madrid gegangen, haben unsere Werkstatt in Barcelona erneuert und ein Angebot aufgebaut, das von der laufenden Wartung bis zu Komplettrestaurierungen, Sportvorbereitung und Einzelprojekten reicht.',
        'Sein Verständnis von Valentin Motors beruht auf einer Überzeugung, die wir alle teilen: Jedes Fahrzeug hat eine Geschichte, jeder Besitzer hat Erwartungen, und unsere Aufgabe ist es, für beide die beste Antwort zu finden.',
      ],
    },
    olga: {
      cargo: 'Kontinuität, Vertrauen und Liebe zum Detail',
      parrafos: [
        'Olga gehört zur zweiten Generation von Valentin Motors und begleitet unsere Entwicklung seit Jahren gemeinsam mit Jordi. Sie kennt die Werkstatt, unsere Abläufe und vor allem den Wert der Beziehung, die wir zu jedem Kunden pflegen.',
        'Bei Wartung, Restaurierung oder Fahrzeugaufbau ist es ebenso wichtig wie der technische Eingriff, zuzuhören, sorgfältig zu planen und während des gesamten Prozesses klar zu kommunizieren. Diese persönliche Betreuung gehört zu unserer Identität, und Olga hilft uns, sie zu bewahren, während wir wachsen.',
      ],
    },
    equipo: {
      titulo: 'Unser Team',
      lema: 'Wissen entsteht gemeinsam.',
      parrafos: [
        'An jedem Projekt arbeiten Fachleute mit unterschiedlichen Schwerpunkten: Diagnose, Mechanik, Motoren, Karosserie, Lack, Restaurierung und Fahrzeugaufbau. Wir teilen Informationen, wägen Lösungen ab und arbeiten auf ein gemeinsames Ziel hin: dass jeder Porsche unsere Werkstatt so verlässt, wie er sie verlassen soll.',
        'Räumlichkeiten sind wichtig. Technik auch. Doch den Unterschied machen die Menschen und das Urteilsvermögen, mit dem sie arbeiten.',
      ],
    },
  },
  talleres: {
    etiqueta: 'Die Werkstätten, die uns hierher gebracht haben',
    titulo: 'Barcelona ist unser Ursprung. Madrid ein natürlicher Schritt unserer Entwicklung.',
    entradilla: 'Wir sind gewachsen, ohne uns von unserem Kern zu entfernen. Jeder neue Standort war die Antwort auf einen konkreten Bedarf: mehr Platz, mehr Fachbereiche oder mehr Nähe zu unseren Kunden.',
    lista: [
      {
        nombre: 'Passatge Simó, Barcelona',
        lema: 'Hier haben wir unsere Spezialisierung gefestigt.',
        parrafos: [
          'Unsere Werkstatt im <strong>Passatge Simó 14</strong> ist Teil der Geschichte von Valentin Motors. Dort führten wir die Arbeit fort, die uns bekannt gemacht hatte: Porsche-Technik, Sportvorbereitung und ein direktes Verhältnis zu den Besitzern, die uns ihre Fahrzeuge anvertrauten.',
          'In diesen Jahren haben wir unsere Erfahrung gefestigt, unsere Tätigkeit ausgebaut und viele der Beziehungen geknüpft, die das Unternehmen seit Jahrzehnten begleiten.',
        ],
      },
      {
        nombre: 'Gran Via de les Corts Catalanes, Barcelona',
        lema: 'Eine neue Dimension für unsere Werkstatt.',
        parrafos: [
          'In der <strong>Gran Via de les Corts Catalanes 752</strong> ging unsere Entwicklung weiter. Es war eine Zeit des Wachstums, in der die Wartung alltäglich gefahrener Porsche, Hochleistungstechnik sowie Restaurierungs- und Aufbauprojekte nebeneinander bestanden.',
          'Jahrelang war die Gran Via der Treffpunkt unseres Teams und von Kunden, die dieselbe Leidenschaft für Porsche teilten.',
        ],
      },
      {
        nombre: 'Madrid, Leganés',
        lema: '2023 eröffneten wir unseren zweiten Standort.',
        parrafos: [
          'Die Eröffnung von Valentin Motors Madrid in der <strong>Calle Puig Adam 10 in Leganés</strong> war einer der wichtigsten Schritte unserer jüngeren Geschichte.',
          'Wir wollten den Porsche-Besitzern in Madrid und Zentralspanien näher sein, ohne dass sie für unsere Erfahrung und unseren Service nach Barcelona fahren müssen. Dafür haben wir dieselbe Arbeitsweise dorthin gebracht: direkte Betreuung, technische Spezialisierung und Sorgfalt bei jedem Fahrzeug.',
          'Madrid ist keine Nebenstelle von Valentin Motors. Es ist ein wesentlicher Teil dessen, was wir heute sind.',
        ],
      },
      {
        nombre: 'Varsòvia, Barcelona',
        lema: '2025 begann ein neues Kapitel in unserer Stadt.',
        parrafos: [
          'Wir sind in die <strong>Calle Varsòvia 65</strong> gezogen, in neue Räume mit <strong>1.320 m² auf zwei Etagen</strong>. Dort bündeln wir mehr Ressourcen, besser organisierte Abläufe und neue Möglichkeiten, darunter Karosserie und Lack.',
          'Die neue Werkstatt spiegelt unseren Anspruch wider: weiter zu wachsen, komplexere Projekte zu übernehmen und unseren Kunden ein besseres Erlebnis zu bieten, ohne die persönliche Betreuung zu verlieren, die uns immer ausgezeichnet hat.',
        ],
      },
    ],
    cierre: 'Heute <strong>arbeiten Barcelona und Madrid mit derselben Philosophie und demselben Anspruch</strong>.',
  },
  especialidades: {
    etiqueta: 'Porsche-Spezialisten, von Anfang bis Ende',
    titulo: 'Eine Welt. Viele Arten, sie zu genießen.',
    parrafos: [
      'Für uns gleicht kein Porsche dem anderen. Die Generation ändert sich, die Nutzung, die Geschichte des Fahrzeugs und das, was sein Besitzer erwartet. Deshalb arbeiten wir nie mit Standardantworten.',
      'Wir setzen alles daran, jedes Modell zu kennen und mit dem Urteilsvermögen einzugreifen, das es verlangt:',
    ],
    lista: [
      { titulo: 'Wartung und Diagnose', texto: 'Wir sorgen für Funktion und Zuverlässigkeit jedes Porsche, ob klassisch oder modern, mit gezielten Inspektionen, Diagnosen und Reparaturen.' },
      { titulo: 'Motoren und Getriebe', texto: 'Wir prüfen, reparieren und bauen mechanische Baugruppen mit der Sorgfalt neu auf, die jede Porsche-Generation verlangt.' },
      { titulo: 'Komplettrestaurierung', texto: 'Wir bauen Fahrzeuge mit Blick auf das gesamte Projekt wieder auf, von Mechanik und Karosserie bis zu den Oberflächen und Originaldetails.' },
      { titulo: 'Karosserie und Lack', texto: 'Wir arbeiten an der Instandsetzung ebenso wie am Finish jedes Fahrzeugs und respektieren dabei seinen Charakter und seine Bedürfnisse.' },
      { titulo: 'Sportvorbereitung und Individualisierung', texto: 'Wir entwickeln Lösungen für alle, die ihr Fahrzeug an einen bestimmten Einsatz anpassen oder es wirklich zu ihrem eigenen machen wollen.' },
      { titulo: 'Fahrzeugauswahl', texto: 'Wir begleiten Kauf und Verkauf von Porsche mit dem technischen Wissen, das wir jeden Tag in der Werkstatt sammeln.' },
    ],
    cierre: 'Wir übernehmen eine planmäßige Wartung, beheben einen komplexen Defekt oder begleiten einen Umbau, der Monate dauert. In jedem Fall gilt dieselbe Philosophie: <strong>tun, was das Fahrzeug braucht, es gut tun und erklären, warum</strong>.',
  },
  proyectos: {
    etiqueta: 'Vom Respekt vor der Geschichte zu eigenen Projekten',
    titulo: 'Ein Porsche kann viele Leben haben.',
    parrafos: [
      'Uns begeistern die Porsche, die ihre ursprüngliche Persönlichkeit unverändert bewahren. Ebenso jene, die nach einer sorgfältigen Restaurierung auf die Straße zurückkehren, und jene, die sich nach der Vision ihres Besitzers verwandeln.',
      'Die Erfahrung aus Jahrzehnten erlaubt uns, solche Projekte ganzheitlich anzugehen. Es geht nicht nur darum, Materialien auszuwählen oder die Leistung zu steigern. Man muss die Technik des Fahrzeugs verstehen, seine Proportionen respektieren, sein Verhalten vorhersehen und jedes Element des Ganzen beachten.',
      'Der <strong>PA10/01</strong>, 2025 vorgestellt, steht für diese Seite von Valentin Motors: unsere Fähigkeit, einen Porsche 911 in einer eigenen Sprache neu zu interpretieren, mit Erfahrung, Technik und einem zeitgemäßen Blick auf das Automobil.',
      'Wir werden weiter Porsche restaurieren, warten und aufbauen. Und wir werden weiter neue Wege suchen, unser Wissen ein Stück weiterzutragen.',
    ],
    enlace: 'Den PA10/01 entdecken',
    fotoAlt: 'Der PA10/01 in der Seitenansicht',
  },
  hitos: {
    etiqueta: 'Meilensteine unserer Geschichte',
    titulo: 'Mehr als vier Jahrzehnte stetiger Entwicklung.',
    lista: [
      ['1979', 'Gründung in Barcelona und erste Spezialisierung auf Porsche 911 und 914 für Straße und Rennsport.'],
      ['1980er', 'Wir wachsen mit Sportvorbereitung, Mechanik und Motorenarbeit.'],
      ['Passatge Simó', 'Wir festigen unsere Tätigkeit in der Werkstatt im Passatge Simó 14 und unsere Beziehung zu den Porsche-Besitzern in Barcelona.'],
      ['2009', 'Jordi Edo und Olga Ibán übernehmen die Leitung von Valentin Motors und schlagen ein neues Kapitel auf.'],
      ['Gran Via', 'Unser Weg führt weiter in die Werkstatt in der Gran Via de les Corts Catalanes 752.'],
      ['2023', 'Wir eröffnen Valentin Motors Madrid in Leganés und sind damit näher an unseren Kunden in Zentralspanien.'],
      ['2024', 'Wir feiern unsere ersten 45 Jahre.'],
      ['2025', 'Wir eröffnen die neue Werkstatt in Barcelona, Varsòvia 65, mit mehr Platz und neuen Möglichkeiten.'],
      ['2025', 'Wir stellen den PA10/01 vor, unsere umfassende Neuinterpretation des Porsche 911.'],
      ['Heute', 'Mit Jordi an der Spitze und einem spezialisierten Team in Barcelona und Madrid schreiben wir unsere Geschichte weiter.'],
    ],
  },
  relacion: {
    etiqueta: 'Eine Beziehung, die weit über die Werkstatt hinausgeht',
    titulo: 'Wir kümmern uns um Fahrzeuge. Und um das Vertrauen derer, die sie fahren.',
    parrafos: [
      'Viele unserer Kunden sind seit Jahren bei uns. Manche kamen mit mehreren Porsche zu uns; andere vertrauen uns ein Fahrzeug an, das sie ihr Leben lang behalten haben. Jede Geschichte ist anders, aber alle verdienen dieselbe Aufmerksamkeit.',
      'Wir halten es für richtig, die Dinge klar zu erklären, unser Wissen zu teilen und den Besitzer bei den Entscheidungen zu begleiten, die sein Fahrzeug betreffen. Manchmal ist ein großer Eingriff die beste Lösung. Manchmal ist es besser, weniger zu tun, mehr zu bewahren und auf den richtigen Moment zu warten.',
      'Diese enge Beziehung ist ein wesentlicher Teil von Valentin Motors. Wer eine unserer Werkstätten betritt, soll Menschen finden, die seinen Porsche kennen, zuhören, was er braucht, und bis zum Schluss für die Arbeit einstehen.',
    ],
  },
  futuro: {
    titulo: 'Das Beste an unserer Geschichte ist das, was noch kommt.',
    parrafos: [
      '1979 begannen wir mit Porsche, die auf der Straße ebenso Freude machten wie auf der Rennstrecke. Heute arbeiten wir an Klassikern, modernen Sportwagen, Rennfahrzeugen und Projekten, die um eine einzigartige Idee herum entstehen.',
      'Wir haben mehr Wissen, mehr Ressourcen und zwei Standorte, an denen wir unsere Kunden betreuen. Doch wir bewahren, was uns anfangen ließ: die Neugier, jedes Fahrzeug zu verstehen, und den Anspruch, unsere Arbeit gut zu machen.',
    ],
    firma: 'Mit Jordi Edo an der Spitze, Olga Ibán und unserem ganzen Team schreiben wir das nächste Kapitel von Valentin Motors.',
    lema: 'Valentin Motors. Porsche-Spezialisten seit 1979.',
    cta: 'Sprechen Sie mit uns über Ihren Porsche',
  },
};

const ca: TextosNosotros = {
  apertura: {
    etiqueta: 'Sobre nosaltres',
    titulo: 'Des del 1979.<br>I sempre mirant endavant.',
    lema: 'Som Valentin Motors. Especialistes Porsche des del 1979.',
    parrafos: [
      'Vam néixer a Barcelona, en una època en què un Porsche 911 et podia portar a la feina de dilluns a divendres i competir en un circuit el cap de setmana. Vam començar preparant cotxes per a qui exigia alguna cosa més de la seva mecànica. I aquesta manera d’entendre l’automòbil continua formant part de nosaltres.',
      'Han canviat els models, les tecnologies i les instal·lacions. Nosaltres també hem evolucionat. Avui, amb <strong>Jordi Edo al capdavant</strong>, som un equip especialitzat en manteniment, reparació, restauració, preparació i projectes a mida per a Porsche de diferents generacions.',
      'Treballem des de <strong>Barcelona i Madrid</strong> amb una idea molt clara: conèixer cada cotxe a fons, cuidar cada detall i oferir als seus propietaris un servei a l’altura del que condueixen.',
      'Més de 45 anys després, continuem fent el que millor sabem fer. I continuem pensant en tot el que ha de venir.',
    ],
    fotoAlt: 'L’equip de Valentin Motors davant de la sala de motors',
  },
  origenes: {
    etiqueta: 'Els nostres orígens',
    titulo: 'Tot va començar amb una manera d’entendre la mecànica.',
    parrafos: [
      'El <strong>1979</strong>, Valentín Ibán va posar en marxa Valentin Motors a Barcelona. Els Porsche 911 i 914 van ser els protagonistes dels nostres primers anys, amb feines centrades en la preparació esportiva, la mecànica de competició i la recerca del millor rendiment.',
      'La competició ens va ensenyar a treballar amb precisió, a comprendre el comportament de cada component i a no conformar-nos que una cosa simplement funcioni. Vam aprendre a buscar el perquè de cada problema i la millor manera de resoldre’l.',
      'A partir d’aquí, el nostre taller va anar creixent amb els cotxes i amb els clients. Vam passar de preparar esportius per a carretera i circuit a atendre noves generacions de Porsche, incorporar més especialitats i abordar projectes de restauració cada vegada més complets.',
    ],
    cierre: 'El nostre origen és la mecànica. La nostra manera de treballar, el coneixement.',
    fotoAlt: 'Valentín Ibán, fundador de Valentin Motors',
    fotoPie: 'Valentín Ibán · Fundador, 1979',
  },
  generacion: {
    etiqueta: 'Una segona generació, una nova etapa',
    titulo: 'El que hem après ens permet anar més lluny.',
    parrafos: [
      'Som una empresa familiar, i n’estem orgullosos. Però la nostra història no consisteix només a conservar un llegat. Consisteix a fer-lo evolucionar.',
      'Amb <strong>Jordi Edo liderant Valentin Motors</strong>, hem impulsat una nova etapa de creixement i especialització. Hem ampliat les instal·lacions, hem incorporat noves capacitats tècniques, hem desenvolupat projectes propis i hem portat la nostra manera de treballar més enllà de Barcelona amb l’obertura de Madrid.',
      'Ens agraden tant els Porsche que mereixen conservar-se exactament com van ser concebuts com els que es poden transformar per respondre a una idea nova. Ens interessa la història de la marca, però també el seu present i les seves possibilitats de futur.',
      'Per això continuem invertint en persones, espais i coneixement. Perquè l’experiència només té valor si ens ajuda a fer millor la feina següent.',
    ],
    jordi: {
      cargo: 'Direcció i visió de futur',
      parrafos: [
        'En Jordi és al capdavant de Valentin Motors i lidera el creixement de l’empresa. El seu objectiu és que continuem sent un especialista proper, amb el coneixement d’un taller de tota la vida i les capacitats necessàries per afrontar els reptes dels Porsche actuals.',
        'Sota la seva direcció hem ampliat la nostra presència a Madrid, hem renovat les instal·lacions de Barcelona i hem desenvolupat una proposta que va des del manteniment quotidià fins a les restauracions integrals, les preparacions esportives i els projectes singulars.',
        'La seva manera d’entendre Valentin Motors parteix d’una convicció que compartim tots: cada cotxe té una història, cada propietari té unes expectatives i la nostra feina consisteix a trobar la millor resposta per a tots dos.',
      ],
    },
    olga: {
      cargo: 'Continuïtat, confiança i atenció al detall',
      parrafos: [
        'L’Olga forma part de la segona generació de Valentin Motors i, al costat d’en Jordi, ha acompanyat la nostra evolució durant anys. Coneix el taller, els nostres processos i, sobretot, el valor de la relació que mantenim amb cada client.',
        'En una feina de manteniment, restauració o preparació, tan important com la intervenció tècnica és saber escoltar, planificar correctament i mantenir una comunicació clara durant tot el procés. Aquesta atenció personal forma part de la nostra identitat i és una cosa que l’Olga ens ajuda a preservar mentre creixem.',
      ],
    },
    equipo: {
      titulo: 'El nostre equip',
      lema: 'El coneixement es construeix entre tots.',
      parrafos: [
        'En cada projecte hi intervenen professionals amb especialitats diferents: diagnosi, mecànica, motors, carrosseria, pintura, restauració i preparació. Compartim informació, contrastem solucions i treballem amb un objectiu comú: que cada Porsche surti de les nostres instal·lacions com ha de sortir.',
        'Les instal·lacions són importants. La tecnologia també. Però són les persones, i el criteri amb què treballen, les que marquen la diferència.',
      ],
    },
  },
  talleres: {
    etiqueta: 'Els tallers que ens han portat fins aquí',
    titulo: 'Barcelona és el nostre origen. Madrid, un pas natural en la nostra evolució.',
    entradilla: 'Hem crescut sense allunyar-nos de la nostra essència. Cada nova instal·lació ha respost a una necessitat concreta: disposar de més espai, incorporar més especialitats o ser més a prop dels nostres clients.',
    lista: [
      {
        nombre: 'Passatge Simó, Barcelona',
        lema: 'On vam consolidar la nostra especialització.',
        parrafos: [
          'El nostre taller del <strong>Passatge Simó, 14</strong> forma part de la història de Valentin Motors. Allà vam continuar desenvolupant la feina que ens havia donat a conèixer: mecànica Porsche, preparació esportiva i una relació directa amb els propietaris que confiaven els seus cotxes a les nostres mans.',
          'Van ser anys en què vam reforçar la nostra experiència, vam ampliar l’activitat i vam construir moltes de les relacions que han acompanyat l’empresa durant dècades.',
        ],
      },
      {
        nombre: 'Gran Via de les Corts Catalanes, Barcelona',
        lema: 'Una nova dimensió per al nostre taller.',
        parrafos: [
          'A la <strong>Gran Via de les Corts Catalanes, 752</strong> vam continuar la nostra evolució. Va ser una etapa de creixement en què van conviure el manteniment de Porsche d’ús diari, la mecànica d’altes prestacions i els projectes de restauració i preparació.',
          'Durant anys, la Gran Via va ser el punt de trobada del nostre equip i de clients que compartien una mateixa passió per Porsche.',
        ],
      },
      {
        nombre: 'Madrid, Leganés',
        lema: 'El 2023 vam obrir el nostre segon centre.',
        parrafos: [
          'L’obertura de Valentin Motors Madrid, al <strong>carrer Puig Adam, 10, de Leganés</strong>, va ser un dels passos més importants de la nostra història recent.',
          'Volíem ser més a prop dels propietaris de Porsche de Madrid i del centre d’Espanya, sense que s’haguessin de desplaçar a Barcelona per accedir a la nostra experiència i als nostres serveis. Ho vam fer portant-hi la mateixa manera de treballar: atenció directa, especialització tècnica i cura per cada vehicle.',
          'Madrid no és una extensió secundària de Valentin Motors. És una part essencial del que som avui.',
        ],
      },
      {
        nombre: 'Varsòvia, Barcelona',
        lema: 'El 2025 vam obrir una nova etapa a la nostra ciutat.',
        parrafos: [
          'Ens vam traslladar al <strong>carrer de Varsòvia, 65</strong>, a unes noves instal·lacions de <strong>1.320 m² distribuïts en dues plantes</strong>, on reunim més recursos, una millor organització dels processos i noves capacitats, incloses les feines de xapa i pintura.',
          'El nou taller reflecteix la nostra ambició: continuar creixent, donar resposta a projectes més complexos i oferir una experiència millor als nostres clients sense perdre el tracte personal que sempre ens ha caracteritzat.',
        ],
      },
    ],
    cierre: 'Avui, <strong>Barcelona i Madrid treballen amb una mateixa filosofia i una mateixa exigència</strong>.',
  },
  especialidades: {
    etiqueta: 'Especialistes Porsche, de principi a fi',
    titulo: 'Un sol univers. Moltes maneres de gaudir-lo.',
    parrafos: [
      'Per a nosaltres, no hi ha dos Porsche iguals. Canvia la generació, canvia l’ús, canvia la història del cotxe i canvia el que n’espera el propietari. Per això no treballem amb respostes automàtiques.',
      'Ens dediquem a conèixer cada model i a intervenir-hi amb el criteri que necessita:',
    ],
    lista: [
      { titulo: 'Manteniment i diagnosi', texto: 'Cuidem el funcionament i la fiabilitat de cada Porsche, clàssic o modern, amb revisions, diagnosis i reparacions específiques.' },
      { titulo: 'Motors i transmissions', texto: 'Revisem, reparem i reconstruïm conjunts mecànics amb el rigor que requereixen les diferents generacions de Porsche.' },
      { titulo: 'Restauració integral', texto: 'Recuperem vehicles amb una visió completa del projecte, des de la mecànica i la carrosseria fins als acabats i els detalls originals.' },
      { titulo: 'Xapa i pintura', texto: 'Treballem tant en la recuperació com en l’acabat de cada vehicle, respectant-ne el caràcter i les necessitats.' },
      { titulo: 'Preparació esportiva i personalització', texto: 'Desenvolupem solucions per a qui vol adaptar el seu cotxe a un ús concret o fer-lo veritablement seu.' },
      { titulo: 'Selecció de vehicles', texto: 'Acompanyem la compra i la venda de Porsche amb el coneixement tècnic que adquirim cada dia al taller.' },
    ],
    cierre: 'Podem encarregar-nos d’un manteniment programat, resoldre una avaria complexa o acompanyar una transformació que duri mesos. En tots els casos apliquem la mateixa filosofia: <strong>fer el que necessita el cotxe, fer-ho bé i explicar per què</strong>.',
  },
  proyectos: {
    etiqueta: 'Del respecte per la història als projectes propis',
    titulo: 'Un Porsche pot tenir moltes vides.',
    parrafos: [
      'Ens apassionen els Porsche que conserven intacta la seva personalitat original. També els que tornen a la carretera després d’una restauració minuciosa i els que es transformen per respondre a la visió del seu propietari.',
      'L’experiència que hem acumulat durant dècades ens permet abordar aquests projectes des d’una perspectiva completa. No es tracta només de triar materials o millorar prestacions. Cal entendre l’enginyeria del cotxe, respectar-ne les proporcions, anticipar com es comportarà i cuidar cada element del conjunt.',
      'El <strong>PA10/01</strong>, presentat el 2025, representa aquesta faceta de Valentin Motors: la nostra capacitat per reinterpretar un Porsche 911 amb un llenguatge propi, combinant experiència, tècnica i una visió contemporània de l’automòbil.',
      'Continuarem restaurant, mantenint i preparant Porsche. I continuarem explorant noves maneres de portar el nostre coneixement una mica més lluny.',
    ],
    enlace: 'Descobrir el PA10/01',
    fotoAlt: 'El PA10/01, de perfil',
  },
  hitos: {
    etiqueta: 'Les fites de la nostra història',
    titulo: 'Més de quatre dècades d’evolució constant.',
    lista: [
      ['1979', 'Naixem a Barcelona i comencem a especialitzar-nos en els Porsche 911 i 914 de carretera i competició.'],
      ['Anys 80', 'Creixem al voltant de la preparació esportiva, la mecànica i la feina de motors.'],
      ['Passatge Simó', 'Consolidem la nostra activitat al taller del Passatge Simó, 14, i la nostra relació amb els propietaris Porsche de Barcelona.'],
      ['2009', 'Jordi Edo i Olga Ibán impulsen una nova etapa al capdavant de la gestió de Valentin Motors.'],
      ['Gran Via', 'Ampliem la nostra trajectòria al taller de la Gran Via de les Corts Catalanes, 752.'],
      ['2023', 'Obrim Valentin Motors Madrid a Leganés i acostem els nostres serveis als clients del centre d’Espanya.'],
      ['2024', 'Celebrem els nostres primers 45 anys.'],
      ['2025', 'Inaugurem el nou taller de Barcelona a Varsòvia, 65, amb més espai i noves capacitats.'],
      ['2025', 'Presentem el PA10/01, la nostra reinterpretació integral del Porsche 911.'],
      ['Avui', 'Amb en Jordi al capdavant i un equip especialitzat a Barcelona i Madrid, continuem escrivint la nostra història.'],
    ],
  },
  relacion: {
    etiqueta: 'Una relació que va molt més enllà del taller',
    titulo: 'Cuidem cotxes. I la confiança de qui els condueix.',
    parrafos: [
      'Molts dels nostres clients fa anys que són amb nosaltres. Alguns han passat per les nostres instal·lacions amb diversos Porsche; d’altres ens confien un cotxe que han conservat tota la vida. Cada història és diferent, però totes mereixen la mateixa atenció.',
      'Creiem a explicar les coses amb claredat, compartir el que sabem i acompanyar el propietari en les decisions que afecten el seu cotxe. De vegades la millor solució és una intervenció important. D’altres vegades és fer menys, conservar més i esperar el moment adequat.',
      'Aquesta relació propera és una part essencial de Valentin Motors. Volem que qui entri a qualsevol dels nostres tallers hi trobi persones que coneixen el seu Porsche, escolten el que necessita i es responsabilitzen de la feina fins al final.',
    ],
  },
  futuro: {
    titulo: 'El millor de la nostra història és el que ha de venir.',
    parrafos: [
      'Vam començar el 1979 amb els Porsche que es gaudien tant a la carretera com al circuit. Avui treballem amb clàssics, esportius moderns, vehicles de competició i projectes construïts al voltant d’una idea única.',
      'Tenim més coneixements, més recursos i dos centres des d’on atendre els nostres clients. Però mantenim el que ens va fer començar: la curiositat per entendre cada cotxe i l’exigència de fer bé la nostra feina.',
    ],
    firma: 'Amb Jordi Edo al capdavant, Olga Ibán i tot el nostre equip, continuem construint el capítol següent de Valentin Motors.',
    lema: 'Valentin Motors. Especialistes Porsche des del 1979.',
    cta: 'Parlem del teu Porsche',
  },
};

export const TEXTOS_NOSOTROS: Record<Idioma, TextosNosotros> = { es, en, fr, it, de, ca };
