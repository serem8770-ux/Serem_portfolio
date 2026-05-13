// GSAP ScrollTrigger — cinematic scroll-driven animations
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollEngine(lenisInstance) {
  // Sync Lenis with GSAP ScrollTrigger
  if (lenisInstance) {
    lenisInstance.on('scroll', ScrollTrigger.update);
  }

  // Respect reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Use set + scrollTrigger to avoid invisible-on-load issues
  // Helper: reveal animation that starts hidden, becomes visible on scroll
  function revealFrom(targets, fromVars, triggerEl) {
    const trigger = triggerEl || targets;
    gsap.set(targets, { opacity: 0, ...fromVars });
    ScrollTrigger.create({
      trigger: trigger,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          x: 0, y: 0, scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: fromVars.stagger || 0,
          ...fromVars.toOverrides,
        });
      }
    });
  }

  // Hero entrance (immediate, no scroll trigger needed)
  gsap.from('.hero-content', {
    opacity: 0, y: 50, duration: 1, ease: 'power3.out', delay: 0.6
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.set(header.children, { opacity: 0, y: 25 });
    ScrollTrigger.create({
      trigger: header,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(header.children, {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out'
        });
      }
    });
  });

  // About text
  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    gsap.set(aboutText, { opacity: 0, x: -30 });
    ScrollTrigger.create({
      trigger: aboutText, start: 'top 85%', once: true,
      onEnter: () => gsap.to(aboutText, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' })
    });
  }

  // Skills panel
  const skillsPanel = document.querySelector('.skills-panel');
  if (skillsPanel) {
    gsap.set(skillsPanel, { opacity: 0, x: 30 });
    ScrollTrigger.create({
      trigger: skillsPanel, start: 'top 85%', once: true,
      onEnter: () => gsap.to(skillsPanel, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.15 })
    });
  }

  // Tech items
  const techItems = gsap.utils.toArray('.tech-item');
  if (techItems.length) {
    gsap.set(techItems, { opacity: 0, y: 15, scale: 0.92 });
    ScrollTrigger.create({
      trigger: '.tech-grid', start: 'top 88%', once: true,
      onEnter: () => gsap.to(techItems, { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.45, ease: 'power2.out' })
    });
  }

  // Stat counters
  document.querySelectorAll('.stat-number[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 1.5, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
        });
      }
    });
  });

  // Expertise cards
  const expertiseCards = gsap.utils.toArray('.expertise-card');
  if (expertiseCards.length) {
    gsap.set(expertiseCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.expertise-grid', start: 'top 85%', once: true,
      onEnter: () => gsap.to(expertiseCards, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' })
    });
  }

  // Project cards
  const projectCards = gsap.utils.toArray('.project-card');
  if (projectCards.length) {
    gsap.set(projectCards, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.projects-grid', start: 'top 85%', once: true,
      onEnter: () => gsap.to(projectCards, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' })
    });
  }

  // Contact box
  const contactBox = document.querySelector('.contact-box');
  if (contactBox) {
    gsap.set(contactBox, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: contactBox, start: 'top 88%', once: true,
      onEnter: () => gsap.to(contactBox, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    });
  }

  // Refresh ScrollTrigger after all is set up
  ScrollTrigger.refresh();
}
