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
