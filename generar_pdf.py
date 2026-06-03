from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# Colors
AZUL_OSCURO = colors.HexColor('#1A2B4A')
AZUL_MEDIO  = colors.HexColor('#2E5E9E')
AZUL_CLARO  = colors.HexColor('#D6E4F7')
GRIS_TEXTO  = colors.HexColor('#444444')
GRIS_CLARO  = colors.HexColor('#F5F7FA')
VERDE       = colors.HexColor('#1A7A4A')
BLANCO      = colors.white

doc = SimpleDocTemplate(
    '/home/user/claude/Propuesta_Pauta_Flensa.pdf',
    pagesize=A4,
    rightMargin=2*cm, leftMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm
)

styles = getSampleStyleSheet()

def s(name, **kwargs):
    return ParagraphStyle(name, parent=styles['Normal'], **kwargs)

titulo_estilo      = s('titulo',      fontSize=22, textColor=BLANCO,       alignment=TA_CENTER, fontName='Helvetica-Bold', leading=28)
subtitulo_estilo   = s('subtitulo',   fontSize=11, textColor=AZUL_CLARO,   alignment=TA_CENTER, fontName='Helvetica', leading=16)
seccion_estilo     = s('seccion',     fontSize=13, textColor=BLANCO,       fontName='Helvetica-Bold', leading=18)
body_estilo        = s('body',        fontSize=9,  textColor=GRIS_TEXTO,   fontName='Helvetica', leading=13)
body_bold_estilo   = s('bodybold',    fontSize=9,  textColor=AZUL_OSCURO,  fontName='Helvetica-Bold', leading=13)
highlight_estilo   = s('highlight',   fontSize=10, textColor=VERDE,        fontName='Helvetica-Bold', leading=14)
nota_estilo        = s('nota',        fontSize=8,  textColor=GRIS_TEXTO,   fontName='Helvetica-Oblique', leading=11)
footer_estilo      = s('footer',      fontSize=8,  textColor=colors.grey,  alignment=TA_CENTER, fontName='Helvetica')

story = []

# ── HEADER BLOCK ──────────────────────────────────────────────────────────────
header_data = [[
    Paragraph('PROPUESTA DE ESTRATEGIA DE PAUTA DIGITAL', titulo_estilo),
    Paragraph('Venta de Activos — Flensa  |  Junio 2026', subtitulo_estilo)
]]
header_table = Table(header_data, colWidths=[17*cm])
header_table.setStyle(TableStyle([
    ('BACKGROUND',  (0,0), (-1,-1), AZUL_OSCURO),
    ('TOPPADDING',  (0,0), (-1,-1), 18),
    ('BOTTOMPADDING',(0,0),(-1,-1), 18),
    ('LEFTPADDING', (0,0), (-1,-1), 16),
    ('RIGHTPADDING',(0,0), (-1,-1), 16),
    ('ROWBACKGROUNDS',(0,0),(-1,-1),[AZUL_OSCURO]),
]))
story.append(header_table)
story.append(Spacer(1, 0.4*cm))

# ── OBJETIVO ──────────────────────────────────────────────────────────────────
def section_header(text):
    t = Table([[Paragraph(text, seccion_estilo)]], colWidths=[17*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0),(-1,-1), AZUL_MEDIO),
        ('TOPPADDING',(0,0),(-1,-1),6),
        ('BOTTOMPADDING',(0,0),(-1,-1),6),
        ('LEFTPADDING',(0,0),(-1,-1),10),
    ]))
    return t

story.append(section_header('OBJETIVO'))
story.append(Spacer(1, 0.2*cm))
story.append(Paragraph(
    'Generar contactos calificados para la venta de tractocamiones Kenworth y cajas refrigeradas '
    'Great Dane de la flotilla Flensa, dirigida a empresas de autotransporte, operadores logísticos '
    'y transportistas independientes en México.',
    body_estilo))
story.append(Spacer(1, 0.4*cm))

# ── ACTIVOS EN VENTA ──────────────────────────────────────────────────────────
story.append(section_header('ACTIVOS EN VENTA'))
story.append(Spacer(1, 0.2*cm))

story.append(Paragraph('Tractocamiones Kenworth', body_bold_estilo))
story.append(Spacer(1, 0.15*cm))

