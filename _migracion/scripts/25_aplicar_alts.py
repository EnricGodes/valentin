# -*- coding: utf-8 -*-
"""
Aplica textos alternativos descritos a mano al Magazine y a las paginas.

Por que hace falta: el 88% de las 857 fotos del Magazine tenia como alt el
nombre del fichero heredado de Squarespace ("DSC04843.JPG", "tap 2.jpg"). Para
un lector de pantalla eso es ruido, y para Google Imagenes es trafico que no
existe, en la seccion que es el segundo activo SEO del sitio y que es 90%
fotografia. En las paginas pasaba lo mismo con 26 fotos de la home, Barcelona
y Madrid.

Entrada: _migracion/contenido/alts.json

    { "/img/magazine/xxx.jpg": {
        "es": "Bloque motor 3.2 desmontado sobre el banco",
        "en": "...", "fr": "...", "it": "...", "de": "...", "ca": "..." } }

Salida, segun donde viva la foto:

    /img/magazine/...  -> sitio/src/content/magazine/<idioma>/*.md
    /img/paginas/...   -> sitio/src/datos/paginas/*.json (y sus .<idioma>.json)

Se aplica por RUTA de imagen, no por posicion, de modo que una foto que sale
en dos sitios recibe la misma descripcion y el script se puede volver a pasar
sin efectos raros. Solo se toca el alt: el pie de foto, que es texto visible
del articulo, no se altera.

Las paginas se regeneran desde el HTML congelado con 11_extraer_paginas.py, asi
que el alt no puede corregirse a mano sobre el JSON: se perderia en la
siguiente pasada. Vive aqui, que es lo que sobrevive.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
MAPA = RAIZ / '_migracion/contenido/alts.json'
CONTENIDO = RAIZ / 'sitio/src/content/magazine'
PAGINAS = RAIZ / 'sitio/src/datos/paginas'
IDIOMAS = ['es', 'en', 'fr', 'it', 'de', 'ca']


def idioma_de_pagina(fichero: Path) -> str:
    """`taller.json` es el castellano; `taller.en.json`, el ingles."""
    partes = fichero.name[:-len('.json')].split('.')
    return partes[-1] if len(partes) > 1 and partes[-1] in IDIOMAS else 'es'


def aplicar_a_paginas(alts, sin_traducir):
    """Las fotos viven dentro del arbol de secciones, en `imagenes`."""
    tocados = puestos = 0
    for f in sorted(PAGINAS.glob('*.json')):
        idioma = idioma_de_pagina(f)
        datos = json.loads(f.read_text(encoding='utf-8'))
        cambiado = False
        for seccion in datos.get('secciones', []):
            for imagen in seccion.get('imagenes', []):
                d = alts.get(imagen.get('url'))
                if not d:
                    continue
                nuevo = d.get(idioma)
                if not nuevo:
                    sin_traducir.add(f'{imagen["url"]} [{idioma}]')
                    continue
                if nuevo != imagen.get('alt'):
                    imagen['alt'] = nuevo
                    puestos += 1
                    cambiado = True
        if cambiado:
            f.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + '\n',
                         encoding='utf-8')
            tocados += 1
    return tocados, puestos


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

    t_pag, p_pag = aplicar_a_paginas(alts, sin_traducir)
    tocados += t_pag
    puestos += p_pag

    print(f'descripciones en el mapa: {len(alts)}')
    print(f'ficheros modificados:     {tocados} ({t_pag} de paginas)')
    print(f'alts escritos:            {puestos} ({p_pag} en paginas)')
    if sin_traducir:
        print(f'\nsin traduccion en algun idioma: {len(sin_traducir)}')
        for x in sorted(sin_traducir)[:6]:
            print(f'  {x}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
