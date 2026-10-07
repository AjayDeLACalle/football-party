import { useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

export function useBombSound() {
  const player = useAudioPlayer(require('../assets/explosion.wav'));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    player.pause();
  }

  async function prepare() {
    try {
      await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
      if (!player.isLoaded) throw new Error('Sound still loading');
      await player.seekTo(0);
      setUnavailable(false);
      return true;
    } catch { setUnavailable(true); return false; }
  }

  function schedule(seconds: number) {
    stop();
    timer.current = setTimeout(() => {
      try { player.play(); } catch { setUnavailable(true); }
    }, seconds * 1000);
  }

  async function preview() { if (await prepare()) schedule(0.05); }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { prepare, schedule, stop, preview, unavailable };
}
