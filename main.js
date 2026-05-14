// ============================================================
//  Kevin Serem Portfolio — Master Orchestrator
//  Synchronizes all logic layers, Three.js 3D capabilities, and animations
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
  // 1. Initialize Three.js 3D capabilities safely (non-blocking)
  let isThreeActive = false;
  try {
    isThreeActive = initHeroScene();
  } catch (error) {
    console.warn('Three.js skipped:', error);
  }

  // 2. Await completion of preloading screen
  try {
    await initLoader();
  } catch (loaderError) {
    // Force-dismiss preloader if loader itself throws
    const el = document.getElementById('preloader');
    if (el) el.classList.add('done');
    document.body.style.overflow = '';
  }

  // 3. Instantiate cinematic smooth scroll (skip on mobile/reduced motion)
  let lenis = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    try {
      lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 2,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (lenisError) {
      console.warn('Smooth scroll skipped:', lenisError);
    }
  }

  // 4. Initialize all interactive subsystems — each wrapped to prevent cascade failure
  try { initNav(); } catch (e) { console.warn('Nav skipped:', e); }
  try { initTyping(); } catch (e) { console.warn('Typing skipped:', e); }
  try { initScrollEngine(lenis); } catch (e) { console.warn('ScrollEngine skipped:', e); }
  try { initCursor(); } catch (e) { console.warn('Cursor skipped:', e); }

  // QA inspection hook
  window.__SEREM_APP_STATE__ = {
    threeInitialized: !!isThreeActive,
    smoothScrollActive: !!lenis,
    reducedMotion: prefersReduced,
    timestamp: new Date().toISOString()
  };
});
