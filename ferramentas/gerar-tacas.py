"""Taças originais do A JOIA, desenhadas em SVG e renderizadas para WebP 500x600.
Nenhuma reproduz troféu real: silhuetas próprias, com a gema da marca como assinatura."""
import math, os, sys
import cairosvg
from PIL import Image

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
W, H, CX, BASE = 500, 600, 250, 594

METAIS = {
    "ouro":   ["#5A3F00", "#9C7414", "#E8C35A", "#FFF0B5", "#F2CF6A", "#B88A1E", "#7A5A06", "#D9AE3E", "#FFE49A", "#8E6A0C", "#4A3300"],
    "prata":  ["#3A3F44", "#7D858D", "#C9CFD6", "#FFFFFF", "#DDE2E8", "#9AA2AA", "#5F666D", "#B9C0C8", "#F2F5F8", "#7A8188", "#2F3438"],
    "bronze": ["#3A1E0A", "#7E4620", "#C9824D", "#FFD2A8", "#E39E68", "#A8622F", "#6B3A18", "#C27A44", "#F0B88A", "#7A4420", "#2E1708"],
}
GEMA = {"esmeralda": ("#0B5E42", "#12A876", "#5FE0B0"), "safira": ("#173F8F", "#2E6FE0", "#9CC0FF"), "rubi": ("#7A1420", "#C9303F", "#FF9AA5")}


def grad(id_, metal, x0, x1):
    cs = METAIS[metal]
    st = "".join(f'<stop offset="{i/(len(cs)-1):.3f}" stop-color="{c}"/>' for i, c in enumerate(cs))
    return f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" x1="{x0}" y1="0" x2="{x1}" y2="0">{st}</linearGradient>'


def vgrad(id_, cores):
    st = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in cores)
    return f'<linearGradient id="{id_}" x1="0" y1="0" x2="0" y2="1">{st}</linearGradient>'


def suave(pts):
    """caminho suave (Catmull-Rom -> Bézier) passando pelos pontos"""
    d = f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d


def torneado(perfil):
    """silhueta simétrica a partir do perfil direito [(meia_largura, y), ...] de cima para baixo"""
    dir_ = [(CX + r, y) for r, y in perfil]
    esq = [(CX - r, y) for r, y in reversed(perfil)]
    return suave(dir_) + " L" + suave(esq)[1:] + " Z"


def corpo(id_, metal, perfil, extra=""):
    larg = max(r for r, _ in perfil)
    y0, y1 = perfil[0][1], perfil[-1][1]
    d = torneado(perfil)
    return (f'<defs>{grad(id_, metal, CX - larg, CX + larg)}<clipPath id="c{id_}"><path d="{d}"/></clipPath></defs>'
            f'<path d="{d}" fill="url(#{id_})"/>'
            # brilho especular vertical e sombra de volume
            f'<g clip-path="url(#c{id_})"><rect x="{CX - larg * 0.52}" y="{y0}" width="{larg * 0.13}" height="{y1 - y0}" fill="#FFFFFF" opacity=".38"/>'
            f'<rect x="{CX + larg * 0.48}" y="{y0}" width="{larg * 0.08}" height="{y1 - y0}" fill="#FFFFFF" opacity=".16"/>{extra}</g>')


def borda(y, r, metal, id_, alt=10):
    return (f'<defs>{grad(id_, metal, CX - r, CX + r)}</defs>'
            f'<ellipse cx="{CX}" cy="{y}" rx="{r}" ry="{alt}" fill="url(#{id_})"/>'
            f'<ellipse cx="{CX}" cy="{y - 1}" rx="{r * 0.92}" ry="{alt * 0.55}" fill="#000" opacity=".35"/>')


def base_preta(topo, larg, alt, metal, placa=True, tom="#121816"):
    y = BASE - alt
    s = (f'<defs>{vgrad("bp", [(0, "#2C3431"), (.08, "#141A18"), (.9, "#0A0E0C"), (1, "#050706")])}'
         f'{grad("bpl", "prata", CX - larg, CX + larg)}</defs>'
         f'<path d="M{CX - topo},{y} L{CX + topo},{y} L{CX + larg},{BASE - 8} Q{CX + larg},{BASE} {CX + larg - 8},{BASE} L{CX - larg + 8},{BASE} Q{CX - larg},{BASE} {CX - larg},{BASE - 8} Z" fill="url(#bp)"/>'
         f'<rect x="{CX - topo}" y="{y}" width="{topo * 2}" height="3" fill="#3E4744"/>')
    if placa:
        s += (f'<defs>{grad("plc", metal, CX - topo * 0.6, CX + topo * 0.6)}</defs>'
              f'<rect x="{CX - topo * 0.55}" y="{y + alt * 0.32}" width="{topo * 1.1}" height="{alt * 0.34}" rx="3" fill="url(#plc)"/>'
              f'<rect x="{CX - topo * 0.55}" y="{y + alt * 0.32}" width="{topo * 1.1}" height="{alt * 0.34}" rx="3" fill="none" stroke="#000" stroke-opacity=".35"/>')
    return s


