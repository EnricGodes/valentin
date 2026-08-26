#!/usr/bin/env python3
"""
Fase 1bis - Rescate de los videos del Magazine.

Seis posts llevan video alojado en Squarespace (bloques `sqs-native-video`,
servidos como HLS desde video.squarespace-cdn.com). Como las imagenes, mueren
el dia que se cancele la cuenta, y a diferencia de las imagenes no se pueden
descargar con un GET: hay que consolidar el stream HLS en un MP4.

El conversor de posts los estaba descartando, asi que el post del IMS (401
clics organicos en 3 meses) tenia un titulo "Video explicativo sobre el IMS"
seguido de nada.

Salida: contenido/videos/<id>.mp4 y contenido/videos.json
"""
import html, json, subprocess, sys
from pathlib import Path
from bs4 import BeautifulSoup

RAIZ = Path(__file__).resolve().parent.parent
SNAP = RAIZ / 'snapshot' / 'json'
DEST = RAIZ / 'contenido' / 'videos'


def videos_de(body, slug):
    s = BeautifulSoup(body, 'lxml')
    fuera = []
    for v in s.select('.sqs-native-video'):
        cfg = v.get('data-config-video')
        if not cfg:
            continue
        try:
            c = json.loads(html.unescape(cfg))
        except json.JSONDecodeError:
            continue
        base = c.get('alexandriaUrl', '').replace('/{variant}', '')
        if not base:
            continue
        fuera.append({
            'post': slug,
            'id': c.get('systemDataId') or c.get('id'),
            'playlist': f'{base}/playlist.m3u8',
            'aspectRatio': c.get('aspectRatio'),
            'duracion': c.get('durationSeconds'),
            'variantes': c.get('systemDataVariants'),
        })
    return fuera


def descargar(v):
    salida = DEST / f"{v['id']}.mp4"
    if salida.exists() and salida.stat().st_size > 0:
        return salida, 'cache'
    # -c copy: los segmentos ya son H.264/AAC, no hay que recodificar nada
    r = subprocess.run(
        ['ffmpeg', '-y', '-loglevel', 'error',
         '-user_agent', 'Mozilla/5.0',
         # ffmpeg 8 rechaza segmentos sin extension conocida y los de
         # Squarespace no la llevan
         '-allowed_extensions', 'ALL', '-extension_picky', '0',
         '-i', v['playlist'], '-c', 'copy', '-bsf:a', 'aac_adtstoasc',
         str(salida)],
        capture_output=True, text=True, timeout=600)
    if r.returncode != 0 or not salida.exists():
        return None, (r.stderr or 'fallo de ffmpeg').strip()[:200]
    return salida, 'ok'


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    todos = []
    for f in sorted(SNAP.glob('magazine_*.json')):
        if 'category' in f.name:
            continue
        it = json.loads(f.read_text()).get('item')
        if it and it.get('body'):
            todos += videos_de(it['body'], it['urlId'])

    print(f'{len(todos)} videos nativos en {len({v["post"] for v in todos})} posts\n')
    mapa, fallos = {}, []
    for v in todos:
        ruta, estado = descargar(v)
        if ruta:
            mb = ruta.stat().st_size / 1024 / 1024
            v['fichero'] = f'/video/magazine/{ruta.name}'
            v['bytes'] = ruta.stat().st_size
            mapa[v['id']] = v
            print(f'  {estado:6} {mb:7.1f} MB  {v["post"][:44]:44} {v["id"][:8]}')
        else:
            fallos.append((v, estado))
            print(f'  ERROR  {v["post"][:44]:44} {estado[:70]}')

    (RAIZ / 'contenido' / 'videos.json').write_text(
        json.dumps({'total': len(mapa), 'videos': list(mapa.values())},
                   indent=2, ensure_ascii=False))
    total_mb = sum(v['bytes'] for v in mapa.values()) / 1024 / 1024
    print(f'\n{len(mapa)}/{len(todos)} descargados ({total_mb:.1f} MB)')
    return 1 if fallos else 0


if __name__ == '__main__':
    sys.exit(main())
