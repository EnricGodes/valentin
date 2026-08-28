# -*- coding: utf-8 -*-
"""
Aplica textos alternativos descritos a mano a los 252 posts del Magazine.

Por que hace falta: el 88% de las 857 fotos tenia como alt el nombre del
fichero heredado de Squarespace ("DSC04843.JPG", "tap 2.jpg"). Para un lector
de pantalla eso es ruido, y para Google Imagenes es trafico que no existe, en
la seccion que es el segundo activo SEO del sitio y que es 90% fotografia.

Entrada: _migracion/contenido/alts.json

    { "/img/magazine/xxx.jpg": {
        "es": "Bloque motor 3.2 desmontado sobre el banco",
        "en": "...", "fr": "...", "it": "...", "de": "...", "ca": "..." } }

Se aplica por RUTA de imagen, no por posicion, de modo que una foto que sale
en dos posts recibe la misma descripcion y el script se puede volver a pasar
sin efectos raros. Solo se toca el alt: el pie de foto, que es texto visible
del articulo, no se altera.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
MAPA = RAIZ / '_migracion/contenido/alts.json'
CONTENIDO = RAIZ / 'sitio/src/content/magazine'
IDIOMAS = ['es', 'en', 'fr', 'it', 'de', 'ca']


def main():
    if not MAPA.exists():
        print(f'no existe {MAPA}')
        return 1
    alts = json.loads(MAPA.read_text(encoding='utf-8'))

    tocados = puestos = 0
    sin_traducir = set()

    for idioma in IDIOMAS:
        for p in sorted((CONTENIDO / idioma).glob('*.md')):
            t = p.read_text(encoding='utf-8')

            def sustituir(m):
                nonlocal puestos
                alt, resto = m.group(1), m.group(2)
                src = resto.split(' ', 1)[0].rstrip(')')
                d = alts.get(src)
                if not d:
                    return m.group(0)
                nuevo = d.get(idioma)
                if not nuevo:
                    sin_traducir.add(f'{src} [{idioma}]')
                    return m.group(0)
                if nuevo == alt:
                    return m.group(0)
                puestos += 1
                # El alt no admite corchetes sin escapar
                return f'![{nuevo.replace("[", "(").replace("]", ")")}]({resto}'

            nuevo_t = re.sub(r'!\[([^\]]*)\]\(([^)]*\))', sustituir, t)
            if nuevo_t != t:
                p.write_text(nuevo_t, encoding='utf-8')
                tocados += 1

    print(f'descripciones en el mapa: {len(alts)}')
    print(f'ficheros modificados:     {tocados}')
    print(f'alts escritos:            {puestos}')
    if sin_traducir:
        print(f'\nsin traduccion en algun idioma: {len(sin_traducir)}')
        for x in sorted(sin_traducir)[:6]:
            print(f'  {x}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
