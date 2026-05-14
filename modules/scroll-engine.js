// GSAP ScrollTrigger — cinematic scroll reveals
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollEngine(lenisInstance) {
  if (lenisInstance) {
    lenisInstance.on('scroll', ScrollTrigger.update);
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Hero entrance — immediate, no delay
  gsap.fromTo('.hero-content',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  );

  // Scroll indicator fade out
  gsap.to('.scroll-indicator', {
    opacity: 0,
    y: -20,
    scrollTrigger: {
      trigger: '#about',
      start: 'top 90%',
      end: 'top 60%',
      scrub: true,
    }
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.fromTo(header.children,
      { opacity: 0, y: 25 },
      {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: header, start: 'top 86%', once: true }
      }
    );
  });

  // About columns
  const aboutVisual = document.querySelector('.about-visual-column');
  if (aboutVisual) {
    gsap.fromTo(aboutVisual,
      { opacity: 0, x: -40, scale: 0.97 },
      { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: aboutVisual, start: 'top 85%', once: true }
      }
    );
  }

  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    gsap.fromTo(aboutText.children,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: aboutText, start: 'top 85%', once: true }
      }
    );
  }

  // Tech grid
  const techItems = gsap.utils.toArray('.tech-item');
  if (techItems.length) {
    gsap.fromTo(techItems,
      { opacity: 0, y: 15, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.025, duration: 0.4, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.tech-grid', start: 'top 88%', once: true }
      }
    );
  }

  // Stat counters
  document.querySelectorAll('.stat-number[data-count]').forEach((el) => {
    const end = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: end, duration: 1.8, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
        });
      }
    });
  });

  // Expertise cards
  const expertiseCards = gsap.utils.toArray('.expertise-card');
  if (expertiseCards.length) {
    gsap.fromTo(expertiseCards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.expertise-grid', start: 'top 85%', once: true }
      }
    );
  }

  // Project cards
  const projectCards = gsap.utils.toArray('.project-card');
  if (projectCards.length) {
    gsap.fromTo(projectCards,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.projects-grid', start: 'top 84%', once: true }
      }
    );
  }

  // Contact
  const contactBox = document.querySelector('.contact-box');
  if (contactBox) {
    gsap.fromTo(contactBox,
      { opacity: 0, scale: 0.97, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: contactBox, start: 'top 86%', once: true }
      }
    );
  }

  // Personality items
  const personalityItems = gsap.utils.toArray('.personality-item');
  if (personalityItems.length) {
    gsap.fromTo(personalityItems,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.personality-grid', start: 'top 90%', once: true }
      }
    );
  }

  setTimeout(() => ScrollTrigger.refresh(), 600);
}
