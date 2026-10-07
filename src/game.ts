import { bombQuestions, footballers } from './catalog';
import type { BombQuestion } from './catalog';
import { MAX_PLAYERS, MIN_PLAYERS, maxImposters } from './lobby';
import type { Difficulty } from './lobby';

export const BOMB_DURATION_MS = 60_000;
type Random = () => number;

export function pick<T>(pool: readonly T[], random: Random = Math.random, previous?: T): T {
  const choices = pool.filter((item) => item !== previous);
  if (!choices.length) throw new Error('No available choices');
  return choices[Math.floor(random() * choices.length)];
}

export type ImposterRound = {
  players: string[];
  footballer: string;
  imposters: number[];
  current: number;
  revealed: boolean;
  hasSeen: boolean;
  phase: 'deal' | 'discussion' | 'result';
};

export function createImposterRound(players: string[], count: number, difficulty: Difficulty, previous?: string, random: Random = Math.random): ImposterRound {
  if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS || !Number.isInteger(count) || count < 1 || count > maxImposters(players.length)) throw new Error('Invalid team');
  const indices = players.map((_, index) => index);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return { players: [...players], footballer: pick(footballers[difficulty], random, previous), imposters: indices.slice(0, count), current: 0, revealed: false, hasSeen: false, phase: 'deal' };
}

export type RoundAction = 'reveal' | 'hide' | 'next' | 'unmask';
export function advanceRound(round: ImposterRound, action: RoundAction): ImposterRound {
  if (action === 'unmask') return round.phase === 'discussion' ? { ...round, phase: 'result' } : round;
  if (round.phase !== 'deal') return round;
  if (action === 'reveal') return { ...round, revealed: true, hasSeen: true };
  if (action === 'hide') return { ...round, revealed: false };
  if (action === 'next' && round.hasSeen && !round.revealed) {
    if (round.current === round.players.length - 1) return { ...round, phase: 'discussion' };
    return { ...round, current: round.current + 1, hasSeen: false, revealed: false };
  }
  return round;
}

export function selectQuestion(difficulty: Difficulty, previous?: BombQuestion, random: Random = Math.random): BombQuestion {
  return pick(bombQuestions[difficulty], random, previous);
}

export function remainingSeconds(deadline: number, now: number): number {
  return Math.max(0, Math.min(60, Math.ceil((deadline - now) / 1000)));
}
