import { MAX_PLAYERS, validateName } from './lobby';
export type AvatarConfig = { hair: number; head: number; skin: number; jersey: number; accessory: number };
export type PlayerProfile = { name: string; avatar: AvatarConfig };
export const defaultAvatar: AvatarConfig = { hair: 0, head: 0, skin: 2, jersey: 0, accessory: 0 };
export const PROFILE_KEY = 'football-party.profiles.v1';
export function normalizeAvatar(value: unknown): AvatarConfig {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return Object.fromEntries(Object.entries(defaultAvatar).map(([key, fallback]) => {
    const choice = raw[key];
    return [key, typeof choice === 'number' && Number.isInteger(choice) && choice >= 0 && choice < (key === 'accessory' ? 6 : 5) ? choice : fallback];
  })) as AvatarConfig;
}
export function parseProfiles(raw: string | null): PlayerProfile[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const profiles: PlayerProfile[] = [];
    for (const entry of value) {
      if (!entry || typeof entry !== 'object' || typeof entry.name !== 'string') continue;
      const name = entry.name.trim().slice(0, 20);
      if (!validateName(name, profiles.map(p => p.name))) profiles.push({ name, avatar: normalizeAvatar(entry.avatar) });
      if (profiles.length === MAX_PLAYERS) break;
    }
    return profiles;
  } catch { return []; }
}
