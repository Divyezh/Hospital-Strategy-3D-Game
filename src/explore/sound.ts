/**
 * MediCity Explore - Howler.js Audio Engine
 * High-performance audio powered by Howler.js using procedural 16-bit PCM WAV synthesizers:
 * - Ambulance emergency siren loop
 * - Car / traffic engine idle & acceleration drone loop
 * - Gate opening & closing mechanical motor and latch sound
 * - People ambient chatter / vocal murmur loop
 */
import { Howl, Howler } from 'howler';

/**
 * Creates a valid base64 data URI for a 16-bit PCM mono WAV file from a sample generation callback.
 */
function createWavDataUri(durationSec: number, sampleRate = 22050, sampleFn: (t: number) => number): string {
  const numSamples = Math.floor(durationSec * sampleRate);
  const blockAlign = 2; // 1 channel * 16 bits / 8
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint8(0, 0x52); // 'R'
  view.setUint8(1, 0x49); // 'I'
  view.setUint8(2, 0x46); // 'F'
  view.setUint8(3, 0x46); // 'F'
  view.setUint32(4, 36 + dataSize, true);

  // WAVE format
  view.setUint8(8, 0x57);  // 'W'
  view.setUint8(9, 0x41);  // 'A'
  view.setUint8(10, 0x56); // 'V'
  view.setUint8(11, 0x45); // 'E'

  // fmt subchunk
  view.setUint8(12, 0x66); // 'f'
  view.setUint8(13, 0x6d); // 'm'
  view.setUint8(14, 0x74); // 't'
  view.setUint8(15, 0x20); // ' '
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true);  // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample

  // data subchunk
  view.setUint8(36, 0x64); // 'd'
  view.setUint8(37, 0x61); // 'a'
  view.setUint8(38, 0x74); // 't'
  view.setUint8(39, 0x61); // 'a'
  view.setUint32(40, dataSize, true);

  // PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let s = sampleFn(t);
    // Hard clip
    s = Math.max(-1, Math.min(1, s));
    // Convert float to 16-bit signed integer
    const sampleInt = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, sampleInt, true);
    offset += 2;
  }

  // Convert buffer to Base64 string
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

class HowlerCampusAudioEngine {
  private sirenHowl: Howl | null = null;
  private engineHowl: Howl | null = null;
  private gateOpenHowl: Howl | null = null;
  private gateCloseHowl: Howl | null = null;
  private peopleHowl: Howl | null = null;

  private isMuted = true;
  private isInitialized = false;

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // 1. Ambulance Siren Sound (2-second looping dual-tone emergency wail 920Hz & 660Hz)
      const sirenWav = createWavDataUri(2.0, 22050, (t) => {
        // High tone in first second (920Hz), Low tone in second second (660Hz) with smooth modulation
        const isHigh = (t % 2.0) < 1.0;
        const baseFreq = isHigh ? 920 : 660;
        const vibrato = Math.sin(t * Math.PI * 14) * 25;
        const freq = baseFreq + vibrato;
        // Sawtooth / Sine blend for cutting emergency acoustic timbre
        const phase = (t * freq) % 1.0;
        const sawtooth = 2 * (phase - Math.floor(phase + 0.5));
        const sine = Math.sin(t * freq * 2 * Math.PI);
        return (sawtooth * 0.4 + sine * 0.6) * 0.35;
      });

      this.sirenHowl = new Howl({
        src: [sirenWav],
        loop: true,
        volume: 0.22,
        html5: false,
      });

      // 2. Car Engine Sound (1.5-second seamless loop: rhythmic 60Hz cylinders + rumble)
      const engineWav = createWavDataUri(1.5, 22050, (t) => {
        const fundamental = 62 + Math.sin(t * 3) * 4;
        const sub1 = Math.sin(t * fundamental * 2 * Math.PI);
        const sub2 = Math.sin(t * fundamental * 2 * 2 * Math.PI) * 0.5;
        const sub3 = Math.sin(t * fundamental * 4 * 2 * Math.PI) * 0.25;
        const noise = (Math.random() * 2 - 1) * 0.08;
        return (sub1 + sub2 + sub3 + noise) * 0.28;
      });

      this.engineHowl = new Howl({
        src: [engineWav],
        loop: true,
        volume: 0.18,
        html5: false,
      });

