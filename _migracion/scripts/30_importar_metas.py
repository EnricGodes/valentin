#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Aplica el fichero de metas traducidas que devuelve 29_exportar_metas.py.

    python3 30_importar_metas.py METAS-TRADUCIDAS.json [--solo en,de] [--forzar]

Valida ANTES de escribir nada: o entra el lote entero o no se toca un fichero.

A diferencia de 15_importar_traducciones.py, este solo escribe dos campos por
entrada y NO recalcula "traduccion" ni reconstruye el cuerpo del post desde el
castellano. Es un lote parcial: todo lo que no nombre se queda como esta.
"""
import json, re, sys
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
ORIGEN = RAIZ / '_migracion' / 'traducciones' / 'METAS-PARA-TRADUCIR.json'

INVARIANTES = ['Porsche', 'IMS', 'bore scoring', 'backdating', 'Tiptronic',
               'PDK', 'Targa', 'Speedster', 'transaxle', 'RUF', 'Nickies',
               'NSC', 'Boxster', 'Cayman', 'Cayenne', 'Macan', 'M96', 'M97']


def plano(s):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower())
                   if unicodedata.category(c) != 'Mn')


def cifras(s):
    return sorted(re.findall(r'\d[\d.,]*', s))


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    doc = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    ref = {e['id']: e for e in json.loads(ORIGEN.read_text(encoding='utf-8'))['entradas']}
    forzar = '--forzar' in sys.argv
    solo = next((set(sys.argv[i + 1].split(','))
                 for i, a in enumerate(sys.argv) if a == '--solo'), None)
    idiomas = [l for l in doc['idiomas'] if not solo or l in solo]

    graves, avisos, aplicables = [], [], []
    for e in doc['entradas']:
        r = ref.get(e['id'])
        if not r:
            graves.append(f'{e["id"]}: id desconocido'); continue
        if r['es'] != e['es']:
            graves.append(f'{e["id"]}: el castellano ha cambiado'); continue
        for l in idiomas:
            txt = (e.get(l) or '').strip()
            if not txt:
                continue
            if plano(txt) == plano(e['es']) and l != 'ca':
                graves.append(f'{e["id"]} [{l}]: sin traducir')
            for inv in INVARIANTES:
                if inv.lower() in e['es'].lower() and inv.lower() not in txt.lower():
                    graves.append(f'{e["id"]} [{l}]: falta el invariante "{inv}"')
            if cifras(e['es']) != cifras(txt):
                avisos.append(f'{e["id"]} [{l}]: las cifras no coinciden')
            if len(txt) > e['limiteCaracteres']:
                avisos.append(f'{e["id"]} [{l}]: {len(txt)} car., pasa de {e["limiteCaracteres"]}')
            aplicables.append((e['id'], l, txt))

    for a in avisos: print('  aviso:', a)
    for g in graves: print('  GRAVE:', g)
    if graves and not forzar:
        print('\nNo se ha escrito nada. Corrige el fichero o repite con --forzar.')
        return 1

    cache_pag, cache_post = {}, {}
    for ident, l, txt in aplicables:
        tipo, clave, campo = ident.split(':', 2)
        if tipo == 'pagina':
            f = PAGINAS / f'{clave}.{l}.json'
            cache_pag.setdefault(f, json.loads(f.read_text(encoding='utf-8')))
            cache_pag[f]['meta'][campo.split('.')[1]] = txt
        else:
            f = MAGAZINE / l / f'{clave}.md'
            cache_post.setdefault(f, f.read_text(encoding='utf-8'))
            t = cache_post[f]
            ini = t.index('---') + 3
            fin = t.index('\n---', ini)
            fm = t[ini:fin]
            linea = f'{campo}: "{txt}"'
            if re.search(rf'^{campo}:', fm, re.M):
                fm = re.sub(rf'^{campo}:.*$', linea, fm, 1, re.M)
            else:
                # Detras de excerpt, que es su hermano natural.
                m = re.search(r'^excerpt:.*$', fm, re.M)
                pos = m.end() if m else len(fm.rstrip())
                fm = fm[:pos] + '\n' + linea + fm[pos:]
            cache_post[f] = t[:ini] + fm + t[fin:]

    for f, d in cache_pag.items():
        f.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for f, t in cache_post.items():
        f.write_text(t, encoding='utf-8')

    porl = defaultdict(int)
    for _, l, _ in aplicables: porl[l] += 1
    print(f'\n{len(aplicables)} cadenas aplicadas '
          f'({", ".join(f"{l}: {n}" for l, n in sorted(porl.items()))})')
    print(f'{len(cache_pag)} paginas y {len(cache_post)} articulos escritos')
    return 0


if __name__ == '__main__':
    sys.exit(main())
