// Preloader — shows branded loading screen until assets are ready
export function initLoader() {
  return new Promise((resolve) => {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloader-progress');
    if (!preloader) { resolve(); return; }

    let loaded = 0;
    const tick = () => {
      loaded += Math.random() * 15 + 5;
      if (loaded > 95) loaded = 95;
      progress.style.width = loaded + '%';
    };
    const interval = setInterval(tick, 120);

    const finish = () => {
      clearInterval(interval);
      progress.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.style.overflow = '';
        resolve();
      }, 400);
    };

    // Wait for fonts + small delay for Three.js init
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(finish, 600));
    } else {
      setTimeout(finish, 1200);
    }
  });
}
