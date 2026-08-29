# -*- coding: utf-8 -*-
"""
Alt numerado para las secuencias de taller largas.

Decision del cliente: en `rehabilitacion-motor-32-serie-g-1985`, 187 fotos del
despiece y montaje de un motor 3.2, describir cada una no aporta. Se pone un
alt correlativo con la posicion real de la foto dentro del articulo.

Las 116 ya descritas se conservan: son trabajo hecho y una descripcion real
siempre vale mas que un numero. Se numeran solo las que faltan.

El texto se traduce a los seis idiomas: es una etiqueta fija, y dejar
"Rehabilitacion motor" en la version alemana seria dejar el articulo a medio
traducir.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SLUG = 'rehabilitacion-motor-32-serie-g-1985'

ETIQUETA = {
    'es': 'Rehabilitación motor 3.2 serie G',
    'en': '3.2 G-series engine rebuild',
    'fr': 'Réfection moteur 3.2 série G',
    'it': 'Revisione motore 3.2 serie G',
    'de': 'Motorüberholung 3.2 G-Serie',
    'ca': 'Rehabilitació motor 3.2 sèrie G',
}


def main():
    alts = json.loads((RAIZ / '_migracion/contenido/alts.json').read_text(encoding='utf-8'))
    md = (RAIZ / f'sitio/src/content/magazine/es/{SLUG}.md').read_text(encoding='utf-8')
    orden = re.findall(r'!\[[^\]]*\]\(([^)\s]+)', md)

    nuevas = 0
    for i, src in enumerate(orden, start=1):
        if src in alts:            # ya descrita a mano: se respeta
            continue
        alts[src] = {k: f'{v}, {i}' for k, v in ETIQUETA.items()}
        nuevas += 1

    (RAIZ / '_migracion/contenido/alts.json').write_text(
        json.dumps(alts, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'fotos del post: {len(orden)}')
    print(f'  descritas a mano, conservadas: {len(orden) - nuevas}')
    print(f'  numeradas ahora:               {nuevas}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
