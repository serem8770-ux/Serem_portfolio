// ============================================================
//  Serem Portfolio — Main Orchestrator
//  Imports and initializes all modules in the correct order
// ============================================================
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { initLoader } from './modules/loader.js';
import { initHeroScene } from './modules/hero-scene.js';
import { initScrollEngine } from './modules/scroll-engine.js';
import { initNav } from './modules/nav.js';
import { initCursor } from './modules/cursor.js';
import { initTyping } from './modules/typing.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Show preloader while assets load
  document.body.style.overflow = 'hidden';

  // 2. Initialize Three.js scene (renders behind preloader)
  initHeroScene();

  // 3. Wait for preloader to finish
  await initLoader();

  // 4. Initialize smooth scrolling
  let lenis = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 5. Initialize all modules
  initNav();
  initTyping();
  initScrollEngine(lenis);
  initCursor();
});
