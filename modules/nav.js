// Navigation — hamburger toggle, scroll spy, scroll-based navbar style
export function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile menu
  function toggleMenu(open) {
    const isOpen = open ?? !navLinks.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    navOverlay?.classList.toggle('visible', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', () => toggleMenu());
  navOverlay?.addEventListener('click', () => toggleMenu(false));
  links.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

  // Navbar scroll effect
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active link highlight
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        links.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
