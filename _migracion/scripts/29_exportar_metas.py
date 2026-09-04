#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exporta para traducir los <title> y las meta description reescritos.

    python3 29_exportar_metas.py [salida.json] [--desde REF] [--todo]

Por defecto exporta solo lo que ha cambiado en castellano desde REF (18300fc,
el commit anterior a la reescritura de titles) mas lo que aun no existe en
algun idioma. Con --todo, las 89 entradas.

Por que no reusa 14_exportar_para_traducir.py: aquel exporta la pagina entera y
su importador reconstruye cada post desde el espanol, asi que un lote parcial
dejaria el cuerpo aleman en castellano. Este solo mueve dos campos por entrada
y su importador (30_importar_metas.py) no toca nada mas, ni recalcula la
cobertura de traduccion de la pagina.

Solo se exporta lo que ya existe en los otros cinco idiomas. Las 18 paginas
nuevas del taller y de servicios son de momento solo castellano: traducir su
meta sin traducir la pagina no sirve de nada.
"""
import json, re, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
IDIOMAS = ['en', 'fr', 'de', 'it', 'ca']

# La home se sirve solo en castellano (su <title> vive en index.astro, no en el
# JSON), asi que traducir su meta no llega a ninguna pagina.
SOLO_ES = {'home'}

# El title se corta por ANCHURA (~580 px en escritorio), no por caracteres. El
# aleman alarga entre un 20% y un 35% sobre el espanol: es el que hay que vigilar.
LIM_TITULO, LIM_DESCRIPCION = 70, 160


def frontmatter(f):
    t = f.read_text(encoding='utf-8')
    ini = t.index('---') + 3
    return t[ini:t.index('\n---', ini)]


def campo(fm, nombre):
    m = re.search(rf'^{nombre}:\s*"(.*)"\s*$', fm, re.M)
    return m[1] if m else None


def es_de(ref, ruta):
    """El fichero tal y como estaba en REF, o None si no existia."""
    r = subprocess.run(['git', '-C', str(RAIZ), 'show', f'{ref}:{ruta}'],
                       capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    todo = '--todo' in sys.argv
    ref = next((sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == '--desde'), '18300fc')
    salida = Path(args[0]) if args else \
        RAIZ / '_migracion' / 'traducciones' / 'METAS-PARA-TRADUCIR.json'
    entradas = []

    # ── Paginas de contenido ────────────────────────────────────────────────
    for f in sorted(PAGINAS.glob('*.json')):
        if '.' in f.stem:
            continue
        if not (PAGINAS / f'{f.stem}.en.json').exists():
            continue                      # solo castellano: nada que traducir
        if f.stem in SOLO_ES:
            continue
        es = json.loads(f.read_text(encoding='utf-8'))
        act = {l: json.loads((PAGINAS / f'{f.stem}.{l}.json').read_text(encoding='utf-8'))
               for l in IDIOMAS}
        antes = es_de(ref, f'sitio/src/datos/paginas/{f.name}')
        antes = json.loads(antes)['meta'] if antes else {}
        for c, lim in (('titulo', LIM_TITULO), ('descripcion', LIM_DESCRIPCION)):
            actual = {l: act[l]['meta'][c] for l in IDIOMAS}
            if not todo and antes.get(c) == es['meta'][c] and all(actual.values()):
                continue
            entradas.append({
                'id': f'pagina:{f.stem}:meta.{c}',
                'tipo': f'meta-{c}',
                'contexto': f'{es["h1"]} — {"titulo en Google" if c == "titulo" else "descripcion en Google"}',
                'limiteCaracteres': lim,
                'es': es['meta'][c],
                'actual': actual,
                **{l: '' for l in IDIOMAS},
            })

    # ── Magazine ────────────────────────────────────────────────────────────
    for f in sorted((MAGAZINE / 'es').glob('*.md')):
        fm = frontmatter(f)
        for nombre, c, lim in (('metaTitulo', 'titulo', LIM_TITULO),
                               ('metaDescripcion', 'descripcion', LIM_DESCRIPCION)):
            v = campo(fm, nombre)
            if not v:
                continue
            act = {}
            for l in IDIOMAS:
                g = MAGAZINE / l / f.name
                act[l] = campo(frontmatter(g), nombre) or '' if g.exists() else ''
            viejo = es_de(ref, f'sitio/src/content/magazine/es/{f.name}')
            antes = campo(viejo.split('---')[1], nombre) if viejo else None
            if not todo and antes == v and all(act.values()):
                continue
            entradas.append({
                'id': f'post:{f.stem}:{nombre}',
                'tipo': f'meta-{c}',
                'contexto': f'{campo(fm, "title")} — {"titulo en Google" if c == "titulo" else "descripcion en Google"}',
                'limiteCaracteres': lim,
                'es': v,
                'actual': act,
                **{l: '' for l in IDIOMAS},
            })

    doc = {
        'formato': 'valentinmotors-metas-v1',
        'idiomas': IDIOMAS,
        'instrucciones': [
            'Rellena la casilla de cada idioma en cada entrada. No cambies "id" ni "es".',
            'No es una traduccion literal: cada mercado busca con otras palabras. En aleman '
            '"Porsche Werkstatt" tiene volumen y "atelier" no significa nada; en ingles se '
            'busca "servicing", no "maintenance tariffs".',
            '"actual" es lo que hay publicado hoy en ese idioma. Es un borrador provisional, '
            'no una referencia a respetar: hay que revisarlo o rehacerlo. Puede estar vacio, '
            'y entonces la pagina no tiene ese campo todavia.',
            'Respeta "limiteCaracteres". Google corta el title por anchura en pixeles, no por '
            'caracteres, pero 70 es el margen seguro; el aleman alarga entre un 20% y un 35%.',
            'Respeta el glosario: hay terminos que no se traducen en ningun idioma.',
            'No traduzcas cifras, precios, direcciones, codigos de color ni designaciones de modelo.',
            'La marca se escribe "Valentin Motors" con tilde en la i de Valentin en todos los idiomas.',
            'Trato de usted en frances, aleman e italiano. Tuteo en catalan.',
            'Tono: contenido, preciso, editorial. Sin exclamaciones ni lenguaje de concesionario.',
            'Devuelve el fichero con la MISMA estructura. Lo aplica 30_importar_metas.py.',
        ],
        'glosario': json.loads((RAIZ / '_migracion' / 'traducciones' / 'PARA-TRADUCIR.json')
                               .read_text(encoding='utf-8'))['glosario'],
        'resumen': {
            'entradas': len(entradas),
            'paginas': sum(1 for e in entradas if e['id'].startswith('pagina:')),
            'articulos': sum(1 for e in entradas if e['id'].startswith('post:')),
            'cadenasATraducir': len(entradas) * len(IDIOMAS),
            'caracteresEspanol': sum(len(e['es']) for e in entradas),
        },
        'entradas': entradas,
    }
    salida.parent.mkdir(parents=True, exist_ok=True)
    salida.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{salida.relative_to(RAIZ)}')
    for k, v in doc['resumen'].items():
        print(f'  {k}: {v}')


if __name__ == '__main__':
    main()