def degraus(y_topo, larguras, metal, alt=16, pref="dg"):
    """pedestal em degraus metálicos (de cima para baixo)"""
    s, y = "", y_topo
    for i, r in enumerate(larguras):
        s += f'<defs>{grad(f"{pref}{i}", metal, CX - r, CX + r)}</defs>'
        s += f'<rect x="{CX - r}" y="{y}" width="{r * 2}" height="{alt}" rx="4" fill="url(#{pref}{i})"/>'
        s += f'<rect x="{CX - r}" y="{y}" width="{r * 2}" height="2.5" fill="#FFF" opacity=".35"/>'
        y += alt
    return s, y


def alca(lado, pts, metal, id_, esp=13):
    """alça como traço grosso metálico; lado=1 direita, -1 esquerda"""
    P = [(CX + lado * x, y) for x, y in pts]
    d = suave(P)
    xs = [p[0] for p in P]
    return (f'<defs>{grad(id_, metal, min(xs) - esp, max(xs) + esp)}</defs>'
            f'<path d="{d}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="{esp + 3}" stroke-linecap="round"/>'
            f'<path d="{d}" fill="none" stroke="url(#{id_})" stroke-width="{esp}" stroke-linecap="round"/>'
            f'<path d="{d}" fill="none" stroke="#FFF" stroke-opacity=".45" stroke-width="{max(2, esp * 0.22)}" stroke-linecap="round" transform="translate({-lado * esp * 0.18},{-esp * 0.12})"/>')


def gema(cx, cy, r, cor="esmeralda", id_="gm"):
    """gema lapidada da marca, vista de frente"""
    esc, med, luz = GEMA[cor]
    t = r * 0.62  # meia largura da mesa
    topo, cint, ponta = cy - r * 0.55, cy - r * 0.12, cy + r * 0.95
    P = lambda x, y: f"{x:.1f},{y:.1f}"
    s = f'<defs><radialGradient id="{id_}h" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="{luz}"/><stop offset="1" stop-color="{med}"/></radialGradient></defs>'
    s += f'<polygon points="{P(cx - t, topo)} {P(cx + t, topo)} {P(cx + r, cint)} {P(cx, ponta)} {P(cx - r, cint)}" fill="{esc}" stroke="#0E1512" stroke-width="{r * 0.06:.1f}" stroke-linejoin="round"/>'
    s += f'<polygon points="{P(cx - t, topo)} {P(cx + t, topo)} {P(cx + t * 0.55, cint)} {P(cx - t * 0.55, cint)}" fill="url(#{id_}h)"/>'
    s += f'<polygon points="{P(cx - t, topo)} {P(cx - t * 0.55, cint)} {P(cx - r, cint)}" fill="{luz}" opacity=".75"/>'
    s += f'<polygon points="{P(cx + t, topo)} {P(cx + r, cint)} {P(cx + t * 0.55, cint)}" fill="{med}"/>'
    s += f'<polygon points="{P(cx - r, cint)} {P(cx - t * 0.55, cint)} {P(cx, ponta)}" fill="{med}"/>'
    s += f'<polygon points="{P(cx - t * 0.55, cint)} {P(cx + t * 0.55, cint)} {P(cx, ponta)}" fill="{esc}" opacity=".9"/>'
    s += f'<polygon points="{P(cx + t * 0.55, cint)} {P(cx + r, cint)} {P(cx, ponta)}" fill="#05140E" opacity=".45"/>'
    s += f'<polygon points="{P(cx - t * 0.7, topo + r * 0.06)} {P(cx - t * 0.15, topo + r * 0.06)} {P(cx - t * 0.4, cint - r * 0.05)}" fill="#FFF" opacity=".55"/>'
    return s


