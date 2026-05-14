// State-Aware Dynamic Custom Cursor — scales smoothly with custom label projections
export function initCursor() {
  // Gracefully degrade on coarse touch screens or disabled pointers
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let isInitialized = false;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!isInitialized) {
      isInitialized = true;
      document.body.classList.add('cursor-ready');
      ringX = mouseX;
      ringY = mouseY;
    }
  }, { passive: true });

  // Flawless high-speed lerp loop
  function renderCursor() {
    if (isInitialized) {
      // Damping coefficients calibrated for luxurious fluid drag
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Map deep hover integration targets
  const attachHoverListeners = () => {
    const interactiveTargets = document.querySelectorAll('a, button, [data-cursor-label], .tech-item, .expertise-card, .project-card');
    
    interactiveTargets.forEach((element) => {
      // Prevent attaching duplicate listeners
      if (element.dataset.cursorBound) return;
      element.dataset.cursorBound = "true";

      element.addEventListener('mouseenter', () => {
        ring.classList.add('hover');
        const customLabel = element.getAttribute('data-cursor-label') || element.querySelector('[data-cursor-label]')?.getAttribute('data-cursor-label');
        
        if (customLabel) {
          ring.setAttribute('data-cursor-label', customLabel);
          ring.classList.add('hover-label');
        }
      }, { passive: true });

      element.addEventListener('mouseleave', () => {
        ring.classList.remove('hover', 'hover-label');
        ring.removeAttribute('data-cursor-label');
      }, { passive: true });
    });
  };

  attachHoverListeners();

  // Re-map listeners dynamically if content reveals or DOM shifts
  window.addEventListener('scroll', attachHoverListeners, { passive: true, once: true });
}
