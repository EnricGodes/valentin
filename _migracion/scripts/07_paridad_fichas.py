#!/usr/bin/env python3
"""
Fase 3 - Verificacion: compara cada ficha nueva con la original.

El criterio de aceptacion no es "se ve parecido", es que el texto visible de
cada seccion sea el mismo. Compara por secuencia de palabras, asi que la
puntuacion o el maquetado pueden cambiar pero el contenido no.

Uso: primero `npm run build` en sitio/, luego este script.
"""
import re, sys, unicodedata
from pathlib import Path
from bs4 import BeautifulSoup

RAIZ = Path(__file__).resolve().parent.parent.parent
DIST = RAIZ / 'sitio' / 'dist' / 'porsche-en-venta'

PARES = {
    'ruf.html':          '997-ruf-kompressor.html',
    '356.html':          'porsche-356-b-cabriolet-1960.html',
    '997.html':          'porsche-997-manual.html',
    '997tiptronic.html': 'porsche-997-carrera-4s-triptronic.html',
    '911targa.html':     'porsche-911-22-t-targa.html',
    '991scabrio.html':   'porsche-porsche-991-carrera-s-cabrio.html',
}

# Selector por bloque de contenido. El nav, el pie y el selector de idioma no
# se comparan: en las fichas originales estaban ocultos con display:none porque
# vivian dentro de un iframe de Squarespace.
# (etiqueta, selector en el original, selector en el nuevo).
# Se declaran por separado porque la estructura cambio en algunos bloques: en el
# original .intro-text envuelve tambien la cita destacada, y comparar con un
# unico selector la contaba dos veces en un lado y una en el otro.
BLOQUES = [
    ('titulo hero',       '.hero-title',                     '.hero-title'),
    ('eyebrow',           '.hero-eyebrow',                   '.hero-eyebrow'),
    ('claim',             '.hero-claim',                     '.hero-claim'),
    ('titulos seccion',   '.section-title',                  '.section-title'),
    ('etiquetas seccion', '.section-label',                  '.section-label'),
    ('parrafos intro',    '.intro-text > div:not(.intro-highlight) p',
                          '#historia .texto-editorial p'),
    ('cita intro',        '.intro-highlight p',              '.intro-highlight p'),
    ('datos intro',       '.intro-data-row',                 '.intro-data-row'),
    ('captions galeria',  '.gallery-caption',                '.gallery-caption'),
    ('stats',             '.eng-stat',                       '.eng-stat'),
    ('tags',              '.eng-tag',                        '.eng-tag'),
    ('kit',               '.kit-category',                   '.kit-category'),
    ('texto exterior',    '.exterior-text',                  '.exterior-text'),
    ('captions detalle',  '.closeup-caption',                '.closeup-caption'),
    ('captions interior', '.interior-caption',               '.interior-caption'),
    ('editorial interior','.interior-editorial p',           '.interior-editorial p'),
    ('timeline',          '.timeline-item',                  '.timeline-item'),
    ('specs',             '.specs-group',                    '.specs-group'),
    ('opinion',           '#jordi',                          '#opinion'),
    ('cierre',            '.closing-content',                '.closing-content'),
]


def palabras(t):
    t = unicodedata.normalize('NFC', t)
    return re.findall(r'\w+', t.lower(), re.UNICODE)


def texto(sopa, selector):
    fuera = []
    for el in sopa.select(selector):
        fuera += palabras(el.get_text(' '))
    return fuera


def cargar(ruta):
    s = BeautifulSoup(ruta.read_text(encoding='utf8'), 'lxml')
    for t in s.find_all(['script', 'style', 'nav', 'footer']):
        t.decompose()
    return s


def main():
    if not DIST.exists():
        sys.exit(f'No existe {DIST}. Ejecuta `npm run build` en sitio/ primero.')

    fallos = 0
    print(f'{"ficha":34} {"bloque":20} {"orig":>6} {"nuevo":>6}  estado')
    print('-' * 82)
    for orig_n, nuevo_n in PARES.items():
        o = cargar(RAIZ / orig_n)
        n = cargar(DIST / nuevo_n)
        problemas = []
        for etiqueta, sel_o, sel_n in BLOQUES:
            po, pn = texto(o, sel_o), texto(n, sel_n)
            if po == pn:
                continue
            faltan = [w for w in po if po.count(w) > pn.count(w)]
            estado = 'IGUAL' if not faltan else f'FALTAN {len(set(faltan))}'
            problemas.append((etiqueta, len(po), len(pn), estado, sorted(set(faltan))[:8]))
        if not problemas:
            print(f'{orig_n:34} {"(todos)":20} {"":>6} {"":>6}  OK')
        for etiqueta, a, b, estado, faltan in problemas:
            marca = 'orden/formato' if estado == 'IGUAL' else estado
            if estado != 'IGUAL':
                fallos += 1
            print(f'{orig_n:34} {etiqueta:20} {a:>6} {b:>6}  {marca}')
            if faltan:
                print(f'{"":34} {"":20} {"":>6} {"":>6}  -> {faltan}')

    print('-' * 82)
    print('Sin perdida de contenido en las 6 fichas.' if not fallos
          else f'{fallos} bloques con texto perdido.')
    return 1 if fallos else 0


if __name__ == '__main__':
    sys.exit(main())
