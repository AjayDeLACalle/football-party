import { PROFILE_KEY } from './profiles';
export async function readProfiles(): Promise<string | null> { return window.localStorage.getItem(PROFILE_KEY); }
export async function writeProfiles(value: string): Promise<void> { window.localStorage.setItem(PROFILE_KEY, value); }
