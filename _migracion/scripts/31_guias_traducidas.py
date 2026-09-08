#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Publica las 18 guias de modelo Porsche en los cinco idiomas traducidos.

    python3 31_guias_traducidas.py [--solo en,de] [--comprobar]

La entrega solo trae la prosa: entradilla, ficha, versiones, averias,
mantenimiento y los dos cierres, con la misma estructura y el mismo orden que
GUIAS-DE-MODELO-18.json. Todo lo demas del post (encabezados, pie de foto,
frase de las areas del taller, frase de tarifas) lo escribe el generador, igual
que hizo generar-guias.py con el castellano. Aqui viven esas piezas en los
cinco idiomas.

Lo estructural NO se toca y no sale de la entrega: se lee del post castellano,
que es el que esta en git. De ahi salen fecha, identificadores de Squarespace,
rutas de las tres fotos, autoria y licencia de las dos de Wikimedia, que areas
del taller enlaza cada guia, que tarifa le toca y que articulos relacionados
lleva. Asi una traduccion no puede desviarse del original en nada que no sea
texto, y el script se puede volver a pasar sin tener delante la entrega
original de las guias, que vive fuera de git.

Los cuatro encabezados que son preguntas siguen siendolo en los cinco idiomas:
de ellos sale el FAQPage de components/seo/Faq.astro, que se emite cuando hay
dos o mas H2 con interrogante.
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
ENTREGA = RAIZ / '_migracion' / 'traducciones' / 'VALENTIN-MOTORS-GUIAS-PORSCHE-TRADUCCIONES'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
DESPUBLICADO = RAIZ / 'sitio' / 'src' / 'content' / '_despublicado' / 'magazine'
RUTAS_TS = RAIZ / 'sitio' / 'src' / 'i18n' / 'routes.ts'

IDIOMAS = ['en', 'fr', 'it', 'de', 'ca']

# Los 18 slugs, en el orden del castellano. El nombre del modelo es el que usa
# el titulo castellano y no se traduce: es una designacion de fabrica.
MODELOS = {
    'porsche-964': 'Porsche 964',       'porsche-996': 'Porsche 996',
    'porsche-997': 'Porsche 997',       'porsche-993': 'Porsche 993',
    'porsche-930': 'Porsche 930 Turbo', 'porsche-356': 'Porsche 356',
    'porsche-911g': 'Porsche 911 G',    'porsche-991': 'Porsche 991',
    'porsche-992': 'Porsche 992',       'porsche-944': 'Porsche 944',
    'porsche-928': 'Porsche 928',       'porsche-924': 'Porsche 924',
    'porsche-968': 'Porsche 968',       'porsche-718': 'Porsche 718',
    'porsche-987': 'Porsche 987',       'porsche-981': 'Porsche 981',
    'porsche-986': 'Porsche 986',       'porsche-911-f': 'Porsche 911 F',
}

# Que describe la foto de cada guia. El alt de la de apertura anade el sufijo
# del estudio; las dos editoriales usan la descripcion sola.
FOTO = {
    'porsche-964': ('gen', '964'),   'porsche-996': ('gen', '996'),
    'porsche-997': ('gen', '997'),   'porsche-993': ('gen', '993'),
    'porsche-991': ('gen', '991'),   'porsche-992': ('gen', '992'),
    'porsche-930': ('turbo', '930'), 'porsche-356': ('356', ''),
    'porsche-911g': ('serieG', ''),  'porsche-911-f': ('serieF', ''),
    'porsche-944': ('frontal', '944'), 'porsche-924': ('frontal', '924'),
    'porsche-928': ('gt', '928'),    'porsche-968': ('coupe', '968'),
    'porsche-718': ('cayman', '718'),
    'porsche-987': ('boxster', '987'), 'porsche-981': ('boxster', '981'),
    'porsche-986': ('boxster', '986'),
}

