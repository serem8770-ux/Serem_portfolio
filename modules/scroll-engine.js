// GSAP ScrollTrigger Engine — Cinematic reveal timelines synchronized with smooth scrolling
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollEngine(lenisInstance) {
  // Seamlessly bind Lenis scroll progression to GSAP updates
  if (lenisInstance) {
    lenisInstance.on('scroll', ScrollTrigger.update);
  }

  // Gracefully skip timeline construction if accessibility reduces motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // --- Hero Section Staggered Entrance ---
  gsap.fromTo('.hero-content', 
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 }
  );

  // --- Section Headers Reveal ---
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.fromTo(header.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 86%',
          once: true,
        }
      }
    );
  });

  // --- About Philosophy Column Reveal ---
  const aboutVisual = document.querySelector('.about-visual-column');
  if (aboutVisual) {
    gsap.fromTo(aboutVisual,
      { opacity: 0, x: -50, scale: 0.95 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutVisual,
          start: 'top 85%',
          once: true,
        }
      }
    );
  }

  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    gsap.fromTo(aboutText.children,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutText,
          start: 'top 85%',
          once: true,
        }
      }
    );
  }

  // --- Tech Stack Flow Grid ---
  const techItems = gsap.utils.toArray('.tech-item');
  if (techItems.length) {
    gsap.fromTo(techItems,
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.03,
        duration: 0.5,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.tech-grid',
          start: 'top 88%',
          once: true,
        }
      }
    );
  }

  // --- Statistical Counters Animation ---
  document.querySelectorAll('.stat-number[data-count]').forEach((element) => {
    const endValue = parseInt(element.dataset.count, 10);
    
    ScrollTrigger.create({
      trigger: element,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: endValue,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate() {
            element.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });

  // --- Core Domain Expertise Cards ---
  const expertiseCards = gsap.utils.toArray('.expertise-card');
  if (expertiseCards.length) {
    gsap.fromTo(expertiseCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.expertise-grid',
          start: 'top 85%',
          once: true,
        }
      }
    );
  }

  // --- Premium Project Showcases ---
  const projectCards = gsap.utils.toArray('.project-card');
  if (projectCards.length) {
    gsap.fromTo(projectCards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.25,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 84%',
          once: true,
        }
      }
    );
  }

  // --- Global Contact Center Reveal ---
  const contactBox = document.querySelector('.contact-box');
  if (contactBox) {
    gsap.fromTo(contactBox,
      { opacity: 0, scale: 0.96, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contactBox,
          start: 'top 86%',
          once: true,
        }
      }
    );
  }

  // Final synchronization calculation refresh
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 600);
}
