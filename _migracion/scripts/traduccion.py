# -*- coding: utf-8 -*-
"""
Utilidad para traducir posts del Magazine.

El frontmatter NO se escribe a mano en la traduccion: se copia del espanol y
solo se sobrescriben `title`, `excerpt`, `lang` y el texto de los CTA. Escribir
la fecha o el squarespaceId a mano ya provoco un error: una traduccion quedo
fechada diez dias antes que el original, lo que la habria colocado en otro
sitio del indice.
"""
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent.parent / 'sitio' / 'src' / 'content' / 'magazine'


def partes(slug, idioma='es'):
    t = (BASE / idioma / f'{slug}.md').read_text()
    _, fm, cuerpo = t.split('---', 2)
    return fm, cuerpo


def imagenes(cuerpo):
    return re.findall(r'!\[[^\]]*\]\(([^)]+)\)', cuerpo)


def escribe(slug, idioma, titulo, extracto, cuerpo, cta=None):
    """Genera la traduccion heredando el frontmatter del espanol."""
    fm, _ = partes(slug)
    fm = re.sub(r'^title: .*$', f'title: "{titulo}"', fm, count=1, flags=re.M)
    fm = re.sub(r'^lang: .*$', f'lang: {idioma}', fm, count=1, flags=re.M)
    fm = re.sub(r'^excerpt: .*$', f'excerpt: "{extracto}"', fm, count=1, flags=re.M)
    if cta:
        fm = re.sub(r'^  - texto: .*$', f'  - texto: "{cta}"', fm, count=1, flags=re.M)
    destino = BASE / idioma / f'{slug}.md'
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text('---' + fm + '---\n' + cuerpo.lstrip('\n'))
    return destino


def revisa(slug, idiomas=('en', 'fr', 'de', 'it', 'ca')):
    """Comprueba que cada traduccion hereda fecha, autor e id del espanol."""
    fm_es, cuerpo_es = partes(slug)
    campos = ('date', 'author', 'squarespaceId', 'slugFinal', 'slugOriginal',
              'slugSquarespace', 'categories')
    ref = {c: re.search(rf'^{c}: (.*)$', fm_es, re.M).group(1)
           for c in campos if re.search(rf'^{c}: ', fm_es, re.M)}
    n_img_es = len(imagenes(cuerpo_es))
    fallos = []
    for i in idiomas:
        p = BASE / i / f'{slug}.md'
        if not p.exists():
            continue
        fm, cuerpo = partes(slug, i)
        for c, v in ref.items():
            m = re.search(rf'^{c}: (.*)$', fm, re.M)
            if not m or m.group(1) != v:
                fallos.append(f'{i}: {c} = {m.group(1) if m else "(ausente)"}, deberia ser {v}')
        n = len(imagenes(cuerpo))
        if n != n_img_es:
            fallos.append(f'{i}: {n} imagenes frente a {n_img_es} del espanol')
    return fallos


if __name__ == '__main__':
    # Auditoria de todas las traducciones existentes
    import glob, os, sys
    slugs = sorted(os.path.basename(f)[:-3]
                   for f in glob.glob(str(BASE / 'en' / '*.md')))
    mal = 0
    for s in slugs:
        f = revisa(s)
        if f:
            mal += 1
            print(f'  FALLA  {s}')
            for x in f[:8]:
                print(f'           {x}')
        else:
            print(f'  ok     {s}')
    print(f'\n{len(slugs) - mal}/{len(slugs)} traducciones coherentes con el espanol')
    sys.exit(1 if mal else 0)
