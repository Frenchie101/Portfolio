const configs = {
  yellow: {
    x: 199.29, y: 29.25, w: 126.78, h: 126.78, rx: 63.39,
    dir: 'left',
    rightEdge: 326.07,
    startOpen: true          // rests open, closes to a circle on hover
    // no href: this is the current page
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
    href: 'about.html'
  }
};
 
const NS = 'http://www.w3.org/2000/svg';
const BLEED = 5000;
const DURATION = 1300;
 
function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function lerp(a, b, t) { return a + (b - a) * t; }
 
function applyRect(el, cfg, p) {
  const extraW = lerp(0, BLEED, p);
  if (cfg.dir === 'left') {
    const newW = cfg.w + extraW;
    el.setAttribute('x', cfg.rightEdge - newW);
    el.setAttribute('width', newW);
  } else {
    el.setAttribute('x', cfg.leftEdge);
    el.setAttribute('width', cfg.w + extraW);
  }
  el.setAttribute('y', cfg.y);
  el.setAttribute('height', cfg.h);
  el.setAttribute('rx', cfg.rx);
  el.setAttribute('ry', cfg.rx);
}
 
const state = {};
const elements = {};
 
function animate(id, toVal) {
  const el = elements[id];
  const cfg = configs[id];
  const s = state[id];
  if (s.raf) cancelAnimationFrame(s.raf);
  const start = performance.now();
  const from = s.progress;
 
  function step(now) {
    const t = Math.min(1, (now - start) / DURATION);   // was Math.min(10, ...)
    s.progress = lerp(from, toVal, ease(t));
    applyRect(el, cfg, s.progress);
    if (t < 1) s.raf = requestAnimationFrame(step);
  }
  s.raf = requestAnimationFrame(step);
}
 
Object.entries(configs).forEach(([id, cfg]) => {
  const el = document.getElementById(id);
  elements[id] = el;
 
  // resting state: 1 = fully open, 0 = circle
  const rest = cfg.startOpen ? 1 : 0;
  state[id] = { progress: rest, raf: null };
  applyRect(el, cfg, rest);
 
  // Hover target. For a pill that rests open, hovering it shrinks it out
  // from under the cursor, which would fire mouseleave and make it flicker.
  // So it gets an invisible rect covering its full open footprint instead,
  // and that rect stays put while the pill animates.
  let target = el;
  if (cfg.startOpen) {
    el.style.pointerEvents = 'none';
    const hit = document.createElementNS(NS, 'rect');
    // pills that grow left cover [rightEdge - w - BLEED, rightEdge];
    // pills that grow right cover [leftEdge, leftEdge + w + BLEED]
    const hitX = cfg.dir === 'left' ? cfg.rightEdge - cfg.w - BLEED : cfg.leftEdge;
    hit.setAttribute('x', hitX);
    hit.setAttribute('y', cfg.y);
    hit.setAttribute('width', cfg.w + BLEED);
    hit.setAttribute('height', cfg.h);
    hit.setAttribute('fill', 'none');
    hit.style.pointerEvents = 'all';
    el.after(hit);
    target = hit;
  }
 
  target.addEventListener('mouseenter', () => animate(id, 1 - rest));
  target.addEventListener('mouseleave', () => animate(id, rest));
 
  if (cfg.href) {
    target.addEventListener('click', () => {
      animate(id, 1);
      document.getElementById('fade').classList.add('on');
      setTimeout(() => { window.location.href = cfg.href; }, 1000);
    });
  }
});


async function handleSubmit() {
      const fname = document.getElementById('fname').value.trim();
      const lname = document.getElementById('lname').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const err = document.getElementById('cf-error');
      const btn = document.getElementById('cf-submit');

      if (!fname || !lname || !email || !message) {
        err.textContent = 'Please fill out all fields.';
        err.style.display = 'block';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = 'Please enter a valid email address.';
        err.style.display = 'block';
        return;
      }

      err.style.display = 'none';
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const res = await fetch('https://formspree.io/f/xpqojejv', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: `${fname} ${lname}`, email, message })
        });

        if (res.ok) {
          document.getElementById('cf-form').style.display = 'none';
          document.getElementById('cf-success').style.display = 'block';
        } else {
          err.textContent = 'Something went wrong. Please try again.';
          err.style.display = 'block';
          btn.textContent = 'Send';
          btn.disabled = false;
        }
      } catch {
        err.textContent = 'Network error. Please check your connection and try again.';
        err.style.display = 'block';
        btn.textContent = 'Send';
        btn.disabled = false;
      }
    }

    function resetForm() {
      ['fname','lname','email','message'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('cf-submit').textContent = 'Send';
      document.getElementById('cf-submit').disabled = false;
      document.getElementById('cf-form').style.display = 'block';
      document.getElementById('cf-success').style.display = 'none';
    }