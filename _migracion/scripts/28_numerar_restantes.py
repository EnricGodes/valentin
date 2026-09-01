# -*- coding: utf-8 -*-
"""
Alt numerado para los ocho posts que quedaban sin describir.

Misma decision que en `27_numerar_secuencia.py`, ampliada: para las 128 fotos
que faltaban, describir una a una no compensa. Se pone el titulo del articulo
mas la posicion real de la foto dentro de el.

La etiqueta sale del `title` del frontmatter de cada idioma, de modo que la
version alemana no queda con un rotulo en castellano.

Las descripciones escritas a mano se conservan siempre: las 648 del mapa y
tambien las que el autor original ya habia escrito en el articulo ("Aspecto
final motor ya acoplado"), que estan traducidas a los seis idiomas. Solo se
numera lo que tenia como alt el nombre del fichero o nada.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
MAPA = RAIZ / '_migracion/contenido/alts.json'
CONTENIDO = RAIZ / 'sitio/src/content/magazine'
IDIOMAS = ['es', 'en', 'fr', 'it', 'de', 'ca']

ARCHIVO = re.compile(r'\.(jpg|jpeg|png|webp|heic)\s*$', re.I)

SLUGS = [
    'restauracion-motor-964-36',
    'restauracion-motor-964-m64',
    'restauracion-motor-965-turbo-33',
    'restauracion-porsche-911-1965',
    'restauracion-porsche-964-turbo-1991',
    'restauracion-sctarga1979oakgreen',
    'restauracion-sistema-inyeccion-cis',
    'tapicera-original-de-911-serie-f',
    # posteriores al inventario de pendientes, con el nombre del fichero por alt
    'restauracion-incendio-930-turbo-1976',
    '996-m96-34-rotura-arbol-intermedio-ims',
    'motor-serie-g-32',
]


def titulo(idioma, slug):
    md = (CONTENIDO / idioma / f'{slug}.md').read_text(encoding='utf-8')
    m = re.search(r'^title:\s*"(.+?)"\s*$', md, re.M)
    return m.group(1).strip() if m else None


def main():
    alts = json.loads(MAPA.read_text(encoding='utf-8'))
    total = 0

    for slug in SLUGS:
        etiqueta = {i: titulo(i, slug) for i in IDIOMAS}
        faltan = [i for i, t in etiqueta.items() if not t]
        if faltan:
            print(f'{slug}: sin title en {faltan}')
            return 1

        md = (CONTENIDO / 'es' / f'{slug}.md').read_text(encoding='utf-8')
        orden = re.findall(r'!\[([^\]]*)\]\(([^)\s]+)', md)

        nuevas = 0
        for i, (alt, src) in enumerate(orden, start=1):
            if src in alts:            # ya descrita a mano: se respeta
                continue
            if alt and not ARCHIVO.search(alt):   # alt del autor, ya traducido
                continue
            alts[src] = {k: f'{v}, {i}' for k, v in etiqueta.items()}
            nuevas += 1
        total += nuevas
        print(f'{slug}: {len(orden)} fotos, {nuevas} numeradas')

    MAPA.write_text(json.dumps(alts, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'\nnumeradas ahora: {total}\ntotal en el mapa: {len(alts)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
