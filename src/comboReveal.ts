export const COMBO_REVEAL_MS = 3000;
// One new condition per second; all values remain visible after three seconds.
export function comboRevealStep(elapsed: number): number {
  return Math.min(3, Math.max(0, Math.floor(elapsed / 1000) + 1));
}
