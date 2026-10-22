/**
 * Window Scene & Interaction Orchestrator
 * Coordinates Stages A, B, C, D, and E (Replay)
 */
class WindowController {
  constructor() {
    this.windowScene = document.getElementById('window-scene');
    this.windowContainer = document.getElementById('interactive-window');
    this.btnOpen = document.getElementById('btn-open-invitation');
    this.btnReplay = document.getElementById('btn-replay-invitation');
    this.cardContainer = document.getElementById('invitation-card-container');
    this.coupleSvg = document.getElementById('chibi-couple-svg');

    this.isOpen = false;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    // Both window and button trigger opening
    if (this.windowContainer) {
      this.windowContainer.addEventListener('click', (e) => {
        if (!this.isOpen && !this.isTransitioning) {
          this.openWindow();
        }
      });

      // Keyboard accessibility
      this.windowContainer.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !this.isOpen && !this.isTransitioning) {
          e.preventDefault();
          this.openWindow();
        }
      });
    }

    if (this.btnOpen) {
      this.btnOpen.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.isOpen && !this.isTransitioning) {
          this.openWindow();
        }
      });
    }

    if (this.btnReplay) {
      this.btnReplay.addEventListener('click', (e) => {
        e.preventDefault();
        this.replay();
      });
    }

    // Couple easter egg interactive touch
    if (this.coupleSvg) {
      this.coupleSvg.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerCoupleHappy();
      });
    }

    // Auto-open if query param or path includes opened
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open') === '1' || urlParams.get('open') === 'true' || window.location.hash === '#open' || window.location.href.includes('opened')) {
      this.openWindow(true);
    }
  }

  openWindow(immediate = false) {
    if (this.isOpen || this.isTransitioning) return;
    this.isTransitioning = !immediate;
    this.isOpen = true;

    // 1. Play gentle opening chime
    if (window.soundEngine && !immediate) {
      window.soundEngine.playWindowOpenChime();
    }

    // 2. Add open state to window container (triggers 3D shutter rotation & curtain slide)
    this.windowContainer.classList.add('is-open');
    this.windowContainer.setAttribute('aria-expanded', 'true');
    this.windowContainer.setAttribute('tabindex', '-1');

    // 3. Burst festive petals & golden hearts
    if (window.petalEngine) {
      window.petalEngine.burst(32);
    }

    if (immediate) {
      this.windowScene.classList.add('is-revealed');
      this.cardContainer.classList.add('is-visible');
      this.isTransitioning = false;
      return;
    }

    // 4. Mark scene as revealed (fades out first-impression open button smoothly)
    setTimeout(() => {
      this.windowScene.classList.add('is-revealed');
    }, 400);

    // 5. Reveal the wedding invitation card in coordinated sequence
    setTimeout(() => {
      this.cardContainer.classList.add('is-visible');
      this.isTransitioning = false;

      // Scroll smoothly down slightly so the card is comfortably in view
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        window.scrollBy({
          top: 180,
          behavior: 'smooth'
        });
      }
    }, 900);
  }

  replay() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.isOpen = false;

    // 1. Smoothly fade out card
    this.cardContainer.classList.remove('is-visible');

    // 2. Smoothly scroll back to top/window
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 3. Close shutters & curtains
    setTimeout(() => {
      this.windowContainer.classList.remove('is-open');
      this.windowContainer.setAttribute('aria-expanded', 'false');
      this.windowContainer.setAttribute('tabindex', '0');
      this.windowScene.classList.remove('is-revealed');
    }, 300);

    setTimeout(() => {
      this.isTransitioning = false;
      if (this.btnOpen) {
        this.btnOpen.focus();
      }
    }, 1200);
  }

  triggerCoupleHappy() {
    if (!this.coupleSvg) return;

    if (window.soundEngine) {
      window.soundEngine.playCuteSparkle();
    }

    if (window.petalEngine) {
      window.petalEngine.burst(12);
    }

    this.coupleSvg.classList.add('is-happy');
    setTimeout(() => {
      this.coupleSvg.classList.remove('is-happy');
    }, 2400);
  }
}

window.WindowController = WindowController;
