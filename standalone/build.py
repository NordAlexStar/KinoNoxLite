#!/usr/bin/env python3
"""Saliek KinoNoxLite vienā HTML failā (bez servera, bez papildu mapju).

Lietošana:  python3 standalone/build.py
Rezultāts:  standalone/KinoNoxLite.html

Prasības: Python 3 un Pillow (attēlu saspiešanai).
"""
import base64
import glob
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "standalone", "KinoNoxLite.html")


def webp_data_uri(path, width, quality):
    im = Image.open(path).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=quality, method=6)
    payload = base64.b64encode(buf.getvalue()).decode()
    return "data:image/webp;base64," + payload, len(buf.getvalue())


def main():
    read = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()
    html = read("index.html")
    css = read("styles.css") + "\n" + read("imagery.css")
    js = read("app.js")

    hero, hero_size = webp_data_uri(os.path.join(ROOT, "assets", "cinema-hero.png"), 1280, 70)
    css = css.replace("url('assets/cinema-hero.png')", f"url('{hero}')")

    # Список постеров больше не захардкожен: новый фильм с новым постером ломал сборку
    # («осталась ссылка на assets/»), потому что имя надо было вписать ещё и сюда.
    posters = sorted(
        os.path.splitext(os.path.basename(p))[0]
        for p in glob.glob(os.path.join(ROOT, "assets", "poster-*.png"))
    )
    total = hero_size
    for name in posters:
        uri, size = webp_data_uri(os.path.join(ROOT, "assets", name + ".png"), 640, 72)
        js = js.replace(f"url('assets/{name}.png')", f"url('{uri}')")
        total += size

    if "assets/" in css or "assets/" in js:
        raise SystemExit("Kļūda: palika atsauce uz assets/ — pārbaudiet failu nosaukumus.")

    html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + css + "\n</style>")
    html = html.replace('<link rel="stylesheet" href="imagery.css">', "")
    html = html.replace('<script src="app.js"></script>', "<script>\n" + js + "\n</script>")
    html = html.replace("KINO NOX Lite</title>", "KINO NOX Lite (viena faila versija)</title>")

    open(OUT, "w", encoding="utf-8").write(html)
    print(f"Gatavs: {OUT}")
    print(f"Izmērs: {os.path.getsize(OUT) // 1024} KB (attēli ~{total // 1024} KB)")


if __name__ == "__main__":
    main()
