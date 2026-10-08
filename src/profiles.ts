import { MAX_PLAYERS, validateName } from './lobby';
export const CHARACTER_COUNT = 12;
export type AvatarConfig = { character: number };
export type PlayerProfile = { name: string; avatar: AvatarConfig };
export const defaultAvatar: AvatarConfig = { character: 0 };
export const PROFILE_KEY = 'footy-party.profiles.v2';
export const LEGACY_PROFILE_KEY = 'football-party.profiles.v1';
export function randomAvatar(used: readonly AvatarConfig[] = [], random = Math.random): AvatarConfig {
  const occupied = new Set(used.map(avatar => avatar.character));
  const all = Array.from({ length: CHARACTER_COUNT }, (_, i) => i);
  const unused = all.filter(character => !occupied.has(character));
  const choices = unused.length ? unused : all;
  return { character: choices[Math.floor(random() * choices.length)] };
}
export function normalizeAvatar(value: unknown): AvatarConfig {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const choice = raw.character;
  return { character: typeof choice === 'number' && Number.isInteger(choice) && choice >= 0 && choice < CHARACTER_COUNT ? choice : defaultAvatar.character };
}
export function parseProfiles(raw: string | null, random = Math.random): PlayerProfile[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const profiles: PlayerProfile[] = [];
    for (const entry of value) {
      if (!entry || typeof entry !== 'object' || typeof entry.name !== 'string') continue;
      const name = entry.name.trim().slice(0, 20);
      if (!validateName(name, profiles.map(p => p.name))) {
        const legacy = entry.avatar && typeof entry.avatar === 'object' && !('character' in entry.avatar);
        const avatar = legacy ? randomAvatar(profiles.map(p => p.avatar), random) : normalizeAvatar(entry.avatar);
        profiles.push({ name, avatar });
      }
      if (profiles.length === MAX_PLAYERS) break;
    }
    return profiles;
  } catch { return []; }
}
