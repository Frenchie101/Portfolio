const configs = {
  yellow: {
    x: 199.29, y: 29.25, w: 126.78, h: 126.78, rx: 63.39,
    dir: 'left',
    rightEdge: 326.07,
    href: 'about.html'
  },
  red: {
    x: 116.89, y: 216.93, w: 65.74, h: 65.74, rx: 32.87,
    dir: 'left',
    rightEdge: 182.63,
    href: 'work.html'
  },
  purple: {
    x: 468.35, y: 225.82, w: 114.70, h: 114.70, rx: 57.35,
    dir: 'right',
    leftEdge: 468.35,
    href: 'contact.html'
  }
};

const BLEED = 5000;
const DURATION = 600;

function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function lerp(a, b, t) { return a + (b - a) * t; }

function applyRect(el, cfg, p) {
  const extraW = lerp(0, BLEED, p);
  if (cfg.dir === 'left') {
    const newW = cfg.w + extraW;
    el.setAttribute('x',     cfg.rightEdge - newW);
    el.setAttribute('width', newW);
  } else {
    el.setAttribute('x',     cfg.leftEdge);
    el.setAttribute('width', cfg.w + extraW);
  }
  el.setAttribute('y',      cfg.y);
  el.setAttribute('height', cfg.h);
  el.setAttribute('rx',     cfg.rx);
  el.setAttribute('ry',     cfg.rx);
}

const state = {};
const elements = {};

Object.entries(configs).forEach(([id, cfg]) => {
  elements[id] = document.getElementById(id);
  state[id] = { progress: 0, raf: null };
  applyRect(elements[id], cfg, 0);
});

function animateAll(toVal) {
  Object.entries(configs).forEach(([id, cfg]) => {
    const el = elements[id];
    const s = state[id];
    if (s.raf) cancelAnimationFrame(s.raf);
    const start = performance.now();
    const from = s.progress;

    function step(now) {
      const t = Math.min(1, (now - start) / DURATION);
      s.progress = lerp(from, toVal, ease(t));
      applyRect(el, cfg, s.progress);
      if (t < 1) s.raf = requestAnimationFrame(step);
    }
    s.raf = requestAnimationFrame(step);
  });
}

// Object.entries(configs).forEach(([id, cfg]) => {
//   const el = elements[id];

//   el.addEventListener('mouseenter', () => animateAll(1));
//   el.addEventListener('mouseleave', () => animateAll(0));

//   el.addEventListener('click', () => {
//     animateAll(1);
//     document.getElementById('fade').classList.add('on');
//     setTimeout(() => { window.location.href = cfg.href; }, 1000);
//   });
// }); 

Object.entries(configs).forEach(([id, cfg]) => {
  const el = elements[id];

  el.addEventListener('mouseenter', () => animate(id, 1));
  el.addEventListener('mouseleave', () => animate(id, 0));

  el.addEventListener('click', () => {
    animate(id, 1);
    document.getElementById('fade').classList.add('on');
    setTimeout(() => { window.location.href = cfg.href; }, 1000);
  });
});

function animate(id, toVal) {
  const el = elements[id];
  const cfg = configs[id];
  const s = state[id];
  if (s.raf) cancelAnimationFrame(s.raf);
  const start = performance.now();
  const from = s.progress;

  function step(now) {
    const t = Math.min(10, (now - start) / DURATION);
    s.progress = lerp(from, toVal, ease(t));
    applyRect(el, cfg, s.progress);
    if (t < 1) s.raf = requestAnimationFrame(step);
  }
  s.raf = requestAnimationFrame(step);
}

document.querySelectorAll('.cls-3').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'opacity 3.25s ease';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
  });
});