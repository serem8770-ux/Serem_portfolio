// Typing effect — improved with requestAnimationFrame awareness
export function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = ['Agricultural Economics', 'Cybersecurity', 'Innovation', 'Ag-Tech Solutions'];
  let wordIdx = 0, charIdx = 0, isDeleting = false;

  function tick() {
    const word = words[wordIdx];

    if (isDeleting) {
      charIdx--;
      el.textContent = word.substring(0, charIdx);
    } else {
      charIdx++;
      el.textContent = word.substring(0, charIdx);
    }

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIdx === word.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  // Start after a small delay to let hero animate in
  setTimeout(tick, 1200);
}