tractos_data = [
    ['Modelo', 'Años', 'Motor', 'Trans.', 'Diferencial', 'Rodado', 'Precio desde'],
    ['T660 Flattop', '2014–2016', 'Cummins\n450 HP', 'Fuller\n18 vel.', '46,000 lbs', '24.5', '$1,250,000\nMXN + IVA'],
    ['T680 Flattop', '2018',      'Cummins\n450 HP', 'Fuller\n18 vel.', '46,000 lbs', '24.5', 'A consultar'],
    ['T680 Sleeper\nStudio', '2018–2021','Cummins\n450 HP','Fuller\n18 vel.','46,000 lbs','22.5','$1,508,620\nMXN + IVA'],
]
t_tractos = Table(tractos_data, colWidths=[2.8*cm,1.8*cm,1.9*cm,1.8*cm,2.1*cm,1.5*cm,2.9*cm])
t_tractos.setStyle(TableStyle([
    ('BACKGROUND',   (0,0),(-1,0), AZUL_OSCURO),
    ('TEXTCOLOR',    (0,0),(-1,0), BLANCO),
    ('FONTNAME',     (0,0),(-1,0), 'Helvetica-Bold'),
    ('FONTSIZE',     (0,0),(-1,-1), 8),
    ('ALIGN',        (0,0),(-1,-1), 'CENTER'),
    ('VALIGN',       (0,0),(-1,-1), 'MIDDLE'),
    ('ROWBACKGROUNDS',(0,1),(-1,-1),[GRIS_CLARO, BLANCO]),
    ('GRID',         (0,0),(-1,-1), 0.3, colors.HexColor('#CCCCCC')),
    ('TOPPADDING',   (0,0),(-1,-1), 5),
    ('BOTTOMPADDING',(0,0),(-1,-1), 5),
    ('FONTNAME',     (6,1),(6,-1), 'Helvetica-Bold'),
    ('TEXTCOLOR',    (6,1),(6,-1), VERDE),
]))
story.append(t_tractos)
story.append(Spacer(1, 0.35*cm))

story.append(Paragraph('Cajas Refrigeradas Great Dane', body_bold_estilo))
story.append(Spacer(1, 0.15*cm))

cajas_data = [
    ['Modelo', 'Años', 'Unidad de Frío', 'Suspensión', 'Capacidad', 'Rodado', 'Acceso'],
    ['Great Dane\n53 pies', '2011–2014', 'ThermoKing\nSB 230 /\nPrecedent C-600',
     'Neumática\nHendrickson', '80,000 lbs', '22.5', 'Puertas\nde libro'],
]
t_cajas = Table(cajas_data, colWidths=[2.5*cm,1.8*cm,2.8*cm,2.3*cm,2.0*cm,1.5*cm,2.0*cm])
t_cajas.setStyle(TableStyle([
    ('BACKGROUND',   (0,0),(-1,0), AZUL_OSCURO),
    ('TEXTCOLOR',    (0,0),(-1,0), BLANCO),
    ('FONTNAME',     (0,0),(-1,0), 'Helvetica-Bold'),
    ('FONTSIZE',     (0,0),(-1,-1), 8),
    ('ALIGN',        (0,0),(-1,-1), 'CENTER'),
    ('VALIGN',       (0,0),(-1,-1), 'MIDDLE'),
    ('ROWBACKGROUNDS',(0,1),(-1,-1),[GRIS_CLARO]),
    ('GRID',         (0,0),(-1,-1), 0.3, colors.HexColor('#CCCCCC')),
    ('TOPPADDING',   (0,0),(-1,-1), 5),
    ('BOTTOMPADDING',(0,0),(-1,-1), 5),
]))
story.append(t_cajas)
story.append(Spacer(1, 0.4*cm))

# ── ESTRATEGIA ESCALONADA ─────────────────────────────────────────────────────
story.append(section_header('ESTRATEGIA DE PAUTA ESCALONADA'))
story.append(Spacer(1, 0.25*cm))
story.append(Paragraph(
    'Diseñada para generar credibilidad interna antes de escalar la inversión. '
    'Cada fase solo avanza si la anterior muestra resultados.',
    body_estilo))
story.append(Spacer(1, 0.3*cm))