def facetas(perfil, n=6, cor="#000", op=0.12):
    """linhas de lapidação verticais no corpo"""
    y0, y1 = perfil[0][1], perfil[-1][1]
    larg = max(r for r, _ in perfil)
    return "".join(f'<line x1="{CX + larg * k}" y1="{y0}" x2="{CX + larg * k * 0.4}" y2="{y1}" stroke="{cor}" stroke-opacity="{op}" stroke-width="2"/>'
                   for k in [i / n * 2 - 1 for i in range(1, n)])


def svg(conteudo):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{conteudo}</svg>'


TACAS = {}

def taca(metal, bojo, haste, pe, pref):
    """taça em partes: bojo (perfil), haste com nó e pé alargado"""
    s = ""
    yb = bojo[-1][1]
    (hy0, hy1, hr), (ky, kr) = haste
    s += corpo(pref + "h", metal, [(hr, hy0), (hr * 0.9, (hy0 + hy1) / 2), (hr, hy1)])
    s += corpo(pref + "p", metal, pe)
    s += borda(pe[0][1], pe[0][0] + 4, metal, pref + "pb", 5)
    s += f'<defs>{grad(pref + "k", metal, CX - kr, CX + kr)}</defs><ellipse cx="{CX}" cy="{ky}" rx="{kr}" ry="{kr * 0.55}" fill="url(#{pref}k)"/>'
    s += f'<ellipse cx="{CX}" cy="{ky - kr * 0.18}" rx="{kr * 0.8}" ry="{kr * 0.16}" fill="#FFF" opacity=".35"/>'
    s += corpo(pref + "b", metal, bojo)
    s += borda(yb, bojo[-1][0] + 6, metal, pref + "cb", 6)
    return s

def folha(lado, pts, metal, id_):
    P = [(CX + lado * x, y) for x, y in pts]
    xs = [p[0] for p in P]
    d = suave(P) + " Z"
    return (f'<defs>{grad(id_, metal, min(xs), max(xs))}</defs><path d="{d}" fill="url(#{id_})" stroke="#000" stroke-opacity=".3" stroke-width="2"/>'
            f'<path d="{suave(P[:3])}" fill="none" stroke="#FFF" stroke-opacity=".4" stroke-width="3"/>')

# Liga nacional — taça clássica dourada, alças finas, gema esmeralda na frente, pedestal em degraus
def liga():
    s = base_preta(112, 128, 66, "ouro")
    dg, _ = degraus(BASE - 66 - 32, [92, 104], "ouro", alt=16)
    s += dg
    for l in (1, -1): s += alca(l, [(136, 116), (196, 116), (212, 170), (178, 232), (104, 262)], "ouro", f"al{l}")
    s += taca("ouro", [(148, 80), (144, 130), (126, 196), (92, 250), (40, 288), (26, 296)], ((300, 420, 16), (372, 30)), [(30, 420), (52, 446), (84, 496)], "t")
    s += borda(80, 148, "ouro", "bd", 14)
    s += gema(CX, 186, 44, "esmeralda", "g1")
    return s

# Copa nacional — cálice de prata largo e raso, alças baixas, base preta alta
def copa():
    s = base_preta(100, 116, 96, "prata")
    for l in (1, -1): s += alca(l, [(156, 132), (218, 144), (222, 198), (174, 238)], "prata", f"a{l}", 15)
    s += taca("prata", [(174, 100), (170, 146), (148, 200), (106, 244), (52, 270), (26, 278)], ((282, 420, 15), (350, 32)), [(28, 420), (48, 446), (86, 498)], "t")
    s += borda(100, 174, "prata", "bd", 15)
    s += f'<rect x="{CX - 158}" y="150" width="316" height="5" fill="#FFF" opacity=".25"/>'
    return s

# Segunda divisão — taça de bronze compacta, bojo lapidado
def segunda():
    s = base_preta(96, 110, 84, "bronze")
    for l in (1, -1): s += alca(l, [(134, 172), (196, 176), (204, 236), (148, 290)], "bronze", f"a{l}", 14)
    s += taca("bronze", [(146, 136), (144, 180), (126, 238), (88, 288), (36, 316), (22, 320)], ((322, 428, 13), (370, 26)), [(24, 428), (44, 452), (78, 510)], "t")
    s += borda(136, 146, "bronze", "bd", 13)
    s += f'<g opacity=".9">{facetas([(146, 140), (88, 300)], 7, "#000", .18)}</g>'
    return s

