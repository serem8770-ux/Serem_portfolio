// Typing effect — humanized variable-speed character delay with organic pauses
export function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Software Architecture',
    'Cybersecurity Hardening',
    'Ag-Econ Logic Matrices',
    'Global Innovation'
  ];
  
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      el.textContent = currentPhrase.substring(0, charIdx);
    } else {
      charIdx++;
      el.textContent = currentPhrase.substring(0, charIdx);
    }

    // Variable humanized typing speeds
    let baseDelay = isDeleting ? 30 : 75;
    
    // Add realistic randomized micro-pauses while typing forwards
    if (!isDeleting && Math.random() < 0.25) {
      baseDelay += Math.random() * 60;
    }

    // Handle string completion bounds
    if (!isDeleting && charIdx === currentPhrase.length) {
      // Pause at the end of typing a complete phrase
      baseDelay = 2400;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      // Pause briefly before typing the next string
      baseDelay = 450;
    }

    setTimeout(tick, baseDelay);
  }

  // Allow preloader to finish and hero screen to fade in before initiating text output
  setTimeout(tick, 1400);
}
