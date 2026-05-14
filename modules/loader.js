// Preloader — bulletproof asset sync with triple-redundancy dismissal
export function initLoader() {
  return new Promise((resolve) => {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloader-progress');

    if (!preloader) {
      resolve();
      return;
    }

    let loaded = 0;
    let isFinished = false;

    const tick = () => {
      loaded += Math.random() * 20 + 5;
      if (loaded > 96) loaded = 96;
      if (progress) progress.style.width = `${loaded}%`;
    };

    const interval = setInterval(tick, 100);

    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      clearInterval(interval);

      // Cancel the inline-script failsafe timer since we handled it
      if (window.__PRELOADER_FAILSAFE_TIMER__) {
        clearTimeout(window.__PRELOADER_FAILSAFE_TIMER__);
      }

      if (progress) progress.style.width = '100%';

      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('done');
        }
        document.body.style.overflow = '';
        resolve();
      }, 350);
    };

    // Primary failsafe — fires no matter what after 1.5s
    setTimeout(finish, 1500);

    // Font-ready trigger
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => setTimeout(finish, 400))
        .catch(() => setTimeout(finish, 400));
    } else {
      window.addEventListener('load', () => setTimeout(finish, 400), { once: true });
    }
  });
}
