/** Synthesized dhol and curtain-whoosh sounds via Web Audio — no audio files needed. */

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AC = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!AC) return null;
    audioCtx ??= new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

export function playDholHit(tapIndex: number) {
  try {
    const ac = ctx();
    if (!ac) return;
    const t = ac.currentTime;
    const bass = tapIndex % 2 === 0;

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(bass ? 170 : 240, t);
    osc.frequency.exponentialRampToValueAtTime(bass ? 55 : 95, t + 0.1);
    gain.gain.setValueAtTime(bass ? 0.9 : 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (bass ? 0.35 : 0.18));
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.4);

    const len = Math.floor(ac.sampleRate * 0.06);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = bass ? 900 : 2400;
    const nGain = ac.createGain();
    nGain.gain.setValueAtTime(bass ? 0.35 : 0.5, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    noise.connect(filter).connect(nGain).connect(ac.destination);
    noise.start(t);
  } catch {
    /* audio unavailable */
  }
}

export function playCurtainWhoosh() {
  try {
    const ac = ctx();
    if (!ac) return;
    const t = ac.currentTime;

    const len = Math.floor(ac.sampleRate * 0.9);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(350, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 0.7);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
    noise.connect(filter).connect(gain).connect(ac.destination);
    noise.start(t);
    noise.stop(t + 0.9);
  } catch {
    /* audio unavailable */
  }
}
