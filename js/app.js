/**
 * Master Application Coordinator
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Petal Engine
  window.petalEngine = new PetalEngine('petals-canvas');

  // Initialize Countdown
  window.weddingCountdown = new WeddingCountdown();

  // Initialize Calendar & Action Feedback
  window.calendarManager = new CalendarManager();

  // Initialize Window Scene Controller
  window.windowController = new WindowController();

  // Setup Background Music Toggle Buttons (Header + Bottom Switch)
  const musicToggleBtn = document.getElementById('btn-music-toggle');
  const musicStatusText = document.getElementById('music-status-text');
  const bottomMusicToggle = document.getElementById('bottom-music-toggle');

  const updateMusicUI = (isPlaying) => {
    if (musicToggleBtn) {
      musicToggleBtn.classList.toggle('is-playing', isPlaying);
      musicToggleBtn.setAttribute('aria-pressed', String(isPlaying));
    }
    if (musicStatusText) {
      musicStatusText.textContent = isPlaying ? 'Music: Playing' : 'Music: Off';
    }
    if (bottomMusicToggle) {
      bottomMusicToggle.classList.toggle('is-active', isPlaying);
      bottomMusicToggle.setAttribute('aria-checked', String(isPlaying));
    }
    if (window.calendarManager) {
      window.calendarManager.showToast(isPlaying ? 'Romantic melody playing ♫' : 'Music muted');
    }
  };

  if (musicToggleBtn && window.soundEngine) {
    musicToggleBtn.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleMusic();
      updateMusicUI(isPlaying);
    });
  }

  if (bottomMusicToggle && window.soundEngine) {
    bottomMusicToggle.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleMusic();
      updateMusicUI(isPlaying);
    });

    bottomMusicToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isPlaying = window.soundEngine.toggleMusic();
        updateMusicUI(isPlaying);
      }
    });
  }

  // Pre-load audio context on first user touch anywhere
  const warmAudio = () => {
    if (window.soundEngine) {
      window.soundEngine.init();
    }
    document.removeEventListener('pointerdown', warmAudio);
  };
  document.addEventListener('pointerdown', warmAudio, { once: true });
});
