import { useEffect, useRef, useState } from 'react';

type SafariWindow = Window & { webkitAudioContext?: typeof AudioContext };

export function useBombSound() {
  const context = useRef<AudioContext | null>(null);
  const sources = useRef<AudioScheduledSourceNode[]>([]);
  const [unavailable, setUnavailable] = useState(false);

  function stop() {
    for (const source of sources.current) {
      try { source.stop(); } catch { /* Source may already have ended. */ }
    }
    sources.current = [];
  }

  async function prepare() {
    try {
      const Constructor = window.AudioContext ?? (window as SafariWindow).webkitAudioContext;
      if (!Constructor) throw new Error('Web Audio unavailable');
      context.current ??= new Constructor();
      await context.current.resume();
      if (context.current.state !== 'running') throw new Error('Audio suspended');
      setUnavailable(false);
      return true;
    } catch {
      setUnavailable(true);
      return false;
    }
  }

  function schedule(seconds: number) {
    stop();
    const audio = context.current;
    if (!audio || audio.state !== 'running') { setUnavailable(true); return; }
    const start = audio.currentTime + seconds;
    const noise = audio.createBuffer(1, Math.floor(audio.sampleRate * 1.2), audio.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * Math.exp(-i / audio.sampleRate * 6);
    const source = audio.createBufferSource();
    source.buffer = noise;
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.75, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
    source.connect(filter).connect(gain).connect(audio.destination);
    const bass = audio.createOscillator();
    bass.frequency.setValueAtTime(85, start);
    bass.frequency.exponentialRampToValueAtTime(30, start + 1);
    const bassGain = audio.createGain();
    bassGain.gain.setValueAtTime(0.6, start);
    bassGain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
    bass.connect(bassGain).connect(audio.destination);
    sources.current = [source, bass];
    source.start(start); source.stop(start + 1.2);
    bass.start(start); bass.stop(start + 1.2);
  }

  async function preview() {
    if (await prepare()) schedule(0.05);
  }

  useEffect(() => () => {
    stop();
    void context.current?.close();
  }, []);

  return { prepare, schedule, stop, preview, unavailable };
}
