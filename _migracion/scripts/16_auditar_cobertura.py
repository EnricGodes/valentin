#!/usr/bin/env python3
"""
Audita que PARA-TRADUCIR.json cubre TODO el texto traducible del sitio.

Recorre los datos reales campo por campo, se queda con lo que es texto para un
lector humano, y comprueba si aparece en el fichero de exportacion. Lo que no
aparezca sale listado: o falta en el exportador, o hay una razon para excluirlo.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
COCHES = RAIZ / 'sitio' / 'src' / 'datos' / 'coches'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine'
EXPORT = RAIZ / '_migracion' / 'traducciones' / 'PARA-TRADUCIR.json'

SIN_TRADUCIR = {'aviso-legal', 'privacidad', 'cookies'}

# Campos que a proposito no se exportan, con el motivo. Si algo aparece aqui es
# porque se decidio, no porque se olvidara.
EXCLUIDOS = {
    'hero.titulo':     'designacion de modelo ("RUF Kompressor R", "Carrera 4S")',
    'hero.subtitulo':  'designacion de modelo ("Porsche 997")',
    'catalogo.marca':  'marca ("Porsche · RUF")',
    'catalogo.nombre': 'designacion de modelo ("356 B Cabriolet")',
    'opinion.nombre':  'nombre de una persona',
}

# Campos que son datos, no prosa: no se traducen
NO_ES_TEXTO = {
    'slug', 'archivoOriginal', 'realce', 'rutaId', 'tipo', 'ficheroOriginal',
    'src', 'url', 'href', 'imagen', 'foto', 'ogImagen', 'ancho', 'alto',
    'ctaHref', 'squarespaceId', 'originalUrl', 'estado', 'precio',
    'precioPorConsultar', 'imagenAncho', 'imagenAlto', 'fotoAncho', 'fotoAlto',
    'valor', 'unidad', 'animado', 'destacada', 'acento', 'nivel', 'ancla',
    'anio', 'telefonos', 'emails', 'precioTachado', 'traduccion',
}


def cadenas(obj, ruta=''):
    """Todas las cadenas de texto humano, con la ruta donde viven."""
    fuera = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in NO_ES_TEXTO:
                continue
            fuera += cadenas(v, f'{ruta}.{k}' if ruta else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            fuera += cadenas(v, f'{ruta}[{i}]')
    elif isinstance(obj, str):
        t = obj.strip()
        # Descarta lo que no es prosa: rutas, fechas, codigos
        if (len(t) > 2 and not t.startswith('/') and not t.startswith('http')
                and not re.fullmatch(r'[\d\s.,:/€%-]+', t)):
            fuera.append((ruta, t))
    return fuera


def main():
    doc = json.loads(EXPORT.read_text())
    exportado = set()
    for e in doc['entradas']:
        exportado.add(e['es'].strip())

    faltan = []

    for f in sorted(PAGINAS.glob('*.json')):
        if '.' in f.stem or f.stem in SIN_TRADUCIR:
            continue
        d = json.loads(f.read_text())
        hechos = {p.stem.rsplit('.', 1)[-1] for p in PAGINAS.glob(f'{f.stem}.*.json')}
        if len(hechos) >= 5:
            continue
        for ruta, t in cadenas(d):
            if t not in exportado:
                faltan.append(('pagina', f.stem, ruta, t))

    for f in sorted(COCHES.glob('*.json')):
        if '.' in f.stem:
            continue
        d = json.loads(f.read_text())
        hechos = {p.stem.rsplit('.', 1)[-1] for p in COCHES.glob(f'{f.stem}.*.json')}
        if len(hechos) >= 5:
            continue
        for ruta, t in cadenas(d):
            if t in exportado:
                continue
            if re.sub(r'\[\d+\]', '[]', ruta) in EXCLUIDOS:
                continue
            faltan.append(('coche', f.stem, ruta, t))

    print(f'Textos distintos en el export : {len(exportado)}')
    print(f'Textos NO cubiertos           : {len(faltan)}')
    print(f'\nExcluidos a proposito ({len(EXCLUIDOS)} campos):')
    for k, v in EXCLUIDOS.items():
        print(f'  {k:22} {v}')
    if not faltan:
        print('\nCobertura completa: todo lo traducible esta en el fichero.')
        return 0
    print()

    from collections import Counter
    campos = Counter(re.sub(r'\[\d+\]', '[]', r) for _, _, r, _ in faltan)
    print('Por campo:')
    for k, v in campos.most_common(40):
        ej = next(t for _, _, r, t in faltan if re.sub(r'\[\d+\]', '[]', r) == k)
        print(f'  {v:>4}  {k:44} p.ej. {ej[:52]!r}')
    return 1


if __name__ == '__main__':
    sys.exit(main())