# ── Las piezas que no vienen traducidas ──────────────────────────────────────
# {m} es el nombre del modelo. El genero del articulo sigue al de la entrega:
# la Porsche en frances e italiano, der Porsche en aleman, el Porsche en
# catalan e ingles neutro.
TEXTOS = {
    'en': {
        'pie_hero': '{m}, the reference profile for this generation.',
        'h_ficha': '{m} at a glance',
        'h_versiones': 'Which {m} should you choose?',
        'h_comprar': 'What should you check before buying a {m}?',
        'h_averias': 'Known {m} faults',
        'h_mantenimiento': 'How is a {m} serviced?',
        'h_hemos_hecho': 'What we have done at Valentín Motors',
        'h_conviene': 'Who is a {m} for?',
        'h_relacionados': 'Related work',
        'credito': '{alt}. Photo: {autor}, [{lic}]({url}), via [Wikimedia Commons]({pag}).',
        'areas': 'These are the workshop areas that step in once the diagnosis '
                 'confirms it: {lista}.',
        'tarifas': 'The [{etiqueta}]({href}) give an idea of the scope of each '
                   'service. The final quote depends on what turns up on the car.',
        'y': ' and ',
        'areas_etiqueta': {
            'taller-motores': 'engines', 'taller-cajas': 'gearboxes',
            'taller-pintura': 'paint and bodywork', 'taller-ims': 'IMS repair',
            'taller-bore-scoring': 'bore scoring',
        },
        'tarifas_etiqueta': {
            'tarifa-911': '911 servicing rates', 'tarifa-turbo': 'Turbo servicing rates',
            'tarifa-transaxle': 'transaxle servicing rates',
            'tarifa-cayman': 'Cayman and Boxster servicing rates',
        },
        'foto': {
            'gen': 'Porsche 911 from the {n} generation',
            'turbo': 'Porsche 911 Turbo from the 930 generation',
            '356': 'Classic Porsche 356',
            'serieG': 'Porsche 911 Carrera from the G series',
            'serieF': 'Classic Porsche 911 from the F series',
            'frontal': 'Front-engined Porsche {n}',
            'gt': 'Porsche 928 grand tourer',
            'coupe': 'Porsche 968 Coupé',
            'cayman': 'Porsche 718 Cayman',
            'boxster': 'Porsche Boxster from the {n} generation',
        },
        'foto_hero': '{base} in profile on a white background',
    },
    'fr': {
        'pie_hero': '{m}, profil de référence de la génération.',
        'h_ficha': 'Fiche de la {m}',
        'h_versiones': 'Quelle version de la {m} choisir ?',
        'h_comprar': "Que vérifier avant d'acheter une {m} ?",
        'h_averias': 'Pannes connues de la {m}',
        'h_mantenimiento': 'Comment entretenir une {m} ?',
        'h_hemos_hecho': 'Ce que nous avons fait chez Valentín Motors',
        'h_conviene': 'À qui convient une {m} ?',
        'h_relacionados': 'Travaux associés',
        'credito': '{alt}. Photo : {autor}, [{lic}]({url}), via [Wikimedia Commons]({pag}).',
        'areas': "Voici les secteurs de l'atelier qui interviennent lorsque le "
                 'diagnostic le confirme : {lista}.',
        'tarifas': "Les [{etiqueta}]({href}) donnent la mesure de chaque révision. "
                   "Le devis final dépend de ce qui apparaît sur la voiture.",
        'y': ' et ',
        'areas_etiqueta': {
            'taller-motores': 'moteurs', 'taller-cajas': 'boîtes de vitesses',
            'taller-pintura': 'peinture et carrosserie', 'taller-ims': "réparation de l'IMS",
            'taller-bore-scoring': 'bore scoring',
        },
        'tarifas_etiqueta': {
            'tarifa-911': "tarifs d'entretien de la 911",
            'tarifa-turbo': "tarifs d'entretien du Turbo",
            'tarifa-transaxle': "tarifs d'entretien des transaxle",
            'tarifa-cayman': "tarifs d'entretien des Cayman et Boxster",
        },
        'foto': {
            'gen': 'Porsche 911 de la génération {n}',
            'turbo': 'Porsche 911 Turbo de la génération 930',
            '356': 'Porsche 356 classique',
            'serieG': 'Porsche 911 Carrera de la série G',
            'serieF': 'Porsche 911 classique de la série F',
            'frontal': 'Porsche {n} à moteur avant',
            'gt': 'Porsche 928 grand tourisme',
            'coupe': 'Porsche 968 Coupé',
            'cayman': 'Porsche 718 Cayman',
            'boxster': 'Porsche Boxster de la génération {n}',
        },
        'foto_hero': '{base} de profil sur fond blanc',
    },
    'it': {
        'pie_hero': '{m}, profilo di riferimento della generazione.',
        'h_ficha': 'Scheda della {m}',
        'h_versiones': 'Quale versione della {m} scegliere?',
        'h_comprar': 'Che cosa controllare prima di comprare una {m}?',
        'h_averias': 'Guasti noti della {m}',
        'h_mantenimiento': 'Come si mantiene una {m}?',
        'h_hemos_hecho': 'Quello che abbiamo fatto in Valentín Motors',
        'h_conviene': 'A chi conviene una {m}?',
        'h_relacionados': 'Lavori correlati',
        'credito': '{alt}. Foto: {autor}, [{lic}]({url}), via [Wikimedia Commons]({pag}).',
        'areas': "Queste sono le aree dell'officina che intervengono quando la "
                 'diagnosi lo conferma: {lista}.',
        'tarifas': "Le [{etiqueta}]({href}) orientano l'ampiezza di ogni tagliando. "
                   'Il preventivo finale dipende da quello che emerge sulla vettura.',
        'y': ' e ',
        'areas_etiqueta': {
            'taller-motores': 'motori', 'taller-cajas': 'cambi',
            'taller-pintura': 'verniciatura e carrozzeria',
            'taller-ims': "riparazione dell'IMS",
            'taller-bore-scoring': 'bore scoring',
        },
        'tarifas_etiqueta': {
            'tarifa-911': 'tariffe di manutenzione della 911',
            'tarifa-turbo': 'tariffe di manutenzione del Turbo',
            'tarifa-transaxle': 'tariffe di manutenzione delle transaxle',
            'tarifa-cayman': 'tariffe di manutenzione di Cayman e Boxster',
        },
        'foto': {
            'gen': 'Porsche 911 della generazione {n}',
            'turbo': 'Porsche 911 Turbo della generazione 930',
            '356': 'Porsche 356 classica',
            'serieG': 'Porsche 911 Carrera della serie G',
            'serieF': 'Porsche 911 classica della serie F',
            'frontal': 'Porsche {n} a motore anteriore',
            'gt': 'Porsche 928 gran turismo',
            'coupe': 'Porsche 968 Coupé',
            'cayman': 'Porsche 718 Cayman',
            'boxster': 'Porsche Boxster della generazione {n}',
        },
        'foto_hero': '{base} di profilo su fondo bianco',
    },
    'de': {
        'pie_hero': '{m}, Referenzprofil der Generation.',
        'h_ficha': 'Datenblatt zum {m}',
        'h_versiones': 'Welche Version des {m} sollten Sie wählen?',
        'h_comprar': 'Was sollten Sie vor dem Kauf eines {m} prüfen?',
        'h_averias': 'Bekannte Schwachstellen des {m}',
        'h_mantenimiento': 'Wie wird ein {m} gewartet?',
        'h_hemos_hecho': 'Was wir bei Valentín Motors gemacht haben',
        'h_conviene': 'Für wen eignet sich ein {m}?',
        'h_relacionados': 'Verwandte Arbeiten',
        'credito': '{alt}. Foto: {autor}, [{lic}]({url}), über [Wikimedia Commons]({pag}).',
        'areas': 'Das sind die Werkstattbereiche, die eingreifen, sobald die '
                 'Diagnose es bestätigt: {lista}.',
        'tarifas': 'Die [{etiqueta}]({href}) geben den Umfang jeder Inspektion vor. '
                   'Der endgültige Kostenvoranschlag hängt davon ab, was sich am '
                   'Fahrzeug zeigt.',
        'y': ' und ',
        'areas_etiqueta': {
            'taller-motores': 'Motoren', 'taller-cajas': 'Getriebe',
            'taller-pintura': 'Lack und Karosserie', 'taller-ims': 'IMS-Reparatur',
            'taller-bore-scoring': 'bore scoring',
        },
        'tarifas_etiqueta': {
            'tarifa-911': 'Wartungspreise für den 911',
            'tarifa-turbo': 'Wartungspreise für den Turbo',
            'tarifa-transaxle': 'Wartungspreise für die transaxle Modelle',
            'tarifa-cayman': 'Wartungspreise für Cayman und Boxster',
        },
        'foto': {
            'gen': 'Porsche 911 der Generation {n}',
            'turbo': 'Porsche 911 Turbo der Generation 930',
            '356': 'Klassischer Porsche 356',
            'serieG': 'Porsche 911 Carrera der G-Serie',
            'serieF': 'Klassischer Porsche 911 der F-Serie',
            'frontal': 'Porsche {n} mit Frontmotor',
            'gt': 'Porsche 928 Gran Turismo',
            'coupe': 'Porsche 968 Coupé',
            'cayman': 'Porsche 718 Cayman',
            'boxster': 'Porsche Boxster der Generation {n}',
        },
        'foto_hero': '{base} im Seitenprofil vor weißem Hintergrund',
    },
    'ca': {
        'pie_hero': '{m}, perfil de referència de la generació.',
        'h_ficha': 'Fitxa del {m}',
        'h_versiones': 'Quina versió del {m} triar?',
        'h_comprar': 'Què cal revisar abans de comprar un {m}?',
        'h_averias': 'Avaries conegudes del {m}',
        'h_mantenimiento': 'Com es manté un {m}?',
        'h_hemos_hecho': 'El que hem fet a Valentín Motors',
        'h_conviene': 'A qui li convé un {m}?',
        'h_relacionados': 'Treballs relacionats',
        'credito': '{alt}. Foto: {autor}, [{lic}]({url}), via [Wikimedia Commons]({pag}).',
        'areas': "Aquestes són les àrees del taller que intervenen quan el "
                 'diagnòstic ho confirma: {lista}.',
        'tarifas': "Les [{etiqueta}]({href}) orienten l'abast de cada revisió. "
                   'El pressupost final depèn del que aparegui sobre el cotxe.',
        'y': ' i ',
        'areas_etiqueta': {
            'taller-motores': 'motors', 'taller-cajas': 'caixes de canvis',
            'taller-pintura': 'pintura i carrosseria', 'taller-ims': "reparació de l'IMS",
            'taller-bore-scoring': 'bore scoring',
        },
        'tarifas_etiqueta': {
            'tarifa-911': 'tarifes de manteniment del 911',
            'tarifa-turbo': 'tarifes de manteniment del Turbo',
            'tarifa-transaxle': 'tarifes de manteniment dels transaxle',
            'tarifa-cayman': 'tarifes de manteniment de Cayman i Boxster',
        },
        'foto': {
            'gen': 'Porsche 911 de la generació {n}',
            'turbo': 'Porsche 911 Turbo de la generació 930',
            '356': 'Porsche 356 clàssic',
            'serieG': 'Porsche 911 Carrera de la sèrie G',
            'serieF': 'Porsche 911 clàssic de la sèrie F',
            'frontal': 'Porsche {n} de motor davanter',
            'gt': 'Porsche 928 gran turisme',
            'coupe': 'Porsche 968 Coupé',
            'cayman': 'Porsche 718 Cayman',
            'boxster': 'Porsche Boxster de la generació {n}',
        },
        'foto_hero': '{base} de perfil sobre fons blanc',
    },
}

