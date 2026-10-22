/**
 * Romantic Falling Petals & Golden Hearts Simulation
 * High performance HTML5 Canvas implementation
 */
class PetalEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.maxParticles = 18;
    this.animationFrameId = null;

    // Check prefers-reduced-motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.colors = [
      'rgba(244, 216, 220, 0.75)', // Blush Pink
      'rgba(199, 125, 135, 0.7)',  // Dusty Rose
      'rgba(232, 185, 194, 0.8)',  // Medium Rose
      'rgba(199, 166, 106, 0.65)'  // Muted Gold
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticle(initialBurst = false) {
    const isHeart = Math.random() < 0.25;
    return {
      x: initialBurst ? (this.width / 2 + (Math.random() - 0.5) * 260) : Math.random() * this.width,
      y: initialBurst ? (this.height * 0.35 + (Math.random() - 0.5) * 120) : -20,
      size: Math.random() * 8 + 8,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: (Math.random() - 0.5) * 1.5,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.04,
      sway: Math.random() * 2 + 1,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.4,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      isHeart: isHeart
    };
  }

  burst(count = 30) {
    if (this.reducedMotion) return;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
    if (!this.isRunning) {
      this.start();
    }
  }

  start() {
    if (this.reducedMotion) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.angle);
    this.ctx.fillStyle = p.color;

    if (p.isHeart) {
      // Draw tiny stylized heart
      const hSize = p.size * 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, hSize * 0.3);
      this.ctx.bezierCurveTo(-hSize, -hSize * 0.5, -hSize * 0.8, -hSize, 0, -hSize * 0.3);
      this.ctx.bezierCurveTo(hSize * 0.8, -hSize, hSize, -hSize * 0.5, 0, hSize * 0.3);
      this.ctx.fill();
    } else {
      // Draw organic curved rose petal
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.7, p.size * 0.6, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += Math.sin(p.swayOffset) * p.sway + p.speedX;
      p.swayOffset += p.swaySpeed;
      p.angle += p.angularSpeed;

      // Remove particles fallen out of bounds
      if (p.y > this.height + 30 || p.x < -40 || p.x > this.width + 40) {
        this.particles.splice(i, 1);
      }
    }

    // Keep a few ambient particles floating
    if (this.particles.length < this.maxParticles && Math.random() < 0.08) {
      this.particles.push(this.createParticle(false));
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      this.drawPetal(this.particles[i]);
    }

    this.update();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }
}

window.PetalEngine = PetalEngine;
