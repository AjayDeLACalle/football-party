import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect, Line } from 'react-native-svg';

// Original vector illustrations: no club badges, sponsor marks or photos.
export function FootballArt({ label }: { label: string }) {
  return (
    <Svg width="100%" height="235" viewBox="0 0 400 235" accessibilityLabel={label}>
      <Rect x="15" y="15" width="370" height="208" rx="28" fill="#183b2e" />
      <Rect x="35" y="35" width="330" height="168" rx="5" fill="none" stroke="#386349" strokeWidth="2" />
      <Line x1="200" y1="35" x2="200" y2="203" stroke="#386349" strokeWidth="2" />
      <Circle cx="200" cy="118" r="40" fill="none" stroke="#386349" strokeWidth="2" />
      <Path d="M35 75h38v86H35 M365 75h-38v86h38" fill="none" stroke="#386349" strokeWidth="2" />
      <G transform="rotate(-9 132 135)">
        <Ellipse cx="131" cy="218" rx="69" ry="10" fill="#0c231a" opacity="0.6" />
        <Path d="M106 147Q72 148 57 197L76 207l13-25-2 45h94l-2-45 13 25 19-10q-15-48-48-50" fill="#ecefdb" stroke="#091d14" strokeWidth="5" strokeLinejoin="round" />
        <Path d="M99 151l-2 75h17l1-73m19 1v73h17v-73m18-3 3 76h12l-2-65" fill="#81cadd" />
        <Path d="M113 137v17q18 18 36 0v-17" fill="#dfa77b" stroke="#091d14" strokeWidth="4" />
        <Ellipse cx="88" cy="102" rx="9" ry="14" fill="#e8b187" stroke="#091d14" strokeWidth="4" />
        <Ellipse cx="171" cy="102" rx="9" ry="14" fill="#e8b187" stroke="#091d14" strokeWidth="4" />
        <Path d="M92 73q4-40 40-34 40-3 38 39l-3 48q-12 32-35 32-31-5-39-34z" fill="#efbb91" stroke="#091d14" strokeWidth="5" />
        <Path d="M92 83q-14-25 1-39l-2-9 24 4q30-14 51 9 17 12 6 38l-10-15-2-17q-25 13-55 2l-4 23z" fill="#53372a" stroke="#091d14" strokeWidth="5" strokeLinejoin="round" />
        <Path d="M95 112l13 8 7 15 18 5 17-7 9-19 9-5-2 22q-11 28-34 27-24-4-35-26z" fill="#68412c" />
        <Path d="M107 91l15-3m20 0 13 3" stroke="#53372a" strokeWidth="5" strokeLinecap="round" />
        <Circle cx="115" cy="102" r="3.5" fill="#142119" /><Circle cx="149" cy="102" r="3.5" fill="#142119" />
        <Path d="M129 101l-3 13h8m-14 12q12 9 24-2" fill="none" stroke="#9b5b3b" strokeWidth="3" strokeLinecap="round" />
        <Path d="M65 190l11 4m-14 4 9 5" stroke="#64725e" strokeWidth="2" />
      </G>
      <G transform="rotate(8 272 135)">
        <Ellipse cx="274" cy="218" rx="67" ry="10" fill="#0c231a" opacity="0.6" />
        <Path d="M248 149q-31 2-45 48l19 10 12-25-2 45h89l-2-45 12 25 19-10q-16-47-48-48" fill="#4568ec" stroke="#091d14" strokeWidth="5" strokeLinejoin="round" />
        <Path d="M254 140v14q17 15 34 0v-14" fill="#9b6244" stroke="#091d14" strokeWidth="4" />
        <Path d="M248 153q22 26 46 0" fill="none" stroke="#d4deff" strokeWidth="5" />
        <Path d="M236 186h82" stroke="#263f9d" strokeWidth="12" />
        <Ellipse cx="230" cy="105" rx="9" ry="14" fill="#a76c4b" stroke="#091d14" strokeWidth="4" />
        <Ellipse cx="311" cy="105" rx="9" ry="14" fill="#a76c4b" stroke="#091d14" strokeWidth="4" />
        <Path d="M235 71q6-34 37-31 38-2 36 36l-3 45q-11 31-32 32-29-1-36-30z" fill="#b67c55" stroke="#091d14" strokeWidth="5" />
        <Path d="M235 86l-6-17q1-33 39-35 40-3 43 34l-5 19-8-18q-29 5-56-1z" fill="#252c24" stroke="#091d14" strokeWidth="5" />
        <Path d="M244 91l15-3m22 1 15 3" stroke="#292d24" strokeWidth="5" strokeLinecap="round" />
        <Circle cx="252" cy="103" r="3.5" fill="#142119" /><Circle cx="288" cy="103" r="3.5" fill="#142119" />
        <Path d="M269 104l-4 12h8" fill="none" stroke="#865032" strokeWidth="3" strokeLinecap="round" />
        <Path d="M254 126q15 14 30-1" fill="#fff2dd" stroke="#865032" strokeWidth="3" strokeLinejoin="round" />
      </G>
      <Circle cx="201" cy="201" r="25" fill="#f1f2e0" stroke="#091d14" strokeWidth="4" />
      <Path d="M197 186l13 4 2 13-11 7-11-9zM181 197l9 4-3 13m14-4 3 15m8-22 12-2m-14-11 7-9" fill="#142c20" stroke="#142c20" strokeWidth="3" />
      <Path d="M29 51l-9-12m350 138 12 5M191 16l-2-12m171 26 12-9" stroke="#c4fa61" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

export function ArrowIcon({ color }: { color: string }) {
  return <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M6 18 18 6M7 6h11v11" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>;
}

export function ModeIcon({ bomb = false, size = 46 }: { bomb?: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {bomb ? <>
        <Path d="M29 13q-2-8 6-8" fill="none" stroke="#fff1cf" strokeWidth="3" />
        <Path d="m36 2 2 4 5-1-3 4 3 3-5-1-2 4-1-5-5-1 5-2z" fill="#ffba68" />
        <Path d="m24 12 8 3-3 7-8-3z" fill="#fff1cf" />
        <Circle cx="22" cy="30" r="14" fill="#18271d" stroke="#fff1cf" strokeWidth="2.5" />
        <Path d="M14 25q2-5 7-5" fill="none" stroke="#ffba68" strokeWidth="3" strokeLinecap="round" />
      </> : <>
        <Path d="M7 19q17-12 34 0l-3 15q-14 12-28 0z" fill="#183b2e" stroke="#d0ff79" strokeWidth="2.5" />
        <Path d="m12 23 10 2-4 6-7-3m25-5-10 2 4 6 7-3" fill="#d0ff79" />
        <Path d="m13 15 2-6h18l2 6M8 15h32" fill="none" stroke="#d0ff79" strokeWidth="3" strokeLinecap="round" />
      </>}
    </Svg>
  );
}