# Correcciones sobre la entrega. Van aqui y no sobre los .md para que
# volver a pasar el script no las deshaga.
#
#   Coupe    La entrega inglesa escribe la carroceria sin acento en la ficha de
#            doce guias. `Coupé` es invariante en el glosario y
#            validar-glosario.ts compara con el acento puesto: sin esto el
#            build cae en las doce.
#   987      La ficha castellana dice que la produccion de Boxster y Cayman no
#            esta publicada de forma uniforme. Las cinco traducciones la
#            sustituyen por "mas de 160.000", una cifra que no sale del
#            original. Se devuelve lo que el castellano afirma.
ARREGLOS = {
    'en': [(re.compile(r'\bCoupe\b'), 'Coupé'),
           (re.compile(r'More than 160\.000 Boxster/Cayman, approximately'),
            'Not published consistently for Boxster and Cayman')],
    'fr': [(re.compile(r'Plus de 160\.000 Boxster/Cayman, soit environ'),
            'Non publiée de façon uniforme pour Boxster et Cayman')],
    'it': [(re.compile(r'Più di 160\.000 Boxster/Cayman circa'),
            'Non pubblicata in modo uniforme per Boxster e Cayman')],
    'de': [(re.compile(r'Ungefähr mehr als 160\.000 Boxster/Cayman'),
            'Nicht einheitlich für Boxster und Cayman veröffentlicht')],
    'ca': [(re.compile(r'Més de 160\.000 Boxster/Cayman, aproximadament'),
            'No publicada de manera uniforme per a Boxster i Cayman')],
}


