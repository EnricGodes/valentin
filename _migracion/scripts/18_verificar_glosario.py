#!/usr/bin/env python3
"""
Comprueba las traducciones contra el glosario.

El glosario de sitio/src/i18n/glosario.md fija la equivalencia de los terminos
tecnicos en los seis idiomas. Este script recorre el fichero traducido y avisa
cuando una entrada corta usa una palabra distinta de la fijada.

Nace de un caso real: "Cambio", que en una ficha de coche significa caja de
cambios, se tradujo como "Change", "Changement" y "Veranderung", y "Manual"
(caja manual) como "Handbuch", que es un manual de instrucciones.
"""
import json, re, sys, unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
GLOSARIO = RAIZ / 'sitio' / 'src' / 'i18n' / 'glosario.md'
IDIOMAS = ['en', 'fr', 'it', 'de', 'ca']


def plano(s):
    s = unicodedata.normalize('NFD', s.lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn').strip()


def tabla():
    """Lee la tabla de equivalencias: | es | en | fr | it | de | ca |"""
    fuera = {}
    for linea in GLOSARIO.read_text().splitlines():
        if not linea.startswith('|'):
            continue
        celdas = [c.strip().strip('*') for c in linea.strip('|').split('|')]
        if len(celdas) != 6 or celdas[0] in ('Español', 'Término') or set(celdas[0]) <= set('- '):
            continue
        es = celdas[0]
        fuera[plano(es)] = {'es': es, **dict(zip(IDIOMAS, celdas[1:]))}
    return fuera


def main():
    if len(sys.argv) < 2:
        sys.exit('uso: 18_verificar_glosario.py TRADUCIDO.json')
    glos = tabla()
    doc = json.loads(Path(sys.argv[1]).read_text())
    print(f'{len(glos)} terminos en el glosario\n')

    avisos = []
    for e in doc['entradas']:
        es = plano(e['es'])
        g = glos.get(es)
        if not g:
            continue
        for i in IDIOMAS:
            t = e.get(i, '').strip()
            esperado = g[i]
            if not t or not esperado:
                continue
            # Basta con que la palabra fijada aparezca; el articulo puede variar
            if plano(esperado).split('/')[0] not in plano(t):
                avisos.append((e['id'], i, e['es'], t, esperado))

    if not avisos:
        print('Todas las entradas cortas respetan el glosario.')
        return 0

    print(f'{len(avisos)} entradas se apartan del glosario:\n')
    print(f'{"id":42} {"":3} {"original":14} {"traducido":22} {"glosario"}')
    print('-' * 112)
    for eid, i, es, t, esp in avisos:
        print(f'{eid[:42]:42} {i:>3} {es[:14]:14} {t[:22]:22} {esp}')
    return 1


if __name__ == '__main__':
    sys.exit(main())
