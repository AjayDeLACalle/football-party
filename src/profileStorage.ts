import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROFILE_KEY } from './profiles';
export function readProfiles(): Promise<string | null> { return AsyncStorage.getItem(PROFILE_KEY); }
export function writeProfiles(value: string): Promise<void> { return AsyncStorage.setItem(PROFILE_KEY, value); }
