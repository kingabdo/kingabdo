"""Inline the SVG plans into web/template.html -> web/dar-al-fina.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def svg(name, prefix):
    s = (ROOT / "plans" / name).read_text(encoding="utf-8")
    s = re.sub(r'<svg([^>]*?) width="\d+" height="\d+"', r'<svg\1 role="img"', s, count=1)
    for i in ("hatch", "arrow"):  # ids must stay unique once several sheets share a page
        s = s.replace(f'id="{i}"', f'id="{prefix}-{i}"').replace(f"url(#{i})", f"url(#{prefix}-{i})")
    return s


html = (ROOT / "web" / "template.html").read_text(encoding="utf-8")
html = (html.replace("{{GF}}", svg("01-ground-floor.svg", "gf"))
            .replace("{{FF}}", svg("02-first-floor.svg", "ff"))
            .replace("{{EL}}", svg("03-south-elevation.svg", "el")))
(ROOT / "web" / "dar-al-fina.html").write_text(html, encoding="utf-8")
print(len(html), "bytes")
