#!/usr/bin/env python3
"""
Aplica _migracion/correcciones.json a TODO: espanol y traducciones.

Las correcciones nacieron dentro del extractor de paginas, que solo toca el
espanol. En cuanto hubo traducciones, una cifra corregida en castellano seguia
mal en los otros cinco idiomas. Este script cierra ese hueco y se puede
ejecutar cuantas veces haga falta.

Las reglas con `ambito: paginas-no-legales` no tocan el aviso legal, la
politica de privacidad ni la de cookies: ahi la direccion de Gran Via 752 es
correcta, porque es el domicilio social de la sociedad y no el taller.
"""
import json, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
CORRECCIONES = RAIZ / '_migracion' / 'correcciones.json'
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
COCHES = RAIZ / 'sitio' / 'src' / 'datos' / 'coches'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
LEGALES = {'aviso-legal', 'privacidad', 'cookies'}


def reglas():
    d = json.loads(CORRECCIONES.read_text())
    return [r for b in d.values() if isinstance(b, dict) for r in b.get('reglas', [])]


def aplicables(rs, nombre):
    fuera = []
    for r in rs:
        if r.get('ambito') == 'paginas-no-legales' and nombre in LEGALES:
            continue
        fuera.append(r)
    return fuera


def main():
    rs = reglas()
    tocados = cambios = 0
    for carpeta in (PAGINAS, COCHES):
        for f in sorted(carpeta.glob('*.json')):
            nombre = f.stem.split('.')[0]
            t = original = f.read_text()
            for r in aplicables(rs, nombre):
                if r['buscar'] in t:
                    n = t.count(r['buscar'])
                    t = t.replace(r['buscar'], r['reemplazar'])
                    cambios += n
            if t != original:
                f.write_text(t)
                tocados += 1
    for f in sorted(MAGAZINE.rglob('*.md')):
        t = original = f.read_text()
        for r in aplicables(rs, f.stem):
            if r['buscar'] in t:
                cambios += t.count(r['buscar'])
                t = t.replace(r['buscar'], r['reemplazar'])
        if t != original:
            f.write_text(t)
            tocados += 1
    print(f'{cambios} correcciones aplicadas en {tocados} ficheros')
    print(f'({len(rs)} reglas en correcciones.json)')


if __name__ == '__main__':
    sys.exit(main())