# ── Rutas ────────────────────────────────────────────────────────────────────
def rutas():
    """{id: {idioma: slug}} desde el manifiesto, que es la fuente de verdad."""
    ts = RUTAS_TS.read_text(encoding='utf-8')
    fuera = {}
    for m in re.finditer(r"\{\s*id:\s*'([^']+)'[^{]*?slugs:\s*\{(.*?)\}", ts, re.S):
        ident, cuerpo = m.group(1), m.group(2)
        slugs = dict(re.findall(r"(\w+):\s*'([^']*)'", cuerpo))
        if slugs:
            fuera[ident] = slugs
    return fuera


RUTAS = rutas()
POR_SLUG_ES = {v['es']: k for k, v in RUTAS.items() if 'es' in v}


def url(ident, idioma):
    slug = RUTAS[ident][idioma]
    prefijo = '' if idioma == 'es' else f'/{idioma}'
    return f'{prefijo}/{slug}'


# ── Lectura del post castellano ──────────────────────────────────────────────
# La URL de Commons lleva parentesis dentro (File:..._(993,_1998)_(54873234736).jpg),
# asi que el ultimo grupo es glotón hasta el parentesis final de la linea.
CREDITO_ES = re.compile(
    r'^\*(?P<alt>.+?)\. Foto: (?P<autor>.+?), '
    r'\[(?P<lic>[^\]]+)\]\((?P<url>[^)]+)\), '
    r'vía \[Wikimedia Commons\]\((?P<pag>.+)\)\.\*$', re.M)


