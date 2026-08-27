#!/usr/bin/env python3
"""
Fase 3 - Publicacion del Magazine: lleva los posts extraidos al proyecto Astro
y les asigna su slug definitivo.

Dieciocho posts tienen slugs ilegibles de Squarespace
(`porscheroturasmotorm96valentin-ey2wg` es "Rehabilitacion motor completo 3.2
serie G coupe 1985"). El inventario de URLs ya decidio su slug nuevo y su 301;
aqui se aplica esa decision, dejando constancia del slug viejo en el
frontmatter para poder generar las redirecciones desde el contenido.
"""
import csv, json, re, shutil, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
ORIGEN = RAIZ / '_migracion' / 'contenido' / 'magazine' / 'es'
DESTINO = RAIZ / 'sitio' / 'src' / 'content' / 'magazine' / 'es'
INVENTARIO = RAIZ / '_migracion' / 'informes' / 'inventario_urls.csv'


def renombrados():
    """slug viejo -> slug nuevo, segun el inventario."""
    fuera = {}
    for f in csv.DictReader(INVENTARIO.open()):
        if f['accion'] != '301':
            continue
        o, d = f['url'], f['destino']
        if o.startswith('/magazine/') and d.startswith('/magazine/'):
            viejo, nuevo = o[len('/magazine/'):], d[len('/magazine/'):]
            if viejo and nuevo and viejo != nuevo:
                fuera[viejo] = nuevo
    return fuera


def correcciones():
    """Mismas correcciones aprobadas que en las paginas.

    Ojo: esto toca el texto del blog, que por regla del proyecto se migra
    identico. Se hace solo con las cifras que el cliente ha corregido de forma
    explicita, y queda registrado aqui para que se vea.
    """
    ruta = RAIZ / '_migracion' / 'correcciones.json'
    if not ruta.exists():
        return []
    datos = json.loads(ruta.read_text())
    return [r for bloque in datos.values() if isinstance(bloque, dict)
            for r in bloque.get('reglas', [])]


def main():
    if DESTINO.exists():
        shutil.rmtree(DESTINO)
    DESTINO.mkdir(parents=True)

    mapa = renombrados()
    reglas = correcciones()
    cambiados = corregidos = 0
    for md in sorted(ORIGEN.glob('*.md')):
        texto = md.read_text()
        m = re.search(r'^slugSquarespace: "([^"]+)"', texto, re.M)
        if not m:
            sys.exit(f'{md.name}: sin slug en el frontmatter')
        viejo = m.group(1)
        nuevo = mapa.get(viejo, viejo)

        # slugFinal es el que se publica; slugOriginal alimenta el _redirects
        extra = f'slugFinal: "{nuevo}"\nslugOriginal: "{viejo}"\n'
        texto = texto.replace(f'slugSquarespace: "{viejo}"\n',
                              f'slugSquarespace: "{viejo}"\n{extra}', 1)

        for r in reglas:
            if r['buscar'] in texto:
                texto = texto.replace(r['buscar'], r['reemplazar'])
                corregidos += 1

        nombre = re.sub(r'[^A-Za-z0-9._-]', '-', nuevo) + '.md'
        (DESTINO / nombre).write_text(texto)
        if nuevo != viejo:
            cambiados += 1
            print(f'  {viejo}\n    -> {nuevo}')

    total = len(list(DESTINO.glob('*.md')))
    print(f'\n{total} posts publicados en {DESTINO.relative_to(RAIZ)}')
    print(f'{cambiados} con slug nuevo, {total - cambiados} conservan el suyo')
    print(f'{corregidos} correcciones de contenido aplicadas')


if __name__ == '__main__':
    main()
