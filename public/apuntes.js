// Tema: el mismo que el CV (niebla = claro, pizarra = oscuro) y la misma clave en localStorage,
// así al pasar del CV a los apuntes se mantiene. El <head> lo aplica antes de pintar.
const raiz = document.documentElement;
const btn = document.querySelector('.tema-btn');
const pintar = () => { btn.textContent = raiz.dataset.paleta === 'pizarra' ? 'Tema claro' : 'Tema oscuro'; };
if (btn) {
  pintar();
  btn.addEventListener('click', () => {
    raiz.dataset.paleta = raiz.dataset.paleta === 'pizarra' ? 'niebla' : 'pizarra';
    localStorage.setItem('tema', raiz.dataset.paleta);
    pintar();
  });
}

// En el móvil el índice de unidades empieza plegado para no tapar el contenido.
const indice = document.querySelector('.indice details');
if (indice && matchMedia('(max-width: 820px)').matches) indice.open = false;

// Paso a paso: convierte cada <Paso> en una pestaña (flechas para moverse).
document.querySelectorAll('.pasos').forEach((caja, n) => {
  const pasos = [...caja.querySelectorAll(':scope > .paso')];
  if (pasos.length < 2) return;
  const lista = document.createElement('div');
  lista.setAttribute('role', 'tablist');
  lista.setAttribute('aria-label', caja.dataset.nombre);
  const tabs = pasos.map((p, i) => {
    const t = document.createElement('button');
    t.type = 'button';
    t.setAttribute('role', 'tab');
    t.id = `paso-${n}-${i}`;
    p.id = `panel-${n}-${i}`;
    t.setAttribute('aria-controls', p.id);
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', t.id);
    t.textContent = p.dataset.titulo;
    lista.append(t);
    return t;
  });
  caja.prepend(lista);
  caja.classList.add('con-pestanas');
  const elegir = t => tabs.forEach((x, i) => {
    const si = x === t;
    x.setAttribute('aria-selected', si);
    x.tabIndex = si ? 0 : -1;
    pasos[i].hidden = !si;
  });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const sig = tabs[(i + d + tabs.length) % tabs.length];
      elegir(sig); sig.focus();
    });
  });
  elegir(tabs[0]);
});

// El fosforito se dibuja la primera vez que el concepto entra en pantalla.
const marcas = document.querySelectorAll('.prosa mark');
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visto'); obs.unobserve(e.target); }
}), { rootMargin: '0px 0px -15% 0px' });
marcas.forEach(m => { m.classList.add('dibujar'); obs.observe(m); });

// «En esta página»: marca el apartado actual y despliega solo los del tema en curso.
const enlaces = [...document.querySelectorAll('.en-pagina a')];
const secciones = enlaces.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
if (secciones.length) {
  const espiar = () => {
    let actual = secciones[0];
    for (const s of secciones) if (s.getBoundingClientRect().top < innerHeight * 0.35) actual = s;
    let temaActual = null;
    enlaces.forEach(a => {
      const si = decodeURIComponent(a.hash.slice(1)) === actual.id;
      a.classList.toggle('activo', si);
      if (si) temaActual = a.closest('[data-tema]');
    });
    document.querySelectorAll('.en-pagina [data-tema]').forEach(li => li.classList.toggle('abierto', li === temaActual));
  };
  addEventListener('scroll', espiar, { passive: true });
  espiar();
}