def leer_castellano(slug):
    """Todo lo que no es prosa sale de aqui: el post castellano en git."""
    crudo = (MAGAZINE / 'es' / f'{slug}.md').read_text(encoding='utf-8')
    fm = re.search(r'\A---\n(.*?)\n---\n', crudo, re.S).group(1)
    campo = lambda k: (re.search(rf'^{k}:\s*(.*)$', fm, re.M) or [None, ''])[1].strip().strip('"')

    creditos = [m.groupdict() for m in CREDITO_ES.finditer(crudo)]
    if len(creditos) != 2:
        raise SystemExit(f'{slug}: se esperaban 2 pies de foto y hay {len(creditos)}')

    articulos = re.search(r':::articulos\{ids="([^"]+)"\}', crudo)

    # Areas del taller y tarifa: se identifican por la ruta, no por la etiqueta.
    enlaces = re.findall(r'\]\((/[^)]+)\)', crudo)
    areas, tarifa = [], None
    for href in enlaces:
        ident = POR_SLUG_ES.get(href.lstrip('/'))
        if ident is None:
            continue
        if ident.startswith('taller-') and ident not in areas:
            areas.append(ident)
        elif ident.startswith('tarifa-'):
            tarifa = ident
    if tarifa is None:
        raise SystemExit(f'{slug}: no se encuentra el enlace de tarifas')

    return {
        'date': campo('date'),
        'squarespaceId': campo('squarespaceId'),
        'originalUrl': campo('originalUrl'),
        'slugSquarespace': campo('slugSquarespace'),
        'slugOriginal': campo('slugOriginal'),
        'creditos': creditos,
        'areas': areas,
        'tarifa': tarifa,
        'articulos': articulos.group(1) if articulos else '',
    }


# ── Construccion del post traducido ──────────────────────────────────────────
def descripcion_foto(slug, t):
    forma, n = FOTO[slug]
    return t['foto'][forma].format(n=n)


def limpiar(s):
    return re.sub(r'\s{2,}', ' ', s).strip()