fases_data = [
    ['FASE', 'PERÍODO', 'INVERSIÓN DIARIA', 'INVERSIÓN TOTAL', 'CANAL', 'OBJETIVO'],
    ['Fase 1\nPrueba de\nconcepto',
     'Semanas\n1–4',
     '$200 MXN/día',
     '~$6,000 MXN',
     'Meta Ads\n(Facebook)',
     'Primeros leads,\nprobar creativos\n5–15 contactos'],
    ['Fase 2\nEscalar lo\nque funciona',
     'Semanas\n5–8',
     '$600 MXN/día',
     '~$18,000 MXN',
     'Meta Ads\n+ Google\nSearch',
     'Duplicar volumen\nde leads\n20–40 contactos'],
    ['Fase 3\nActivación\ncompleta',
     'Mes 3+',
     '$1,500–$2,000\nMXN/día',
     '$45,000–$60,000\nMXN/mes',
     'Meta + Google\n+ MercadoLibre\n+ Portales',
     'Maximizar\nvelocidad\nde ventas'],
]
t_fases = Table(fases_data, colWidths=[2.3*cm,2.0*cm,2.5*cm,2.7*cm,2.5*cm,4.0*cm])
t_fases.setStyle(TableStyle([
    ('BACKGROUND',    (0,0),(-1,0), AZUL_OSCURO),
    ('TEXTCOLOR',     (0,0),(-1,0), BLANCO),
    ('FONTNAME',      (0,0),(-1,0), 'Helvetica-Bold'),
    ('FONTSIZE',      (0,0),(-1,-1), 8),
    ('ALIGN',         (0,0),(-1,-1), 'CENTER'),
    ('VALIGN',        (0,0),(-1,-1), 'MIDDLE'),
    ('ROWBACKGROUNDS',(0,1),(-1,-1),[AZUL_CLARO, GRIS_CLARO, colors.HexColor('#EAF4EC')]),
    ('GRID',          (0,0),(-1,-1), 0.3, colors.HexColor('#CCCCCC')),
    ('TOPPADDING',    (0,0),(-1,-1), 7),
    ('BOTTOMPADDING', (0,0),(-1,-1), 7),
    ('FONTNAME',      (0,1),(-1,-1), 'Helvetica'),
    ('FONTNAME',      (3,1),(3,-1), 'Helvetica-Bold'),
    ('TEXTCOLOR',     (3,1),(3,-1), AZUL_OSCURO),
]))
story.append(t_fases)
story.append(Spacer(1, 0.4*cm))

# ── RESUMEN DE INVERSIÓN (FULL) ────────────────────────────────────────────────
story.append(section_header('PRESUPUESTO TOTAL — ACTIVACIÓN COMPLETA (Fase 3)'))
story.append(Spacer(1, 0.2*cm))