      // 3. Gate Opening Sound (1.2-second motorized servo pitch-up + metal track slide)
      const gateOpenWav = createWavDataUri(1.2, 22050, (t) => {
        const env = Math.exp(-t * 2.2);
        const freq = 120 + t * 90; // Rising motor pitch
        const motor = Math.sin(t * freq * 2 * Math.PI) * 0.4;
        const scrape = (Math.random() * 2 - 1) * 0.25 * (1 - t / 1.2);
        // Access chime beep
        const chime = t < 0.25 ? Math.sin(t * 1100 * 2 * Math.PI) * 0.3 : 0;
        return (motor + scrape + chime) * env;
      });

      this.gateOpenHowl = new Howl({
        src: [gateOpenWav],
        loop: false,
        volume: 0.45,
        html5: false,
      });

      // 4. Gate Closing Sound (1.2-second motorized servo pitch-down + latch lock click)
      const gateCloseWav = createWavDataUri(1.2, 22050, (t) => {
        const env = Math.exp(-t * 2.0);
        const freq = 200 - t * 80; // Lowering motor pitch
        const motor = Math.sin(t * freq * 2 * Math.PI) * 0.35;
        const scrape = (Math.random() * 2 - 1) * 0.2 * (1 - t / 1.2);
        // Metallic lock click at end
        const click = t > 0.8 && t < 0.9 ? Math.sin((t - 0.8) * 3500 * 2 * Math.PI) * 0.5 : 0;
        return (motor + scrape + click) * env;
      });

      this.gateCloseHowl = new Howl({
        src: [gateCloseWav],
        loop: false,
        volume: 0.45,
        html5: false,
      });

      // 5. People Voice & Hospital Murmur (2-second loop: multi-voice formant murmur)
      const peopleWav = createWavDataUri(2.0, 22050, (t) => {
        // Multi-layered vocal formant frequencies
        const v1 = Math.sin(t * 520 * 2 * Math.PI + Math.sin(t * 7) * 2) * 0.25;
        const v2 = Math.sin(t * 780 * 2 * Math.PI + Math.cos(t * 5) * 3) * 0.2;
        const v3 = Math.sin(t * 1240 * 2 * Math.PI) * 0.12;
        const whisper = (Math.random() * 2 - 1) * 0.08 * (0.8 + 0.2 * Math.sin(t * 6));
        return (v1 + v2 + v3 + whisper) * 0.3;
      });

      this.peopleHowl = new Howl({
        src: [peopleWav],
        loop: true,
        volume: 0.2,
        html5: false,
      });

      // Global volume
      Howler.volume(0.65);
      this.isInitialized = true;
    } catch (err) {
      console.warn('Howler audio initialization deferred:', err);
    }
  }

  /**
   * Start or unmute all playback streams
   */
  public play() {
    this.init();
    this.isMuted = false;
    Howler.mute(false);

    if (this.sirenHowl && !this.sirenHowl.playing()) {
      this.sirenHowl.play();
    }
    if (this.engineHowl && !this.engineHowl.playing()) {
      this.engineHowl.play();
    }
    if (this.peopleHowl && !this.peopleHowl.playing()) {
      this.peopleHowl.play();
    }
  }

  /**
   * Pause / mute audio streams
   */
  public mute() {
    this.isMuted = true;
    Howler.mute(true);
  }

  public toggleMute(): boolean {
    if (this.isMuted) {
      this.play();
      return false; // unmuted
    } else {
      this.mute();
      return true; // muted
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Trigger gate opening sound
   */
  public playGateOpen() {
    if (this.isMuted) return;
    this.init();
    if (this.gateOpenHowl) {
      this.gateOpenHowl.play();
    }
  }

  /**
   * Trigger gate closing sound
   */
  public playGateClose() {
    if (this.isMuted) return;
    this.init();
    if (this.gateCloseHowl) {
      this.gateCloseHowl.play();
    }
  }

  /**
   * Modulate ambulance siren volume based on dock state
   */
  public setSirenVolume(vol: number) {
    if (this.sirenHowl) {
      this.sirenHowl.volume(Math.max(0.01, Math.min(0.4, vol)));
    }
  }
}

export const howlerAudio = new HowlerCampusAudioEngine();
// Alias for backwards compatibility
export const campusAudio = {
  init: () => howlerAudio.init(),
  resume: () => howlerAudio.play(),
  toggleMute: () => howlerAudio.toggleMute(),
  getMuted: () => howlerAudio.getMuted(),
  playGateSound: (isOpen: boolean) => {
    if (isOpen) {
      howlerAudio.playGateOpen();
    } else {
      howlerAudio.playGateClose();
    }
  },
  setSirenVolume: (vol: number) => howlerAudio.setSirenVolume(vol),
};
