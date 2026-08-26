#!/usr/bin/env python3
"""
Fase 1 - Rehospedaje: descarga las imagenes del Magazine alojadas en el CDN de
Squarespace y reescribe las rutas en los Markdown.

Es el paso critico de la migracion: el dia que se cancele Squarespace,
`images.squarespace-cdn.com` deja de servir y el blog se queda sin fotos.

Salidas:
  contenido/imagenes/<hash8>-<nombre>   ficheros descargados
  contenido/imagenes_mapa.json          URL original -> ruta local
  y los .md quedan reescritos apuntando a /img/magazine/<fichero>
"""
import hashlib, json, re, sys, time, urllib.parse, urllib.request, urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "contenido" / "imagenes"
MD = ROOT / "contenido" / "magazine" / "es"
RUTA_WEB = "/img/magazine/"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"


def nombre_local(url):
    """Nombre estable y sin colisiones: hash corto de la URL + nombre original."""
    h = hashlib.sha1(url.encode()).hexdigest()[:8]
    base = urllib.parse.unquote(url.rsplit("/", 1)[-1])
    base = re.sub(r"[^A-Za-z0-9._-]", "-", base).strip("-.") or "imagen"
    base = re.sub(r"-{2,}", "-", base)[:80]
    if "." not in base:
        base += ".jpg"
    return f"{h}-{base}"


def bajar(url):
    dest = DEST / nombre_local(url)
    if dest.exists() and dest.stat().st_size > 0:
        return url, dest.name, dest.stat().st_size, "cache"
    for intento in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            if not data:
                raise ValueError("respuesta vacia")
            dest.write_bytes(data)
            return url, dest.name, len(data), "ok"
        except Exception as e:
            if intento == 2:
                return url, None, 0, f"ERROR: {type(e).__name__} {e}"
            time.sleep(1.5 * (intento + 1))


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    inv = json.loads((ROOT / "contenido" / "imagenes.json").read_text())
    urls = sorted({i["url"] for i in inv["imagenes"]})
    print(f"Imagenes unicas a descargar: {len(urls)}\n")

    res = []
    with ThreadPoolExecutor(max_workers=6) as ex:
        for n, r in enumerate(ex.map(bajar, urls), 1):
            res.append(r)
            if n % 100 == 0:
                print(f"  {n}/{len(urls)}", flush=True)

    mapa, fallos, total = {}, [], 0
    for url, name, size, estado in res:
        if name:
            mapa[url] = RUTA_WEB + name
            total += size
        else:
            fallos.append((url, estado))

    (ROOT / "contenido" / "imagenes_mapa.json").write_text(
        json.dumps({"ruta_web": RUTA_WEB, "descargadas": len(mapa),
                    "fallidas": len(fallos), "bytes": total, "mapa": mapa},
                   indent=2, ensure_ascii=False))

    # --- reescritura de los Markdown
    tocados = pendientes = 0
    for f in sorted(MD.glob("*.md")):
        t = orig = f.read_text()
        for url, local in mapa.items():
            t = t.replace(url, local)
        if t != orig:
            f.write_text(t)
            tocados += 1
        pendientes += len(re.findall(r"https://images\.squarespace-cdn\.com", t))

    mb = total / 1024 / 1024
    print(f"\nDescargadas : {len(mapa)}/{len(urls)}  ({mb:.1f} MB)")
    print(f"Markdown    : {tocados} ficheros reescritos")
    print(f"Pendientes  : {pendientes} referencias al CDN de Squarespace sin migrar")
    if fallos:
        print(f"\n!! {len(fallos)} descargas fallidas:")
        for u, e in fallos[:20]:
            print(f"   {e}  {u}")
    return 1 if (fallos or pendientes) else 0


if __name__ == "__main__":
    sys.exit(main())
