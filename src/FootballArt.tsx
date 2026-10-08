import React from 'react';
import { Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Mode } from './lobby';
const scenes = { imposter: require('../assets/chibi/imposter.png'), bomb: require('../assets/chibi/bomb.png'), combo: require('../assets/chibi/combo.png') };
const labels = { imposter: 'Fußballfreunde mit geheimer Rolle', bomb: 'Fußballfreunde reichen das Handy unter Zeitdruck weiter', combo: 'Fußballfreunde lösen gemeinsam drei Vorgaben' };
export function FootballArt({ label }: { label: string }) {
  return <Image source={scenes.imposter} accessibilityLabel={label} resizeMode="contain" style={{ width: '100%', height: 240 }} />;
}
export function ModeArt({ mode, height = 180 }: { mode: Mode; height?: number }) {
  return <Image source={scenes[mode]} accessibilityLabel={labels[mode]} resizeMode="contain" style={{ width: '100%', height }} />;
}
export function BrandIcon({ size = 46 }: { size?: number }) {
  return <Image source={require('../assets/chibi/icon.png')} style={{ width: size, height: size, borderRadius: size * 0.28 }} />;
}
export function ArrowIcon({ color }: { color: string }) {
  return <Svg width={24} height={24} viewBox="0 0 24 24" aria-hidden><Path d="M6 18 18 6M7 6h11v11" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
export function ModeIcon({ mode, bomb = false, size = 46 }: { mode?: Mode; bomb?: boolean; size?: number }) {
  return <Image source={scenes[mode ?? (bomb ? 'bomb' : 'imposter')]} aria-hidden resizeMode="contain" style={{ width: size, height: size }} />;
}
