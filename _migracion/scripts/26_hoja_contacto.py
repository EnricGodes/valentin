# -*- coding: utf-8 -*-
"""
Monta una hoja de contacto numerada con las fotos pendientes de describir.

Describir 775 fotos de una en una son 775 lecturas. En una rejilla de seis,
con cada foto numerada y a resolucion suficiente para reconocer modelo, color
y escena, son 130. El numero de la esquina es lo que permite luego devolver
cada descripcion a su fichero sin equivocarse.

  python3 26_hoja_contacto.py <n> [tam]   n = indice de la hoja, desde 0
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parents[2]
PUB = RAIZ / 'sitio/public'
POR_HOJA = 12
COLS = 4
CELDA = 560


def pendientes():
    pend = json.loads((RAIZ / '_migracion/contenido/alts_pendientes.json').read_text())
    hechas = set(json.loads((RAIZ / '_migracion/contenido/alts.json').read_text()))
    return [s for s in pend if s not in hechas]


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    todas = pendientes()
    trozo = todas[n * POR_HOJA:(n + 1) * POR_HOJA]
    if not trozo:
        print('no quedan fotos pendientes')
        return 1

    filas = (len(trozo) + COLS - 1) // COLS
    hoja = Image.new('RGB', (COLS * CELDA, filas * CELDA), (18, 18, 17))
    dib = ImageDraw.Draw(hoja)

    for i, src in enumerate(trozo):
        f = PUB / src.lstrip('/')
        try:
            im = Image.open(f).convert('RGB')
        except Exception as e:
            print(f'  {i}: no se puede abrir {src}: {e}')
            continue
        im.thumbnail((CELDA - 8, CELDA - 8))
        x = (i % COLS) * CELDA + (CELDA - im.width) // 2
        y = (i // COLS) * CELDA + (CELDA - im.height) // 2
        hoja.paste(im, (x, y))
        # Numero en un recuadro, para que se lea sobre cualquier foto
        ex, ey = (i % COLS) * CELDA + 6, (i // COLS) * CELDA + 6
        dib.rectangle([ex, ey, ex + 46, ey + 34], fill=(0, 0, 0))
        dib.text((ex + 16, ey + 10), str(i), fill=(255, 220, 130))

    salida = RAIZ / '_migracion/contenido/hoja.jpg'
    hoja.save(salida, quality=88)
    print(f'hoja {n}: {len(trozo)} fotos, {hoja.width}x{hoja.height}')
    for i, s in enumerate(trozo):
        print(f'  {i}  {s}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
