export type Mode = 'imposter' | 'bomb' | 'combo';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'de' | 'en';

export const MAX_PLAYERS = 10;
export const MIN_PLAYERS = 3;

export function maxImposters(playerCount: number): number {
  return Math.max(1, Math.min(3, playerCount - 1));
}

export function validateName(raw: string, players: string[]): 'empty' | 'duplicate' | 'full' | null {
  if (players.length >= MAX_PLAYERS) return 'full';
  const name = raw.trim();
  if (!name) return 'empty';
  if (players.some((p) => p.toLocaleLowerCase() === name.toLocaleLowerCase())) return 'duplicate';
  return null;
}
