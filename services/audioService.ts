class AudioService {
  private context: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private initialized: boolean = false;

  constructor() {
    // Changing BGM to "Luosifen" (螺蛳粉)
    // Using a direct link proxy for the song often associated with this meme or title
    this.bgmAudio = new Audio('https://music.163.com/song/media/outer/url?id=472061244.mp3'); 
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.4;
  }

  // Must be called after a user interaction (click) to unlock AudioContext
  init() {
    if (this.initialized) return;
    
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.error("AudioContext not supported", e);
    }
  }

  get muted() {
    return this.isMuted;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgmAudio?.pause();
    } else {
      if (this.initialized) {
        this.bgmAudio?.play().catch(e => console.log("BGM play failed:", e));
      }
    }
    return this.isMuted;
  }

  playBgm() {
    if (!this.isMuted && this.bgmAudio && this.initialized) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  stopBgm() {
    this.bgmAudio?.pause();
  }

  // Synthesize a short "tick" sound for the randomizer
  playTick() {
    if (this.isMuted || !this.context) return;
    
    // Create oscillator
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    
    // Short high-pitch blip
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }

  // Synthesize a "click" sound for buttons
  playClick() {
    if (this.isMuted || !this.context) return;
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.context.currentTime);
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.05);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }

  // Synthesize a "Win" chime
  playWin() {
    if (this.isMuted || !this.context) return;

    const now = this.context.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio
    
    notes.forEach((freq, i) => {
      const osc = this.context!.createOscillator();
      const gain = this.context!.createGain();
      
      osc.connect(gain);
      gain.connect(this.context!.destination);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + i * 0.08;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }
}

export const audioService = new AudioService();