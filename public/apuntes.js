// Tema: oscuro por defecto; si se elige claro, se recuerda (el <head> lo aplica antes de pintar).
const raiz = document.documentElement;
const btn = document.querySelector('.tema-btn');
const pintar = () => { btn.textContent = raiz.dataset.tema === 'claro' ? 'Tema oscuro' : 'Tema claro'; };
if (btn) {
  pintar();
  btn.addEventListener('click', () => {
    if (raiz.dataset.tema === 'claro') { delete raiz.dataset.tema; localStorage.removeItem('tema'); }
    else { raiz.dataset.tema = 'claro'; localStorage.setItem('tema', 'claro'); }
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
