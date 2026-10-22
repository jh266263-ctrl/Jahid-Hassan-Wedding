/**
 * Audio Synthesizer using Web Audio API
 * Provides gentle music box chime and romantic background melody.
 * Zero external audio file dependencies.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.melodyTimer = null;
    this.currentNoteIndex = 0;
    this.volume = 0.18; // Soft, gentle volume

    // Romantic music box melody note frequencies (Pachelbel-inspired sequence)
    // D4, A3, B3, F#3, G3, D3, G3, A3
    this.melodyNotes = [
      { freq: 587.33, dur: 0.6 }, // D5
      { freq: 440.00, dur: 0.6 }, // A4
      { freq: 493.88, dur: 0.6 }, // B4
      { freq: 369.99, dur: 0.6 }, // F#4
      { freq: 392.00, dur: 0.6 }, // G4
      { freq: 293.66, dur: 0.6 }, // D4
      { freq: 392.00, dur: 0.6 }, // G4
      { freq: 440.00, dur: 0.6 }, // A4
      { freq: 587.33, dur: 0.9 }, // D5
      { freq: 659.25, dur: 0.4 }, // E5
      { freq: 739.99, dur: 0.8 }, // F#5
      { freq: 587.33, dur: 0.6 }, // D5
      { freq: 493.88, dur: 0.8 }, // B4
      { freq: 440.00, dur: 0.8 }, // A4
      { freq: 392.00, dur: 0.8 }, // G4
      { freq: 440.00, dur: 1.0 }  // A4
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single bell / chime note
  playChimeNote(freq, time = 0, duration = 1.2, gainFactor = 1) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Warm music box timbre: triangle oscillator with harmonic sine
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + time);

      const startTime = this.ctx.currentTime + time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.volume * gainFactor, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Magical wind-chime / sparkle sound effect when opening window
  playWindowOpenChime() {
    this.init();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C Major arpeggio
    chords.forEach((note, index) => {
      this.playChimeNote(note, index * 0.12, 1.5, 0.8);
    });
  }

  // Cute giggle / harp sparkle for couple interaction
  playCuteSparkle() {
    this.init();
    if (!this.ctx) return;

    const notes = [659.25, 783.99, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      this.playChimeNote(freq, idx * 0.08, 0.9, 0.6);
    });
  }

  // Background romantic melody loop
  startMelody() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.scheduleNextNote();
  }

  scheduleNextNote() {
    if (!this.isPlaying) return;

    const note = this.melodyNotes[this.currentNoteIndex];
    this.playChimeNote(note.freq, 0, note.dur * 1.5, 0.7);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melodyNotes.length;
    this.melodyTimer = setTimeout(() => {
      this.scheduleNextNote();
    }, note.dur * 1000);
  }

  stopMelody() {
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }
}

window.soundEngine = new SoundEngine();
