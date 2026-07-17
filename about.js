function animatePillIn(el, duration = 600) {
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic, adjust to match nav feel
    el.style.transform = `scaleX(${eased})`;

    if (t < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

document.addEventListener('DOMContentLoaded', () => {
  const pill = document.querySelector('.about-hero__pill');
  animatePillIn(pill);
});