def construir(g, es, idioma):
    t = TEXTOS[idioma]
    slug = g['slug']
    m = MODELOS[slug]
    base = descripcion_foto(slug, t)
    p = []

    p.append(f"![{t['foto_hero'].format(base=base)}](/img/magazine/guia-{slug}-hero.jpg)")
    p.append('*' + t['pie_hero'].format(m=m) + '*')
    p += [limpiar(x) for x in g['entradilla']]

    p.append('## ' + t['h_ficha'].format(m=m))
    p.append(':::ficha\n' + '\n'.join(
        f"- **{limpiar(f['clave'])}** · {limpiar(f['valor'])}" for f in g['ficha']) + '\n:::')

    p.append('## ' + t['h_versiones'].format(m=m))
    for v in g['versiones']:
        p.append(f"### {limpiar(v['nombre'])}")
        p.append(limpiar(v['texto']))

    def credito(i):
        c = dict(es['creditos'][i], alt=base)
        return '*' + t['credito'].format(**c) + '*'

    p.append(f"![{base}](/img/magazine/guia-{slug}-01.jpg)")
    p.append(credito(0))

    # La segunda foto, a mitad de seccion y no pegada a un H2: en la rejilla un
    # bloque .en-lateral solo se acompana si detras viene prosa.
    compra = [limpiar(x) for x in g['antesDeComprar']]
    corte = len(compra) // 2
    p.append('## ' + t['h_comprar'].format(m=m))
    p += compra[:corte]
    p.append(f"![{base}](/img/magazine/guia-{slug}-02.jpg)")
    p.append(credito(1))
    p += compra[corte:]

    p.append('## ' + t['h_averias'].format(m=m))
    for a in g['averias']:
        p.append(f"### {limpiar(a['titulo'])}")
        p.append(limpiar(a['texto']))
    if es['areas']:
        enlaces = [f"[{t['areas_etiqueta'][i]}]({url(i, idioma)})" for i in es['areas']]
        lista = enlaces[0] if len(enlaces) == 1 else \
            ', '.join(enlaces[:-1]) + t['y'] + enlaces[-1]
        p.append(t['areas'].format(lista=lista))

    p.append('## ' + t['h_mantenimiento'].format(m=m))
    p += [limpiar(x) for x in g['mantenimiento']]
    p.append(t['tarifas'].format(etiqueta=t['tarifas_etiqueta'][es['tarifa']],
                                 href=url(es['tarifa'], idioma)))

    p.append('## ' + t['h_hemos_hecho'])
    p += [limpiar(x) for x in g['loQueHemosHecho']]

    p.append('## ' + t['h_conviene'].format(m=m))
    p += [limpiar(x) for x in g['aQuienLeConviene']]

    if es['articulos']:
        p.append('## ' + t['h_relacionados'])
        p.append(':::articulos{ids="' + es['articulos'] + '"}\n:::')

    extra = []
    if es['squarespaceId']:
        extra.append(f'squarespaceId: "{es["squarespaceId"]}"')
    if es['originalUrl']:
        extra.append(f'originalUrl: "{es["originalUrl"]}"')

    fm = [
        f'title: "{limpiar(g["title"])}"',
        f'metaTitulo: "{limpiar(g["metaTitulo"])}"',
        f'metaDescripcion: "{limpiar(g["metaDescripcion"])}"',
        f'slugSquarespace: "{es["slugSquarespace"]}"',
        f'slugFinal: "{slug}"',
        f'slugOriginal: "{es["slugOriginal"]}"',
        f'date: {es["date"]}',
        f'lang: {idioma}',
        'categories: ["iconos"]',
        f'excerpt: "{limpiar(g["excerpt"])}"',
        'author: "Enric Godes"',
        *extra,
        'ctas: []',
    ]
    return '---\n' + '\n'.join(fm) + '\n---\n' + '\n\n'.join(p) + '\n'


def cargar(idioma):
    d = json.loads((ENTREGA / f'GUIAS-DE-MODELO-18-{idioma}.json').read_text(encoding='utf-8'))
    if d.get('formato') != 'valentinmotors-guias-v1':
        raise SystemExit(f'{idioma}: formato inesperado {d.get("formato")!r}')
    crudo = json.dumps(d['guias'], ensure_ascii=False)
    for patron, bueno in ARREGLOS.get(idioma, []):
        crudo = patron.sub(bueno, crudo)
    return json.loads(crudo)


def main():
    solo = next((set(sys.argv[i + 1].split(','))
                 for i, a in enumerate(sys.argv) if a == '--solo'), None)
    comprobar = '--comprobar' in sys.argv

    for idioma in IDIOMAS:
        if solo and idioma not in solo:
            continue
        guias = cargar(idioma)
        if [g['slug'] for g in guias] != list(MODELOS):
            raise SystemExit(f'{idioma}: los slugs no coinciden con el castellano')

        escritos = 0
        for g in guias:
            es = leer_castellano(g['slug'])
            md = construir(g, es, idioma)
            for mal in ('—', '  ', '{m}', '{n}'):
                if mal in md.replace('---\n', ''):
                    print(f'AVISO {idioma}/{g["slug"]}: contiene {mal!r}', file=sys.stderr)
            destino = MAGAZINE / idioma / f'{g["slug"]}.md'
            if comprobar:
                igual = destino.exists() and destino.read_text(encoding='utf-8') == md
                print(f'{"=" if igual else "!"} {idioma}/{g["slug"]}')
                continue
            destino.write_text(md, encoding='utf-8')
            escritos += 1

            # La traduccion del articulo viejo, que se aparto cuando el
            # castellano paso a ser guia, ya no hace falta.
            viejo = DESPUBLICADO / idioma / f'{g["slug"]}.md'
            if viejo.exists():
                viejo.unlink()

        if not comprobar:
            print(f'{idioma}: {escritos} guias escritas')


main()
