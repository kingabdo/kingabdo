"""Generate the conceptual (non-CAD) plans and south elevation as SVG.

All coordinates are in metres on the 10 x 10 m plot:
x = 0 at the west (left, seen from the street) -> 10 at the east,
y = 0 at the street facade (south) -> 10 at the rear party wall (north).
Rooms are drawn as clear internal spaces on a wall-coloured plot, so the
gaps between rectangles are the walls (party walls 0.20, facade 0.25,
internal 0.10-0.15).
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "plans"
S = 60          # px per metre
M = 90          # margin px
FONT = "Noto Naskh Arabic, Amiri, Tahoma, Arial, sans-serif"

COL = {
    "wall": "#4a4a48",
    "room": "#fbf8f2",
    "wet": "#e8f0f3",
    "garage": "#e6e3dd",
    "open": "#e9dfc8",
    "stair": "#f1ece2",
    "ink": "#2b2b2a",
    "mute": "#77736b",
    "glass": "#5b8fa8",
    "door": "#fbf8f2",
}


def px(x):
    return M + x * S


def py(y):
    return M + (10 - y) * S


def rect(x0, x1, y0, y1, fill, extra=""):
    return (f'<rect x="{px(x0):.1f}" y="{py(y1):.1f}" width="{(x1 - x0) * S:.1f}" '
            f'height="{(y1 - y0) * S:.1f}" fill="{fill}" {extra}/>')


def text(x, y, s, size=13, weight="normal", color=None, anchor="middle"):
    color = color or COL["ink"]
    return (f'<text x="{px(x):.1f}" y="{py(y):.1f}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" fill="{color}" text-anchor="{anchor}" '
            f'direction="rtl">{s}</text>')


def room(r):
    x0, x1, y0, y1, kind, label, sub = r
    out = [rect(x0, x1, y0, y1, COL[kind])]
    if kind == "open":
        out.append(rect(x0, x1, y0, y1, "url(#hatch)"))
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    if label:
        out.append(text(cx, cy + 0.12, label, 14, "bold"))
        area = (x1 - x0) * (y1 - y0)
        dims = f"{x1 - x0:.2f}×{y1 - y0:.2f} م ≈ {area:.1f} م²"
        out.append(text(cx, cy - 0.25, sub or dims, 10.5, color=COL["mute"]))
    return "\n".join(out)


def opening(x0, x1, y0, y1, kind="door"):
    if kind == "door":
        return rect(x0, x1, y0, y1, COL["door"])
    # window: pale gap with a glass line along its long axis
    g = [rect(x0, x1, y0, y1, "#ffffff")]
    if (x1 - x0) > (y1 - y0):
        ym = (y0 + y1) / 2
        g.append(f'<line x1="{px(x0):.1f}" y1="{py(ym):.1f}" x2="{px(x1):.1f}" y2="{py(ym):.1f}" '
                 f'stroke="{COL["glass"]}" stroke-width="2.5"/>')
    else:
        xm = (x0 + x1) / 2
        g.append(f'<line x1="{px(xm):.1f}" y1="{py(y0):.1f}" x2="{px(xm):.1f}" y2="{py(y1):.1f}" '
                 f'stroke="{COL["glass"]}" stroke-width="2.5"/>')
    return "\n".join(g)


def stair(first_floor=False):
    """U-stair, flights along x: lower flight y 3.7-4.7 rises east from x 6.55,
    half landing x 8.71-9.8, upper flight y 4.8-5.8 returns west to x 6.55."""
    g = [rect(6.55, 9.8, 3.7, 5.8, COL["stair"])]
    for i in range(9):
        x = 6.55 + i * 0.27
        for (ya, yb) in ((3.7, 4.7), (4.8, 5.8)):
            g.append(f'<line x1="{px(x):.1f}" y1="{py(ya):.1f}" x2="{px(x):.1f}" y2="{py(yb):.1f}" '
                     f'stroke="{COL["mute"]}" stroke-width="1"/>')
    g.append(rect(6.55, 8.71, 4.7, 4.8, COL["wall"]))
    g.append(f'<line x1="{px(8.71):.1f}" y1="{py(3.7):.1f}" x2="{px(8.71):.1f}" y2="{py(5.8):.1f}" '
             f'stroke="{COL["mute"]}" stroke-width="1"/>')
    # direction arrows
    g.append(f'<path d="M{px(6.7):.1f},{py(4.2):.1f} L{px(8.5):.1f},{py(4.2):.1f}" '
             f'stroke="{COL["ink"]}" stroke-width="1.4" marker-end="url(#arrow)" fill="none"/>')
    g.append(f'<path d="M{px(8.5):.1f},{py(5.3):.1f} L{px(6.7):.1f},{py(5.3):.1f}" '
             f'stroke="{COL["ink"]}" stroke-width="1.4" marker-end="url(#arrow)" fill="none"/>')
    g.append(text(9.25, 4.85, "بسطة", 10, color=COL["mute"]))
    g.append(text(7.6, 3.85, "صعود نحو السطح" if first_floor else "صعود", 9.5, color=COL["mute"]))
    return "\n".join(g)


def frame(title, subtitle, body, height_m=10):
    w = int(10 * S + 2 * M)
    h = int(height_m * S + 2 * M + 70)
    defs = f'''<defs>
<pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
<line x1="0" y1="0" x2="0" y2="10" stroke="#c9b98f" stroke-width="1.2"/></pattern>
<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,0 L10,5 L0,10 z" fill="{COL["ink"]}"/></marker>
</defs>'''
    top = [
        f'<rect width="{w}" height="{h}" fill="#ffffff"/>',
        f'<text x="{w / 2}" y="34" font-family="{FONT}" font-size="20" font-weight="bold" '
        f'fill="{COL["ink"]}" text-anchor="middle" direction="rtl">{title}</text>',
        f'<text x="{w / 2}" y="58" font-family="{FONT}" font-size="12" fill="{COL["mute"]}" '
        f'text-anchor="middle" direction="rtl">{subtitle}</text>',
    ]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
            f'viewBox="0 0 {w} {h}">\n{defs}\n' + "\n".join(top) + "\n" + body + "\n</svg>\n")


def plan_extras():
    g = []
    # overall dimension lines
    yb = py(0) + 38
    g.append(f'<line x1="{px(0)}" y1="{yb}" x2="{px(10)}" y2="{yb}" stroke="{COL["ink"]}" stroke-width="1"/>')
    for x in (0, 10):
        g.append(f'<line x1="{px(x)}" y1="{yb - 6}" x2="{px(x)}" y2="{yb + 6}" stroke="{COL["ink"]}"/>')
    g.append(f'<text x="{px(5)}" y="{yb - 5}" font-family="{FONT}" font-size="12" '
             f'text-anchor="middle" fill="{COL["ink"]}">10.00 م</text>')
    xl = px(0) - 38
    g.append(f'<line x1="{xl}" y1="{py(0)}" x2="{xl}" y2="{py(10)}" stroke="{COL["ink"]}" stroke-width="1"/>')
    for y in (0, 10):
        g.append(f'<line x1="{xl - 6}" y1="{py(y)}" x2="{xl + 6}" y2="{py(y)}" stroke="{COL["ink"]}"/>')
    g.append(f'<text x="{xl - 8}" y="{py(5)}" font-family="{FONT}" font-size="12" text-anchor="middle" '
             f'fill="{COL["ink"]}" transform="rotate(-90 {xl - 8} {py(5)})">10.00 م</text>')
    # street + neighbours
    g.append(f'<text x="{px(5)}" y="{py(0) + 64}" font-family="{FONT}" font-size="13" font-weight="bold" '
             f'text-anchor="middle" fill="{COL["ink"]}" direction="rtl">الشارع — الواجهة الوحيدة (جنوب)</text>')
    g.append(f'<text x="{px(5)}" y="{py(10) - 12}" font-family="{FONT}" font-size="11" '
             f'text-anchor="middle" fill="{COL["mute"]}" direction="rtl">جار خلفي (شمال) — جدار ملاصق</text>')
    g.append(f'<text x="{px(0) - 70}" y="{py(7.5)}" font-family="{FONT}" font-size="11" text-anchor="middle" '
             f'fill="{COL["mute"]}" direction="rtl" transform="rotate(-90 {px(0) - 70} {py(7.5)})">جار يسار (غرب)</text>')
    g.append(f'<text x="{px(10) + 30}" y="{py(7.5)}" font-family="{FONT}" font-size="11" text-anchor="middle" '
             f'fill="{COL["mute"]}" direction="rtl" transform="rotate(90 {px(10) + 30} {py(7.5)})">جار يمين (شرق)</text>')
    # north arrow
    nx, ny = px(10) + 40, py(10) + 10
    g.append(f'<path d="M{nx},{ny + 30} L{nx},{ny}" stroke="{COL["ink"]}" stroke-width="1.6" marker-end="url(#arrow)"/>')
    g.append(f'<text x="{nx}" y="{ny + 46}" font-family="{FONT}" font-size="12" text-anchor="middle" fill="{COL["ink"]}">N</text>')
    return "\n".join(g)


GROUND_ROOMS = [
    (0.2, 3.4, 0.25, 5.75, "garage", "مرآب سيارة", None),
    (0.2, 3.4, 5.9, 9.8, "open", "الفناء", "3.20×3.90 م ≈ 12.5 م² — مفتوح للسماء"),
    (3.55, 6.45, 0.25, 2.0, "room", "مدخل", None),
    (5.25, 6.45, 2.0, 5.8, "room", "", None),
    (3.55, 5.15, 2.1, 4.55, "wet", "حمّام 1", "1.60×2.45 ≈ 3.9 م²"),
    (3.55, 5.15, 4.65, 5.8, "wet", "غسيل", "1.60×1.15"),
    (6.55, 9.8, 0.25, 3.6, "room", "غرفة الوالدة", None),
    (3.55, 9.8, 5.9, 9.8, "room", "", None),
]

GROUND_OPEN = [
    (0.45, 3.15, 0.0, 0.25, "door"),      # garage door
    (3.85, 4.95, 0.0, 0.25, "door"),      # entrance door (offset: faces bathroom wall)
    (7.5, 8.9, 0.0, 0.25, "window"),      # mother's window (wooden screen)
    (3.4, 3.55, 0.6, 1.5, "door"),        # garage -> vestibule
    (6.45, 6.55, 2.2, 3.1, "door"),       # mother's room
    (5.15, 5.25, 2.3, 3.1, "door"),       # bathroom (sliding)
    (3.7, 4.45, 5.8, 5.9, "door"),        # laundry from kitchen
    (5.25, 6.45, 5.8, 5.9, "door"),       # hall -> family room
    (6.45, 6.55, 3.7, 4.7, "door"),       # stair start
    (7.9, 8.65, 5.8, 5.9, "door"),        # under-stair store
    (3.4, 3.55, 6.1, 7.7, "window"),      # glazed door to courtyard
    (3.4, 3.55, 8.2, 9.6, "window"),      # kitchen window over sink
]

FIRST_ROOMS = [
    (0.2, 3.4, 0.25, 5.75, "room", "صالون الضيوف", None),
    (0.2, 3.4, 5.9, 9.8, "open", "فراغ الفناء", "مفتوح للسماء"),
    (3.55, 6.45, 0.25, 2.0, "room", "مكتب", None),
    (5.25, 6.45, 2.1, 4.65, "room", "", None),
    (3.55, 6.45, 4.65, 5.8, "room", "", None),
    (3.55, 5.15, 2.1, 4.55, "wet", "حمّام 2", "1.60×2.45 ≈ 3.9 م²"),
    (6.55, 9.8, 0.25, 3.6, "room", "غرفة الأطفال", None),
    (3.55, 6.45, 5.9, 9.8, "room", "غرفة الأبوين", None),
    (6.55, 9.8, 5.9, 9.8, "open", "شرفة الأبوين", "3.25×3.90 ≈ 12.7 م² — مكشوفة"),
]

FIRST_OPEN = [
    (0.8, 2.8, 0.0, 0.25, "window"),      # salon street window
    (3.85, 4.95, 0.0, 0.25, "window"),    # office window (above entrance door)
    (7.5, 8.9, 0.0, 0.25, "window"),      # kids' window
    (0.8, 2.8, 5.75, 5.9, "window"),      # salon high window onto courtyard
    (3.4, 3.55, 4.75, 5.6, "door"),       # salon door
    (3.7, 4.5, 4.55, 4.65, "door"),       # bathroom door (from lobby)
    (5.4, 6.2, 2.0, 2.1, "door"),         # office door
    (6.45, 6.55, 2.2, 3.0, "door"),       # kids' door
    (6.45, 6.55, 3.7, 5.8, "door"),       # stair arrival + flight to roof
    (5.3, 6.2, 5.8, 5.9, "door"),         # parents' door
    (3.4, 3.55, 7.0, 8.6, "window"),      # parents' french window onto void
    (6.45, 6.55, 6.2, 7.0, "door"),       # parents -> terrace
]


def plan(rooms, openings, first_floor):
    g = [rect(0, 10, 0, 10, COL["wall"])]
    g += [room(r) for r in rooms]
    g += [opening(*o) for o in openings]
    g.append(stair(first_floor))
    if first_floor:
        g.append(text(4.8, 5.15, "بهو", 12, "bold"))
        g.append(text(5.85, 3.3, "ممر", 11, color=COL["mute"]))
    else:
        g.append(text(5.85, 3.9, "ممر", 11, color=COL["mute"]))
        g.append(text(4.95, 8.6, "مطبخ + طعام", 14, "bold"))
        g.append(text(4.95, 8.2, "2.90×3.90 ≈ 11.3 م²", 10.5, color=COL["mute"]))
        g.append(text(8.15, 8.6, "معيشة العائلة", 14, "bold"))
        g.append(text(8.15, 8.2, "3.25×3.90 ≈ 12.7 م²", 10.5, color=COL["mute"]))
        g.append(text(5.0, 6.45, "فراغ مفتوح واحد ≈ 24.4 م²", 10.5, color=COL["mute"]))
        # kitchen counter (L: north wall + west wall under window)
        g.append(rect(3.55, 6.0, 9.2, 9.8, "#d9cfbd"))
        g.append(rect(3.55, 4.15, 8.2, 9.2, "#d9cfbd"))
        g.append(text(8.3, 6.15, "باب تخزين تحت الدرج", 9, color=COL["mute"]))
    g.append(plan_extras())
    return "\n".join(g)


def elevation():
    """South (street) elevation. Levels assumed: GF 0.00, FF +3.00, roof +6.00, parapet +7.10."""
    H = 9.0
    def ex(x):
        return M + x * S
    def ey(z):
        return M + (H - z) * S
    def r(x0, x1, z0, z1, fill, extra=""):
        return (f'<rect x="{ex(x0):.1f}" y="{ey(z1):.1f}" width="{(x1 - x0) * S:.1f}" '
                f'height="{(z1 - z0) * S:.1f}" fill="{fill}" {extra}/>')
    sand, white, wood, frame_c = "#d8c39a", "#f7f5f0", "#9a6a43", "#4b4540"
    g = []
    # neighbours (unknown height -> dashed outline only)
    for (a, b) in ((-1.2, 0), (10, 11.2)):
        g.append(r(a, b, 0, 6.6, "none", 'stroke="#aaa" stroke-dasharray="6 5"'))
    g.append(r(0, 10, 0, 7.1, white, f'stroke="{frame_c}" stroke-width="1.2"'))
    # optional stair cabin, set back 3.70 m (only if regulations allow)
    g.append(r(5.25, 9.8, 7.1, 8.6, "none", 'stroke="#888" stroke-dasharray="5 4"'))
    g.append(f'<text x="{ex(7.5)}" y="{ey(7.8)}" font-family="{FONT}" font-size="10.5" fill="#777" '
             f'text-anchor="middle" direction="rtl">بيت الدرج اختياري (متراجع 3.70 م) — يُتحقَّق منه</text>')
    # sandstone plinth and vertical entrance band
    g.append(r(0, 10, 0, 0.6, sand))
    g.append(r(3.45, 5.35, 0, 7.1, sand))
    g.append(r(0, 10, 7.0, 7.1, sand))  # coping
    # garage door, wooden slats
    g.append(r(0.45, 3.15, 0, 2.4, wood))
    for i in range(1, 16):
        z = i * 0.15
        g.append(f'<line x1="{ex(0.45)}" y1="{ey(z)}" x2="{ex(3.15)}" y2="{ey(z)}" stroke="#7d5433" stroke-width="1"/>')
    # entrance door + office window above, same axis
    g.append(r(3.85, 4.95, 0, 2.3, wood))
    g.append(r(3.85, 4.95, 3.9, 5.3, "#9fb6c1"))
    for x in (3.95, 4.13, 4.31, 4.49, 4.67, 4.85):  # timber screen
        g.append(r(x - 0.03, x + 0.03, 3.9, 5.3, wood))
    # mother's window + kids' window (same axis), screened
    for (z0, z1) in ((0.9, 2.3), (3.9, 5.3)):
        g.append(r(7.5, 8.9, z0, z1, "#9fb6c1"))
        g.append(r(7.5, 8.2, z0, z1, wood))  # sliding slatted shutter, half open
        for k in range(7):
            z = z0 + 0.1 + k * 0.2
            g.append(f'<line x1="{ex(7.5)}" y1="{ey(z)}" x2="{ex(8.2)}" y2="{ey(z)}" stroke="#7d5433"/>')
        g.append(r(7.4, 9.0, z0 - 0.06, z0, sand))  # stone sill
    # salon window above garage door, same axis
    g.append(r(0.8, 2.8, 3.9, 5.3, "#9fb6c1"))
    g.append(r(0.8, 1.8, 3.9, 5.3, wood))
    for k in range(7):
        z = 4.0 + k * 0.2
        g.append(f'<line x1="{ex(0.8)}" y1="{ey(z)}" x2="{ex(1.8)}" y2="{ey(z)}" stroke="#7d5433"/>')
    g.append(r(0.7, 2.9, 3.84, 3.9, sand))
    # thin concrete canopy over entrance
    g.append(r(3.45, 5.35, 2.45, 2.6, "#e2ddd3", f'stroke="{frame_c}" stroke-width="0.8"'))
    # ground line + levels
    g.append(f'<line x1="{ex(-1.2)}" y1="{ey(0)}" x2="{ex(11.2)}" y2="{ey(0)}" stroke="{frame_c}" stroke-width="2"/>')
    for z, lab in ((0, "±0.00"), (3.0, "+3.00"), (6.0, "+6.00"), (7.1, "+7.10")):
        g.append(f'<line x1="{ex(10.05)}" y1="{ey(z)}" x2="{ex(10.6)}" y2="{ey(z)}" stroke="#999"/>')
        g.append(f'<text x="{ex(10.65)}" y="{ey(z) + 4}" font-family="{FONT}" font-size="10.5" fill="#555">{lab}</text>')
    g.append(f'<text x="{ex(5)}" y="{ey(0) + 28}" font-family="{FONT}" font-size="12" fill="#555" '
             f'text-anchor="middle" direction="rtl">المناسيب افتراضية: ارتفاع طابق 3.00 م — تُضبط بعد رفع الموقع وقراءة التنظيم</text>')
    body = "\n".join(g)
    w = int(10 * S + 2 * M)
    h = int(H * S + 2 * M + 30)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
            f'<rect width="{w}" height="{h}" fill="#ffffff"/>\n'
            f'<text x="{w / 2}" y="34" font-family="{FONT}" font-size="20" font-weight="bold" fill="#2b2b2a" '
            f'text-anchor="middle" direction="rtl">الواجهة الجنوبية (الشارع) — تصوّرية</text>\n'
            f'<text x="{w / 2}" y="58" font-family="{FONT}" font-size="12" fill="#77736b" text-anchor="middle" '
            f'direction="rtl">أبيض + حجر رملي + خشب — ليست رسماً تنفيذياً</text>\n{body}\n</svg>\n')


def main():
    OUT.mkdir(exist_ok=True)
    note = "مخطط تصوّري — ليس ملف CAD/BIM — الأبعاد صافية داخلية تقريبية"
    (OUT / "01-ground-floor.svg").write_text(
        frame("الطابق الأرضي — مخطط تصوّري", note, plan(GROUND_ROOMS, GROUND_OPEN, False)), encoding="utf-8")
    (OUT / "02-first-floor.svg").write_text(
        frame("الطابق الأول — مخطط تصوّري", note, plan(FIRST_ROOMS, FIRST_OPEN, True)), encoding="utf-8")
    (OUT / "03-south-elevation.svg").write_text(elevation(), encoding="utf-8")
    # area check printed for the README tables
    for name, rooms in (("GF", GROUND_ROOMS), ("FF", FIRST_ROOMS)):
        tot = sum((r[1] - r[0]) * (r[3] - r[2]) for r in rooms)
        print(name, f"sum of drawn rectangles = {tot:.1f} m2")


if __name__ == "__main__":
    main()