// Depurador animado: recorre a mano los pasos que trae el fragmento (data-depurar).
document.querySelectorAll('figure[data-depurar]').forEach(fig => {
  const pasos = JSON.parse(fig.dataset.depurar);
  const lineas = fig.querySelectorAll('.line');
  // Estado acumulado de las variables en cada paso.
  const estados = [];
  pasos.reduce((acc, p) => {
    const sig = { ...acc };
    for (const [k, v] of Object.entries(p.v || {})) v === null ? delete sig[k] : sig[k] = v;
    estados.push(sig);
    return sig;
  }, {});

  const abrir = document.createElement('button');
  abrir.type = 'button';
  abrir.className = 'dep-abrir';
  abrir.textContent = 'Depurar';
  abrir.setAttribute('aria-expanded', 'false');
  fig.querySelector('figcaption').append(abrir);

  const panel = document.createElement('div');
  panel.className = 'depurador';
  panel.hidden = true;
  panel.innerHTML = `<div class="dep-controles">
      <button type="button" data-d="reiniciar">Reiniciar</button>
      <button type="button" data-d="atras">Atrás</button>
      <button type="button" data-d="play">Reproducir</button>
      <button type="button" data-d="paso">Paso</button>
      <span class="dep-cuenta"></span></div>
    <p class="dep-nota" aria-live="polite"></p>
    <dl class="dep-vars" aria-label="Variables"></dl>`;
  fig.append(panel);
  const [cuenta, nota, vars, play] = ['.dep-cuenta', '.dep-nota', '.dep-vars', '[data-d=play]'].map(s => panel.querySelector(s));

  let i = 0, reloj = null;
  const parar = () => { clearInterval(reloj); reloj = null; play.textContent = 'Reproducir'; };
  const pintar = () => {
    lineas.forEach(l => l.classList.remove('dep-actual'));
    lineas[pasos[i].l - 1]?.classList.add('dep-actual');
    cuenta.textContent = `Paso ${i + 1} de ${pasos.length}`;
    nota.textContent = pasos[i].t;
    const antes = estados[i - 1] || {};
    vars.replaceChildren(...Object.entries(estados[i]).map(([k, v]) => {
      const fila = document.createElement('div');
      if (antes[k] !== v) fila.className = 'cambia';
      fila.append(Object.assign(document.createElement('dt'), { textContent: k }),
                  Object.assign(document.createElement('dd'), { textContent: v }));
      return fila;
    }));
  };
  const ir = n => { i = Math.max(0, Math.min(pasos.length - 1, n)); pintar(); if (i === pasos.length - 1) parar(); };

  panel.addEventListener('click', e => {
    const d = e.target.dataset?.d;
    if (!d) return;
    if (d !== 'play') parar();
    if (d === 'paso') ir(i + 1);
    if (d === 'atras') ir(i - 1);
    if (d === 'reiniciar') ir(0);
    if (d === 'play') {
      if (reloj) return parar();
      if (i === pasos.length - 1) ir(0);
      play.textContent = 'Pausa';
      reloj = setInterval(() => ir(i + 1), 1600);
    }
  });
  panel.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { parar(); ir(i + 1); }
    if (e.key === 'ArrowLeft') { parar(); ir(i - 1); }
  });
  abrir.addEventListener('click', () => {
    const si = panel.hidden;
    panel.hidden = !si;
    fig.classList.toggle('depurando', si);
    abrir.setAttribute('aria-expanded', si);
    abrir.textContent = si ? 'Cerrar depurador' : 'Depurar';
    parar();
    if (si) { ir(0); panel.querySelector('[data-d=paso]').focus(); }
    else lineas.forEach(l => l.classList.remove('dep-actual'));
  });
});

