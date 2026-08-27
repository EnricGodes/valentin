#!/usr/bin/env python3
"""
Exporta a un unico JSON todo el texto del sitio que falta por traducir.

Cada entrada lleva su `id`, el texto en espanol y una casilla vacia por idioma
pendiente. Lo ya traducido no se incluye, para no rehacer trabajo.

El fichero resultante se devuelve con las casillas rellenas y lo aplica
15_importar_traducciones.py, que valida antes de escribir nada.

Salida: _migracion/traducciones/PARA-TRADUCIR.json
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
COCHES = RAIZ / 'sitio' / 'src' / 'datos' / 'coches'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
DEST = RAIZ / '_migracion' / 'traducciones' / 'PARA-TRADUCIR.json'
PRIORITARIOS = RAIZ / '_migracion' / 'posts_prioritarios.json'

IDIOMAS = ['en', 'fr', 'de', 'it', 'ca']
# Decision del cliente: los legales se quedan solo en espanol
SIN_TRADUCIR = {'aviso-legal', 'privacidad', 'cookies'}


def idiomas_pendientes(existentes):
    return [i for i in IDIOMAS if i not in existentes]


def entrada(eid, tipo, contexto, es, pendientes, nota=None, limite=None):
    e = {'id': eid, 'tipo': tipo, 'contexto': contexto, 'es': es}
    if limite:
        e['limiteCaracteres'] = limite
    if nota:
        e['nota'] = nota
    e.update({i: '' for i in pendientes})
    return e


def exportar_paginas():
    fuera = []
    for f in sorted(PAGINAS.glob('*.json')):
        nombre = f.stem
        if '.' in nombre or nombre in SIN_TRADUCIR:
            continue
        d = json.loads(f.read_text())
        hechos = {p.stem.rsplit('.', 1)[-1] for p in PAGINAS.glob(f'{nombre}.*.json')}
        pend = idiomas_pendientes(hechos)
        if not pend:
            continue
        ctx = f'Pagina /{nombre} ({d["tipo"]})'

        fuera.append(entrada(f'pagina:{nombre}:meta.titulo', 'meta-titulo',
            f'{ctx} — titulo de la pestaña y del resultado en Google',
            d['meta']['titulo'], pend, limite=60,
            nota='Debe llevar la keyword del mercado, no la traduccion literal del espanol.'))
        fuera.append(entrada(f'pagina:{nombre}:meta.descripcion', 'meta-descripcion',
            f'{ctx} — texto bajo el titulo en Google', d['meta']['descripcion'], pend,
            limite=155))
        if d.get('h1'):
            fuera.append(entrada(f'pagina:{nombre}:h1', 'titular',
                f'{ctx} — titular principal', d['h1'], pend))

        for i, s in enumerate(d['secciones']):
            if s['titulo']:
                fuera.append(entrada(f'pagina:{nombre}:s{i}.titulo', 'titulo-seccion',
                    f'{ctx} — titulo de seccion', s['titulo'], pend))
            for j, p in enumerate(s['parrafos']):
                fuera.append(entrada(f'pagina:{nombre}:s{i}.p{j}', 'parrafo',
                    f'{ctx} — seccion "{s["titulo"][:40] or "(sin titulo)"}"', p, pend,
                    nota=('Conserva las etiquetas <strong>, <em>, <br/> y los <a href> '
                          'exactamente donde estan.') if '<' in p else None))
            for j, it in enumerate(s['items']):
                fuera.append(entrada(f'pagina:{nombre}:s{i}.i{j}', 'elemento-lista',
                    f'{ctx} — lista de "{s["titulo"][:40]}"', it, pend))

        for i, a in enumerate(d.get('acordeones', [])):
            fuera.append(entrada(f'pagina:{nombre}:a{i}.modelo', 'nombre-modelo',
                f'{ctx} — nombre de motorizacion en el desplegable de precios',
                a['modelo'], pend,
                nota='Las designaciones de modelo NO se traducen: 911 SC, Boxster 986, GT3...'))
            for j, p in enumerate(a['parrafos']):
                fuera.append(entrada(f'pagina:{nombre}:a{i}.p{j}', 'parrafo',
                    f'{ctx} — precios de {a["modelo"]}', p, pend,
                    nota='Las cifras y los importes en euros NO se tocan.'))
            for j, it in enumerate(a['items']):
                fuera.append(entrada(f'pagina:{nombre}:a{i}.i{j}', 'elemento-lista',
                    f'{ctx} — precios de {a["modelo"]}', it, pend))
    return fuera


def exportar_coches():
    fuera = []
    for f in sorted(COCHES.glob('*.json')):
        if '.' in f.stem:
            continue
        d = json.loads(f.read_text())
        slug = d['slug']
        hechos = {p.stem.rsplit('.', 1)[-1] for p in COCHES.glob(f'{f.stem}.*.json')}
        pend = idiomas_pendientes(hechos)
        if not pend:
            continue
        nombre = d.get('catalogo', {}).get('nombre') or slug
        ctx = f'Ficha del {nombre}'

        campos = [
            (f'{slug}:meta.titulo', 'meta-titulo', 'titulo en Google', d['meta']['titulo'], 60),
            (f'{slug}:meta.descripcion', 'meta-descripcion', 'descripcion en Google', d['meta']['descripcion'], 155),
            (f'{slug}:hero.eyebrow', 'etiqueta', 'linea sobre el titulo del hero', d['hero']['eyebrow'], None),
            (f'{slug}:hero.claim', 'frase', 'frase bajo el titulo del hero', d['hero']['claim'], None),
            (f'{slug}:hero.precioLabel', 'etiqueta', 'etiqueta bajo el precio', d['hero']['precioLabel'], None),
            (f'{slug}:hero.scrollLabel', 'etiqueta', 'indicador de scroll', d['hero']['scrollLabel'], None),
            (f'{slug}:cierre.cita', 'frase', 'frase de cierre de la ficha', d['cierre']['cita'], None),
            (f'{slug}:cierre.precioLabel', 'etiqueta', 'etiqueta del precio de cierre', d['cierre']['precioLabel'], None),
            (f'{slug}:cierre.ctaTexto', 'boton', 'texto del boton final', d['cierre']['ctaTexto'], 24),
        ]
        for eid, tipo, que, val, lim in campos:
            if val:
                fuera.append(entrada(f'coche:{eid}', tipo, f'{ctx} — {que}', val, pend, limite=lim))

        for bloque in ('intro', 'galeria', 'ingenieria', 'exterior', 'interior',
                       'procedencia', 'specs', 'opinion', 'kit'):
            b = d.get(bloque)
            if not b:
                continue
            if b.get('etiqueta'):
                fuera.append(entrada(f'coche:{slug}:{bloque}.etiqueta', 'etiqueta',
                    f'{ctx} — etiqueta de la seccion {bloque}', b['etiqueta'], pend))
            if b.get('titulo'):
                fuera.append(entrada(f'coche:{slug}:{bloque}.titulo', 'titulo-seccion',
                    f'{ctx} — titulo de la seccion {bloque}', b['titulo'], pend,
                    nota='Conserva <strong> y <br/> donde estan: marcan el salto de linea.'))
            for j, p in enumerate(b.get('parrafos', [])):
                fuera.append(entrada(f'coche:{slug}:{bloque}.p{j}', 'parrafo',
                    f'{ctx} — {bloque}', p, pend))
        # datos, captions y specs
        for j, x in enumerate(d['intro']['datos']):
            fuera.append(entrada(f'coche:{slug}:intro.dato{j}', 'etiqueta',
                f'{ctx} — clave de la tabla de datos', x['clave'], pend))
        for j, x in enumerate(d['galeria']['fotos']):
            if x.get('caption'):
                fuera.append(entrada(f'coche:{slug}:galeria.cap{j}', 'pie-de-foto',
                    f'{ctx} — pie de foto de galeria', x['caption'], pend))
        for j, g in enumerate(d['specs']['grupos']):
            fuera.append(entrada(f'coche:{slug}:specs.g{j}.titulo', 'titulo-seccion',
                f'{ctx} — grupo de la ficha tecnica', g['titulo'], pend))
            for k, fila in enumerate(g['filas']):
                fuera.append(entrada(f'coche:{slug}:specs.g{j}.f{k}', 'etiqueta',
                    f'{ctx} — dato tecnico (solo la clave, el valor no se traduce)',
                    fila['clave'], pend))
    return fuera


def exportar_posts():
    fuera = []
    prioritarios = json.loads(PRIORITARIOS.read_text()) if PRIORITARIOS.exists() else []
    for f in sorted((MAGAZINE / 'es').glob('*.md')):
        slug = f.stem
        hechos = {d.name for d in MAGAZINE.iterdir()
                  if d.is_dir() and d.name != 'es' and (d / f'{slug}.md').exists()}
        pend = idiomas_pendientes(hechos)
        if not pend:
            continue
        texto = f.read_text()
        _, fm, cuerpo = texto.split('---', 2)
        titulo = re.search(r'^title: "(.*)"$', fm, re.M).group(1)
        extracto = re.search(r'^excerpt: "(.*)"$', fm, re.M)
        cta = re.search(r'^  - texto: "(.*)"$', fm, re.M)
        pri = ' [PRIORITARIO: tiene trafico]' if slug in prioritarios else ''
        ctx = f'Articulo del Magazine "{titulo[:50]}"{pri}'

        fuera.append(entrada(f'post:{slug}:title', 'titulo-articulo',
            f'{ctx} — titular y title de Google', titulo, pend, limite=70))
        if extracto and extracto.group(1):
            fuera.append(entrada(f'post:{slug}:excerpt', 'meta-descripcion',
                f'{ctx} — entradilla y meta description', extracto.group(1), pend, limite=200))
        if cta:
            fuera.append(entrada(f'post:{slug}:cta', 'boton',
                f'{ctx} — texto del boton', cta.group(1), pend, limite=24))
        fuera.append(entrada(f'post:{slug}:cuerpo', 'cuerpo-markdown',
            f'{ctx} — cuerpo completo del articulo', cuerpo.strip(), pend,
            nota=('Markdown. NO tocar: las rutas de ![imagen](/img/...), las etiquetas '
                  '<video> e <iframe>, ni los enlaces /magazine/..., /contacto y similares. '
                  'Los ## y ** se mantienen donde estan.')))
    return fuera


def deduplicar(entradas):
    """Agrupa las entradas que repiten el mismo texto.

    "Precios sin IVA incluido." aparece 36 veces y "Mas informacion" 18: pedir
    que se traduzcan una por una es trabajo tirado y, peor, una via para que la
    misma frase acabe traducida de tres maneras distintas en el mismo sitio.
    Se traduce una vez y se aplica a todos sus destinos.
    """
    grupos = {}
    for e in entradas:
        clave = (e['tipo'], e['es'])
        if clave in grupos:
            g = grupos[clave]
            g['destinos'].append(e['id'])
            for i in IDIOMAS:
                if i in e and i not in g:
                    g[i] = ''
        else:
            g = {k: v for k, v in e.items() if k != 'id'}
            g['id'] = e['id']
            g['destinos'] = [e['id']]
            grupos[clave] = g

    fuera = []
    for g in grupos.values():
        if len(g['destinos']) > 1:
            g['contexto'] = f"{g['contexto']} (y {len(g['destinos']) - 1} sitios mas)"
        else:
            g.pop('destinos')
        # orden legible: id, tipo, contexto, nota, limite, es, idiomas, destinos
        orden = ['id', 'tipo', 'contexto', 'nota', 'limiteCaracteres', 'es'] + IDIOMAS + ['destinos']
        fuera.append({k: g[k] for k in orden if k in g})
    return fuera


def main():
    paginas, coches, posts = exportar_paginas(), exportar_coches(), exportar_posts()
    brutas = paginas + coches + posts
    entradas = deduplicar(brutas)

    doc = {
        'formato': 'valentinmotors-traducciones-v1',
        'generado': __import__('datetime').date.today().isoformat(),
        'idiomas': IDIOMAS,
        'instrucciones': [
            'Rellena la casilla de cada idioma en cada entrada. No cambies "id" ni "es".',
            'Si una entrada trae "destinos", ese mismo texto se repite en varios sitios del '
            'sitio y basta con traducirlo una vez.',
            'Las entradas ya traducidas no aparecen en este fichero.',
            'Devuelve el fichero con la MISMA estructura. Lo aplica 15_importar_traducciones.py.',
            'Respeta el glosario: hay terminos que no se traducen en ningun idioma.',
            'Conserva el HTML incrustado (<strong>, <em>, <br/>, <a href>) tal cual.',
            'No traduzcas cifras, precios, matriculas, codigos de color ni designaciones de modelo.',
            'Trato de usted en frances, aleman e italiano. Tuteo en espanol y catalan.',
            'Tono: contenido, preciso, editorial. Sin exclamaciones ni lenguaje de concesionario.',
        ],
        'glosario': {
            'noSeTraducenNunca': [
                'IMS', 'bore scoring', 'backdating', 'Tiptronic', 'PDK', 'PASM', 'PCCB',
                'Targa', 'Speedster', 'Carrera', 'Turbo', 'GT2', 'GT3', 'RS', '4S',
                'Boxster', 'Cayman', 'Cayenne', 'Macan', 'Panamera', 'transaxle',
                'RUF', 'TECHART', 'Nickies', 'NSC', 'NIKASIL', 'track day', 'Motorsport',
                'Porsche Partner Network', 'P.P.N.', 'Valentin Motors', 'VM German Engineering',
                '356', '911', '912', '914', '930', '964', '991', '992', '993', '996', '997',
                'M96', 'M97', 'youngtimer', 'restomod', 'Certificate of Authenticity',
            ],
            'tablaCompleta': 'sitio/src/i18n/glosario.md',
        },
        'resumen': {
            'entradas': len(entradas),
            'entradasAntesDeAgrupar': len(brutas),
            'paginas': len(paginas),
            'fichasDeCoche': len(coches),
            'articulos': len(posts),
            'caracteresEspanol': sum(len(e['es']) for e in entradas),
        },
        'entradas': entradas,
    }
    DEST.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + '\n')

    print(f'{DEST.relative_to(RAIZ)}')
    print(f'  entradas          : {len(entradas)} (de {len(brutas)} antes de agrupar repetidos)')
    print(f'    paginas         : {len(paginas)}')
    print(f'    fichas de coche : {len(coches)}')
    print(f'    articulos       : {len(posts)}')
    print(f'  caracteres espanol: {doc["resumen"]["caracteresEspanol"]:,}')
    print(f'  peso del fichero  : {DEST.stat().st_size / 1024:.0f} KB')


if __name__ == '__main__':
    sys.exit(main())
