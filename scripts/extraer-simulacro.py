"""Saca las preguntas tipo test de la página del examen y las guarda como datos del simulacro.

Uso (desde la raíz del repo), cada vez que cambien las preguntas de la página:
    python3 scripts/extraer-simulacro.py src/content/unidades/despliegue/examen-27-11.mdx src/data/simulacro-despliegue.json
"""
import re, json, sys, html
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
s = s[:s.index('## Pregunta de desarrollo')]          # solo el test

def md(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)\*(?!\w)', r'<em>\1</em>', t)
    return t

def bloque(texto):
    out, lista = [], []
    for linea in texto.strip().split('\n'):
        linea = linea.rstrip()
        if linea.startswith('- '):
            lista.append(f'<li>{md(linea[2:])}</li>'); continue
        if lista: out.append('<ul>' + ''.join(lista) + '</ul>'); lista = []
        if linea: out.append(f'<p>{md(linea)}</p>')
    if lista: out.append('<ul>' + ''.join(lista) + '</ul>')
    return ''.join(out)

PIEZA = re.compile(r"\{\s*t:\s*'((?:[^'\\]|\\.)*)'\s*,\s*(?:hueco:\s*(\d+)|porque:\s*'(?:[^'\\]|\\.)*')\s*\}")

cabeceras = list(re.finditer(r'^\*\*(★ )?(\d+)\. (.+?)\*\*$', s, flags=re.M))
pregs = []
for i, m in enumerate(cabeceras):
    fin = cabeceras[i + 1].start() if i + 1 < len(cabeceras) else len(s)
    cuerpo = s[m.end():fin].split('\n### ')[0]       # corta en el siguiente apartado
    p = {'n': int(m.group(2)), 'conf': bool(m.group(1)), 'enunciado': md(m.group(3))}
    if '<Puzle' in cuerpo:
        piezas = [{'t': pm.group(1).replace('\\\\', '\\'), 'h': int(pm.group(2)) if pm.group(2) else None}
                  for pm in PIEZA.finditer(cuerpo)]
        codigo = re.search(r'```text\n(.*?)```', cuerpo, re.S).group(1)
        lineas = []
        for l in codigo.strip('\n').split('\n'):
            hm = re.search(r'__(\d+)__', l)
            lineas.append({'texto': html.escape(l[:hm.start()].rstrip(), quote=False), 'h': int(hm.group(1))})
        p.update(tipo='puzle', piezas=piezas, lineas=lineas)
    else:
        ops = re.findall(r'^- ([a-d])\) (.+)$', cuerpo.split('<details>')[0], flags=re.M)
        det = re.search(r'<summary>Respuesta</summary>\n(.*?)</details>', cuerpo, re.S).group(1)
        correcta = re.search(r'\*\*([a-d])\)\*\*', det).group(1)
        p.update(tipo='test', opciones=[md(o) for _, o in ops], correcta='abcd'.index(correcta),
                 explicacion=bloque(det))
    pregs.append(p)

json.dump(pregs, open(dst, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
print(len(pregs), sum(p['conf'] for p in pregs), sum(p['tipo'] == 'puzle' for p in pregs),
      [p['n'] for p in pregs if p['tipo'] == 'test' and len(p['opciones']) < 3],
      [p['n'] for p in pregs if p['tipo'] == 'puzle' and len(p['piezas']) < 4])