// Puzle de huecos: cambia los marcadores __n__ del código por casillas y monta la bandeja de piezas.
document.querySelectorAll('figure[data-puzle]').forEach(fig => {
  const piezas = JSON.parse(fig.dataset.puzle).map((p, id) => ({ ...p, id }));

  // 1. Marcadores -> casillas (pueden estar dentro de cualquier span de Shiki, incluso en un String)
  const recorrido = document.createTreeWalker(fig.querySelector('pre'), NodeFilter.SHOW_TEXT);
  const textos = [];
  while (recorrido.nextNode()) if (/__\d+__/.test(recorrido.currentNode.nodeValue)) textos.push(recorrido.currentNode);
  for (const nodo of textos) {
    nodo.replaceWith(...nodo.nodeValue.split(/(__\d+__)/).map(t => {
      const m = t.match(/^__(\d+)__$/);
      if (!m) return document.createTextNode(t);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pz-hueco';
      b.dataset.n = m[1];
      return b;
    }));
  }
  const huecos = [...fig.querySelectorAll('.pz-hueco')];
  const numeros = [...new Set(huecos.map(h => h.dataset.n))];

  // 2. Bandeja y controles
  const panel = document.createElement('div');
  panel.className = 'puzle-panel';
  panel.innerHTML = `<p class="pz-ayuda">¿Qué va en cada hueco? Toca una pieza y luego el hueco, o arrástrala.</p>
    <div class="pz-bandeja" role="group" aria-label="Piezas"></div>
    <div class="pz-controles">
      <button type="button" data-p="comprobar">Comprobar</button>
      <button type="button" data-p="solucion">Ver solución</button>
      <button type="button" data-p="reiniciar">Empezar de nuevo</button>
    </div>
    <p class="pz-estado" aria-live="polite"></p>
    <ul class="pz-porque"></ul>`;
  fig.append(panel);
  const [bandeja, estado, porque] = ['.pz-bandeja', '.pz-estado', '.pz-porque'].map(s => panel.querySelector(s));

  const botones = new Map();
  for (const p of [...piezas].sort(() => Math.random() - .5)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pz-pieza';
    b.textContent = p.t;
    b.draggable = true;
    b.dataset.id = p.id;
    bandeja.append(b);
    botones.set(p.id, b);
  }

  // 3. Estado: qué pieza hay en cada número y qué está seleccionado
  let puestas = {}, elegida = null, huecoElegido = null;
  const limpiarMarcas = () => {
    huecos.forEach(h => h.classList.remove('bien', 'mal'));
    estado.textContent = '';
    porque.replaceChildren();
  };
  const pintar = () => {
    for (const h of huecos) {
      const p = piezas[puestas[h.dataset.n]];
      h.textContent = p ? p.t : '';
      h.classList.toggle('lleno', !!p);
      h.classList.toggle('elegido', huecoElegido === h.dataset.n);
      h.setAttribute('aria-label', p ? `Hueco ${h.dataset.n}: ${p.t}. Pulsa para quitarla` : `Hueco ${h.dataset.n}, vacío`);
    }
    const usadas = new Set(Object.values(puestas));
    for (const [id, b] of botones) {
      b.hidden = usadas.has(id);
      b.setAttribute('aria-pressed', String(elegida === id));
    }
  };
  const poner = (n, id) => {
    for (const [k, v] of Object.entries(puestas)) if (v === id) delete puestas[k];
    puestas[n] = id;
    elegida = huecoElegido = null;
    limpiarMarcas();
    pintar();
  };

  panel.addEventListener('click', e => {
    const pieza = e.target.closest('.pz-pieza');
    if (pieza) {
      const id = Number(pieza.dataset.id);
      if (huecoElegido) return poner(huecoElegido, id);
      elegida = elegida === id ? null : id;
      return pintar();
    }
    const accion = e.target.dataset?.p;
    if (accion === 'reiniciar') { puestas = {}; elegida = huecoElegido = null; limpiarMarcas(); pintar(); }
    if (accion === 'solucion') {
      puestas = {};
      for (const p of piezas) if (p.hueco) puestas[p.hueco] = p.id;
      elegida = huecoElegido = null;
      pintar();
      corregir(true);
    }
    if (accion === 'comprobar') corregir(false);
  });
  fig.querySelector('pre').addEventListener('click', e => {
    const h = e.target.closest('.pz-hueco');
    if (!h) return;
    const n = h.dataset.n;
    if (elegida !== null) return poner(n, elegida);
    if (puestas[n] !== undefined) { delete puestas[n]; limpiarMarcas(); }
    else huecoElegido = huecoElegido === n ? null : n;
    pintar();
  });

  // Arrastrar y soltar con ratón (en pantallas táctiles se usa el toque)
  bandeja.addEventListener('dragstart', e => {
    const pieza = e.target.closest('.pz-pieza');
    if (pieza) e.dataTransfer.setData('text/plain', pieza.dataset.id);
  });
  for (const h of huecos) {
    h.addEventListener('dragover', e => { e.preventDefault(); h.classList.add('encima'); });
    h.addEventListener('dragleave', () => h.classList.remove('encima'));
    h.addEventListener('drop', e => {
      e.preventDefault();
      h.classList.remove('encima');
      const id = e.dataTransfer.getData('text/plain');
      if (id !== '') poner(h.dataset.n, Number(id));
    });
  }

  function corregir(solucion) {
    limpiarMarcas();
    for (const h of huecos) {
      const p = piezas[puestas[h.dataset.n]];
      if (p) h.classList.add(String(p.hueco) === h.dataset.n ? 'bien' : 'mal');
    }
    const aciertos = numeros.filter(n => piezas[puestas[n]]?.hueco === Number(n)).length;
    const vacios = numeros.filter(n => puestas[n] === undefined).length;
    // Explicaciones: las falsas colocadas o, al ver la solución, todas las falsas
    const explicar = solucion ? piezas.filter(p => p.porque)
      : numeros.map(n => piezas[puestas[n]]).filter(p => p && p.porque);
    porque.replaceChildren(...explicar.map(p => {
      const li = document.createElement('li');
      const c = document.createElement('code');
      c.textContent = p.t;
      li.append(c, ` ${p.porque}`);
      return li;
    }));
    if (solucion) estado.textContent = 'Esta es la solución. Debajo, por qué no sirven las otras piezas.';
    else if (aciertos === numeros.length) estado.textContent = 'Todo correcto.';
    else estado.textContent = `${aciertos} de ${numeros.length} correctos${vacios ? `, ${vacios} sin rellenar` : ''}.`;
  }
  pintar();
});