inv_data = [
    ['Canal', 'Inversión Estimada', 'Duración'],
    ['Meta Ads (Facebook + Instagram)',         '$50,000 – $70,000 MXN', '8 semanas'],
    ['Google Ads (Search + Display)',           '$36,000 – $56,000 MXN', '8 semanas'],
    ['Mercado Libre (Listings Premium)',        '$10,000 – $18,000 MXN', 'Única'],
    ['Portales especializados\n(T21, Carga24, Portal Camión)', '$24,000 – $40,000 MXN', '8 semanas'],
    ['LinkedIn Ads',                            '$15,000 – $22,500 MXN', '6 semanas'],
    ['TOTAL',                                   '$135,000 – $206,500 MXN', '8 semanas'],
]
t_inv = Table(inv_data, colWidths=[7.5*cm,5.5*cm,4.0*cm])
t_inv.setStyle(TableStyle([
    ('BACKGROUND',    (0,0), (-1,0), AZUL_OSCURO),
    ('TEXTCOLOR',     (0,0), (-1,0), BLANCO),
    ('FONTNAME',      (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE',      (0,0), (-1,-1), 9),
    ('ALIGN',         (1,0), (-1,-1), 'CENTER'),
    ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
    ('ROWBACKGROUNDS',(0,1), (-1,-2), [GRIS_CLARO, BLANCO]),
    ('BACKGROUND',    (0,-1),(-1,-1), AZUL_OSCURO),
    ('TEXTCOLOR',     (0,-1),(-1,-1), BLANCO),
    ('FONTNAME',      (0,-1),(-1,-1), 'Helvetica-Bold'),
    ('GRID',          (0,0), (-1,-1), 0.3, colors.HexColor('#CCCCCC')),
    ('TOPPADDING',    (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING',   (0,0), (0,-1), 10),
    ('FONTSIZE',      (0,-1),(-1,-1), 10),
]))
story.append(t_inv)
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph('* Precios en pesos mexicanos, no incluyen IVA.', nota_estilo))
story.append(Spacer(1, 0.4*cm))

# ── ROI ────────────────────────────────────────────────────────────────────────
story.append(section_header('RETORNO SOBRE INVERSION (ROI)'))
story.append(Spacer(1, 0.2*cm))

roi_data = [
    ['Escenario', 'Unidades vendidas\n(de 47 tractos)', 'Revenue estimado', 'ROI sobre pauta\n(Fase 1+2, ~$24,000 MXN)'],
    ['Conservador\n(20–25%)',  '10–12 tractos', '$13M – $15.6M MXN', '~542x'],
    ['Medio\n(40–50%)',        '19–24 tractos', '$24.7M – $31.2M MXN', '~1,029x'],
    ['Optimista\n(60–70%)',    '28–33 tractos', '$36.4M – $42.9M MXN', '~1,517x'],
]
t_roi = Table(roi_data, colWidths=[3.0*cm,3.5*cm,4.5*cm,6.0*cm])
t_roi.setStyle(TableStyle([
    ('BACKGROUND',    (0,0),(-1,0), AZUL_OSCURO),
    ('TEXTCOLOR',     (0,0),(-1,0), BLANCO),
    ('FONTNAME',      (0,0),(-1,0), 'Helvetica-Bold'),
    ('FONTSIZE',      (0,0),(-1,-1), 8.5),
    ('ALIGN',         (0,0),(-1,-1), 'CENTER'),
    ('VALIGN',        (0,0),(-1,-1), 'MIDDLE'),
    ('ROWBACKGROUNDS',(0,1),(-1,-1),[GRIS_CLARO, BLANCO, colors.HexColor('#EAF4EC')]),
    ('GRID',          (0,0),(-1,-1), 0.3, colors.HexColor('#CCCCCC')),
    ('TOPPADDING',    (0,0),(-1,-1), 6),
    ('BOTTOMPADDING', (0,0),(-1,-1), 6),
    ('FONTNAME',      (3,1),(3,-1), 'Helvetica-Bold'),
    ('TEXTCOLOR',     (3,1),(3,-1), VERDE),
]))
story.append(t_roi)
story.append(Spacer(1, 0.4*cm))

# ── ARGUMENTO CLAVE ────────────────────────────────────────────────────────────
argumento_data = [[
    Paragraph(
        'El argumento es simple: con activos de $1,250,000 MXN cada uno, el riesgo de las primeras '
        '8 semanas de prueba (~$24,000 MXN) equivale al <b>1.9% del precio de un solo tracto</b>. '
        'Si en ese período no se vende nada, se detiene. Si se vende uno, ya pagó toda la pauta de un año.',
        s('arg', fontSize=9, textColor=AZUL_OSCURO, fontName='Helvetica', leading=13))
]]
t_arg = Table(argumento_data, colWidths=[17*cm])
t_arg.setStyle(TableStyle([
    ('BACKGROUND',    (0,0),(-1,-1), AZUL_CLARO),
    ('TOPPADDING',    (0,0),(-1,-1), 10),
    ('BOTTOMPADDING', (0,0),(-1,-1), 10),
    ('LEFTPADDING',   (0,0),(-1,-1), 12),
    ('RIGHTPADDING',  (0,0),(-1,-1), 12),
    ('BOX',           (0,0),(-1,-1), 1.5, AZUL_MEDIO),
]))
story.append(t_arg)
story.append(Spacer(1, 0.5*cm))

# ── FOOTER ────────────────────────────────────────────────────────────────────
story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#CCCCCC')))
story.append(Spacer(1, 0.15*cm))
story.append(Paragraph('Propuesta preparada para Flensa — Venta de Activos 2026', footer_estilo))

doc.build(story)
print("PDF generado: Propuesta_Pauta_Flensa.pdf")
