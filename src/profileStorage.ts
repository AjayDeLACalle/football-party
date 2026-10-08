import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEGACY_PROFILE_KEY, PROFILE_KEY } from './profiles';
export async function readProfiles(): Promise<string | null> {
  return await AsyncStorage.getItem(PROFILE_KEY) ?? await AsyncStorage.getItem(LEGACY_PROFILE_KEY);
}
export function writeProfiles(value: string): Promise<void> { return AsyncStorage.setItem(PROFILE_KEY, value); }