# Continental de clubes — vaso alto e esguio sem alças, corpo lapidado como gema, coroado por gema esmeralda
def continental():
    s = base_preta(96, 112, 70, "ouro")
    dg, _ = degraus(BASE - 70 - 32, [78, 90], "ouro", alt=16, pref="dc")
    s += dg
    vaso = [(70, 124), (110, 146), (116, 182), (102, 250), (74, 320), (44, 376), (26, 412)]
    s += corpo("pe", "ouro", [(26, 418), (34, 440), (52, 466), (66, 492)])
    s += corpo("cp", "ouro", vaso, facetas(vaso, 8, "#000", .2) + facetas(vaso, 8, "#FFF", .12))
    s += f'<defs>{grad("aro", "ouro", CX - 70, CX + 70)}</defs><rect x="{CX - 70}" y="108" width="140" height="18" rx="7" fill="url(#aro)"/>'
    s += f'<defs>{grad("aro2", "ouro", CX - 36, CX + 36)}</defs><ellipse cx="{CX}" cy="418" rx="36" ry="9" fill="url(#aro2)"/>'
    s += gema(CX, 70, 46, "esmeralda", "g1")
    return s

def coroa_com_gema(metal, cor, y_base, r_gema, larg):
    s = ""
    for l in (1, -1):
        s += folha(l, [(4, y_base), (larg * 0.55, y_base - 30), (larg, y_base - 100), (larg * 0.86, y_base - 150), (larg * 0.5, y_base - 72), (2, y_base - 20)], metal, f"fo{l}")
        s += folha(l, [(2, y_base + 4), (larg * 0.3, y_base - 26), (larg * 0.52, y_base - 96), (larg * 0.36, y_base - 132), (larg * 0.18, y_base - 60), (1, y_base - 14)], metal, f"fi{l}")
    s += gema(CX, y_base - 120, r_gema, cor, "gm")
    return s

# Copa do Mundo — coluna dourada facetada abrindo em pétalas de metal que seguram uma grande gema
def copaMundo():
    s = base_preta(84, 104, 66, "ouro", placa=False)
    for i, y in enumerate([BASE - 66 + 18, BASE - 66 + 40]):
        s += f'<rect x="{CX - 86}" y="{y}" width="172" height="7" fill="{"#12A876" if i == 0 else "#2E6FE0"}"/>'
    coluna = [(60, 250), (40, 300), (34, 360), (44, 430), (66, 490), (84, BASE - 66)]
    s += corpo("cl", "ouro", coluna, facetas(coluna, 6, "#000", .22) + facetas(coluna, 6, "#FFF", .14))
    s += coroa_com_gema("ouro", "esmeralda", 262, 78, 170)
    return s

# Mundial de clubes — a mesma família em prata, com gema safira
def mundial():
    s = base_preta(84, 104, 66, "prata", placa=False)
    s += f'<rect x="{CX - 86}" y="{BASE - 66 + 28}" width="172" height="7" fill="#2E6FE0"/>'
    coluna = [(56, 270), (38, 320), (32, 380), (42, 440), (64, 494), (84, BASE - 66)]
    s += corpo("cl", "prata", coluna, facetas(coluna, 6, "#000", .22))
    s += coroa_com_gema("prata", "safira", 282, 70, 150)
    return s

# Copa continental de seleções — taça dourada de bojo cônico lapidado, alças em asa, gema safira
def continentalSelecao():
    s = base_preta(100, 116, 72, "ouro")
    dg, _ = degraus(BASE - 72 - 32, [80, 92], "ouro", alt=16, pref="ds")
    s += dg
    for l in (1, -1): s += alca(l, [(130, 104), (196, 78), (234, 114), (210, 180), (116, 220)], "ouro", f"a{l}", 13)
    s += taca("ouro", [(146, 90), (136, 120), (104, 176), (62, 236), (26, 280)], ((284, 410, 14), (346, 28)), [(26, 410), (48, 436), (76, 490)], "t")
    s += f'<g>{facetas([(146, 94), (62, 236)], 8, "#000", .22)}{facetas([(146, 94), (62, 236)], 8, "#FFF", .12)}</g>'
    s += borda(90, 140, "ouro", "bd", 13)
    s += gema(CX, 172, 40, "safira", "g1")
    return s

for nome, fn in [("liga", liga), ("copa", copa), ("segunda", segunda), ("continental", continental),
                 ("copaMundo", copaMundo), ("mundial", mundial), ("continentalSelecao", continentalSelecao)]:
    s = svg(fn())
    open(f"{OUT}/{nome}.svg", "w").write(s)
    cairosvg.svg2png(bytestring=s.encode(), write_to=f"{OUT}/{nome}.png", output_width=W, output_height=H)
print("ok")
