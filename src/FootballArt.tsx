import React from 'react';
import { Image, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Line } from 'react-native-svg';
import type { Mode } from './lobby';
import { colors as C } from './theme';

export function FootballArt({ label }: { label: string }) {
  return <Image source={require('../assets/chibi/cover.png')} accessibilityLabel={label} resizeMode="contain" style={{ width: '100%', height: 240 }} />;
}
export function BrandIcon({ size = 46 }: { size?: number }) {
  return <Image source={require('../assets/chibi/icon.png')} style={{ width: size, height: size, borderRadius: size * 0.28 }} />;
}
export function ArrowIcon({ color }: { color: string }) {
  return <Svg width={24} height={24} viewBox="0 0 24 24" aria-hidden><Path d="M6 18 18 6M7 6h11v11" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
export function ModeIcon({ mode, bomb = false, size = 46 }: { mode?: Mode; bomb?: boolean; size?: number }) {
  const selected = mode ?? (bomb ? 'bomb' : 'imposter');
  return <Svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
    {selected === 'bomb' ? <>
      <Ellipse cx="31" cy="58" rx="20" ry="4" fill="#00000040" />
      <Path d="M37 15Q34 3 45 5" fill="none" stroke="#bec8dc" strokeWidth="3" />
      <Path d="M49 1L49 6L56 4L52 10L58 14L51 13L49 20L46 13L40 15L43 10L38 6L45 7Z" fill={C.red} />
      <Path d="M29 14L40 17L37 24L26 21Z" fill="#8594ac" />
      <Circle cx="31" cy="38" r="21" fill="#202b40" stroke="#5592ff" strokeWidth="2" />
      <Path d="M16 34Q18 22 29 23" stroke="#8eb6ff" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Ellipse cx="27" cy="39" rx="3" ry="5" fill="#fff" /><Ellipse cx="40" cy="39" rx="3" ry="5" fill="#fff" />
      <Path d="M29 49Q34 53 39 48" stroke={C.red} strokeWidth="3" fill="none" strokeLinecap="round" />
    </> : selected === 'combo' ? <>
      <Rect x="6" y="15" width="31" height="39" rx="7" fill="#1a2c4d" stroke={C.blue} strokeWidth="2" transform="rotate(-14 20 35)" />
      <Rect x="28" y="13" width="29" height="39" rx="7" fill="#391725" stroke={C.red} strokeWidth="2" transform="rotate(14 42 32)" />
      <Rect x="19" y="9" width="29" height="41" rx="7" fill={C.blue} stroke="#a4c6ff" strokeWidth="2" />
      <Path d="M30 21H38L33 29H38L32 38H27" stroke="#080A10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="9" cy="8" r="2" fill={C.red} /><Circle cx="55" cy="56" r="2" fill={C.blue} />
    </> : <>
      <Rect x="10" y="11" width="38" height="47" rx="9" fill="#662033" transform="rotate(-11 29 34)" />
      <Rect x="17" y="6" width="37" height="48" rx="9" fill={C.red} stroke="#ff9bab" strokeWidth="2" />
      <Path d="M26 21Q35 12 45 21L45 38Q36 47 26 38Z" fill="#141822" />
      <Path d="M29 24L34 26L30 29M41 24L36 26L40 29" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M31 35Q36 40 41 34" stroke={C.blue} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M8 8L8 1M4 4H12M56 43L61 47" stroke={C.blue} strokeWidth="2" strokeLinecap="round" />
    </>}
  </Svg>;
}
