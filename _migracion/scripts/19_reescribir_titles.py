#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reescribe title y meta description de las paginas que rankean y no reciben clic.

Las nueve paginas de aqui suman 55.000 impresiones en tres meses. El problema no
es que no aparezcan en Google: es que el resultado no invita a entrar.

Google corta el title por ANCHURA en pixeles (~580 en escritorio), no por
numero de caracteres. Por eso el del IMS, con 66 caracteres, cabe entero: son
unos 472 pixeles.

Los titles de las paginas van a datos/paginas/<slug>.json y sobreviven a
regenerar porque este script se ejecuta despues del extractor. Los de los
articulos van al frontmatter como `metaTitulo`, separados del H1.
"""
import json, re, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent.parent
PAGINAS = RAIZ / 'sitio' / 'src' / 'datos' / 'paginas'
MAGAZINE = RAIZ / 'sitio' / 'src' / 'content' / 'magazine' / 'es'

# ruta -> (title, meta). Solo espanol: la traduccion pasa por PARA-TRADUCIR.json
PAGS = {
 'taller': (
  "Taller Porsche: servicios y tarifas · Barcelona y Madrid",
  "Taller Porsche independiente desde 1979. Mantenimiento a precio cerrado, "
  "reparación de IMS y bore scoring, restauración de motores y cajas de cambio."),
 'barcelona': (
  "Taller Porsche en Barcelona · Independiente desde 1979",
  "Especialistas Porsche en Varsòvia 65, junto a la Ronda del Mig. Mantenimiento, "
  "restauración, chapa y pintura y venta, con más de 1.300 m² de taller."),
 'madrid': (
  "Taller Porsche en Madrid · Leganés, desde 1979",
  "Especialistas Porsche en Puig Adam 10, Leganés, a 20 minutos del centro. "
  "Mantenimiento, restauración integral y compraventa en más de 2.500 m²."),
 'tarifa-cayenne-macan': (
  "Mantenimiento Porsche Cayenne y Macan · Precios cerrados",
  "Tarifas cerradas de mantenimiento para Cayenne y Macan en Barcelona y Madrid. "
  "Servicio menor y mayor, averías frecuentes y precios sin sorpresas."),
 'tarifa-911': (
  "Mantenimiento Porsche 911 · Tarifas cerradas por modelo",
  "Precios cerrados de mantenimiento del 911, del Pre 74 al 992. Servicio menor "
  "desde 450 €, servicio mayor desde 525 €. Barcelona y Madrid."),
}

POSTS = {
 'que-es-el-ims-de-porsche': (
  # El titular del articulo sigue siendo "¿Que es el IMS de Porsche?". Este
  # title es solo para Google: quien busca "ims porsche" ya sabe que es.
  "IMS Porsche: cómo saber si tu coche está afectado y cómo se repara",
  "El IMS afecta a los M96 y M97 de 1997 a 2008: 996, 997, Boxster y Cayman. "
  "Cómo saber si tu Porsche está afectado, cómo falla y qué solución tiene."),
 'porsche-bore-scoring': (
  "Bore scoring en Porsche: causas, síntomas y solución",
  "El bore scoring afecta a los M96 y M97 de 1997 a 2008. Cómo reconocerlo, por "
  "qué le pasa al sexto cilindro y por qué encamisar en NSC es la única solución."),
 '10-pelculas-del-siglo-xxi-en-las-que-aparecen-coches-porsche': (
  "10 películas del siglo XXI con un Porsche en escena",
  "Una selección sin spoilers: diez películas de este siglo en las que un Porsche "
  "se lleva el plano. Qué modelo sale en cada una y en qué escena."),
}

# El listado de coches no tenia meta description: Google se inventaba el texto
CATALOGO = (
 "Porsche de colección en venta · Valentín Motors",
 "Selección de Porsche verificados por un especialista independiente desde 1979. "
 "Cada coche con historial documentado y 12 meses de garantía.")


def ancho(t):
    """Aproxima el ancho en pixeles con que Google corta el title."""
    return sum(11 if c.isupper() else 4 if c in 'iljt.,:;!¡ ' else 8 for c in t)


def main():
    print(f'{"pagina":34} {"px":>4} {"meta":>5}  title')
    print('-' * 104)
    for slug, (titulo, meta) in PAGS.items():
        f = PAGINAS / f'{slug}.json'
        d = json.loads(f.read_text())
        d['meta']['titulo'] = titulo
        d['meta']['descripcion'] = meta
        f.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
        aviso = '  !! se corta' if ancho(titulo) > 580 else ''
        print(f'{slug[:34]:34} {ancho(titulo):>4} {len(meta):>5}  {titulo}{aviso}')

    for slug, (titulo, meta) in POSTS.items():
        f = MAGAZINE / f'{slug}.md'
        t = f.read_text()
        _, fm, cuerpo = t.split('---', 2)
        fm = re.sub(r'^metaTitulo: .*\n', '', fm, flags=re.M)
        fm = re.sub(r'^metaDescripcion: .*\n', '', fm, flags=re.M)
        fm = re.sub(r'^(title: .*)$',
                    lambda m: f'{m[1]}\nmetaTitulo: "{titulo}"\nmetaDescripcion: "{meta}"',
                    fm, count=1, flags=re.M)
        f.write_text('---' + fm + '---' + cuerpo)
        aviso = '  !! se corta' if ancho(titulo) > 580 else ''
        print(f'{slug[:34]:34} {ancho(titulo):>4} {len(meta):>5}  {titulo}{aviso}')

    print(f'\nEl catalogo no tenia meta description; se anade en [...ruta].astro:')
    print(f'  {CATALOGO[0]}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
