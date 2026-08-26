#!/usr/bin/env python3
"""
Fase 0 - Blindaje: snapshot completo de valentinmotors.es (Squarespace).

Descarga, para cada URL del sitemap:
  - el HTML crudo (gzip, en snapshot/html/)
  - la representacion JSON de Squarespace (?format=json-pretty, en snapshot/json/)
y genera snapshot/manifest.json con status, pesos, title, description y h1.

Es la red de seguridad de la migracion y la fuente de verdad contra la que
se validara la paridad de contenido del sitio nuevo.
"""
import gzip, json, re, sys, time, urllib.request, urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.valentinmotors.es"
ROOT = Path(__file__).resolve().parent.parent
SNAP = ROOT / "snapshot"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"


def fetch(url, timeout=45):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read()
            if r.headers.get("Content-Encoding") == "gzip":
                raw = gzip.decompress(raw)
            return r.status, raw, r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, e.read() or b"", url
    except Exception as e:
        return 0, str(e).encode(), url


def slug(path):
    s = path.strip("/") or "_home"
    return re.sub(r"[^A-Za-z0-9._-]", "_", s)


def meta(html):
    t = re.search(r"<title[^>]*>(.*?)</title>", html, re.S | re.I)
    d = re.search(r'<meta[^>]+name="description"[^>]+content="(.*?)"', html, re.S | re.I)
    h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    clean = lambda x: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", x)).strip()
    return (clean(t.group(1)) if t else None,
            clean(d.group(1)) if d else None,
            [clean(x) for x in h1])


def sitemap_urls():
    st, raw, _ = fetch(f"{BASE}/sitemap.xml")
    if st != 200:
        sys.exit(f"sitemap.xml devolvio {st}")
    urls = re.findall(r"<loc>([^<]+)</loc>", raw.decode("utf8", "replace"))
    # el sitemap de Squarespace lista /home pero no la raiz: la anadimos a mano
    return sorted(set(urls) | {BASE + "/"})


def grab(url):
    path = url[len(BASE):] or "/"
    name = slug(path)
    st, raw, final = fetch(url)
    rec = {"url": url, "path": path, "file": name, "status": st,
           "bytes": len(raw), "final_url": final}
    if st == 200:
        (SNAP / "html" / f"{name}.html.gz").write_bytes(gzip.compress(raw))
        html = raw.decode("utf8", "replace")
        rec["title"], rec["description"], rec["h1"] = meta(html)
        sep = "&" if "?" in url else "?"
        jst, jraw, _ = fetch(f"{url}{sep}format=json-pretty")
        if jst == 200 and jraw.lstrip()[:1] == b"{":
            (SNAP / "json" / f"{name}.json").write_bytes(jraw)
            rec["json"] = True
    print(f"  {st}  {len(raw):>7}  {path}", flush=True)
    time.sleep(0.15)
    return rec


def main():
    urls = sitemap_urls()
    print(f"Sitemap: {len(urls)} URLs\n")
    with ThreadPoolExecutor(max_workers=4) as ex:
        recs = list(ex.map(grab, urls))
    recs.sort(key=lambda r: r["path"])
    man = {"base": BASE, "captured_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
           "count": len(recs), "pages": recs}
    (SNAP / "manifest.json").write_text(json.dumps(man, indent=2, ensure_ascii=False))
    ok = sum(1 for r in recs if r["status"] == 200)
    print(f"\n{ok}/{len(recs)} OK | {sum(1 for r in recs if r.get('json'))} con JSON")
    for r in recs:
        if r["status"] != 200:
            print(f"  !! {r['status']}  {r['path']}")


if __name__ == "__main__":
    main()
