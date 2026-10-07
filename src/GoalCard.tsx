import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import type { Language } from './lobby';
import { gameCopy } from './gameCopy';

function Ball() {
  return <Svg width="100%" height="100%" viewBox="0 0 180 180">
    <Circle cx="90" cy="90" r="84" fill="#f2f4e5" stroke="#20382b" strokeWidth="5" />
    <G fill="#20382b"><Path d="M90 57L121 80L110 115H70L59 80Z" /><Path d="M47 25L59 43L37 71L12 67L23 41Z" /><Path d="M133 25L157 42L168 67L143 71L121 43Z" /><Path d="M12 118L38 112L56 140L43 161L23 146Z" /><Path d="M168 118L157 146L137 161L124 140L142 112Z" /><Path d="M70 171L76 148H104L110 171Z" /></G>
    <G fill="none" stroke="#20382b" strokeWidth="2"><Path d="M59 43L90 57L121 43M37 71L59 80M121 80L143 71M38 112L70 115L76 148M110 115L142 112M104 148L110 115" /></G>
    <Path d="M50 21Q90 2 126 24" stroke="#ffffff" strokeWidth="8" fill="none" opacity="0.8" />
  </Svg>;
}
export function GoalCard({ revealed, secret, hint, imposter, language, onReveal, onHide }: { revealed: boolean; secret: string; hint?: string; imposter: boolean; language: Language; onReveal: () => void; onHide: () => void }) {
  const t = gameCopy[language];
  const [width, setWidth] = useState(320);
  const revealX = Math.max(75, width / 2 - 42);
  const offset = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(offset, { toValue: revealed ? revealX : 0, duration: 220, useNativeDriver: true }).start(); }, [revealed, revealX, offset]);
  function restore() { Animated.spring(offset, { toValue: revealed ? revealX : 0, useNativeDriver: true }).start(); }
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: (_, gesture) => offset.setValue(Math.max(0, Math.min(revealX, (revealed ? revealX : 0) + gesture.dx))),
    onPanResponderRelease: (_, gesture) => {
      if (!revealed && gesture.dx > 50) onReveal();
      else if (revealed && gesture.dx < -40) onHide();
      else restore();
    },
    onPanResponderTerminate: restore,
  }), [revealed, revealX, offset, onReveal, onHide]);
  return <View testID="secret-card" onLayout={e => setWidth(e.nativeEvent.layout.width)} style={s.card} {...pan.panHandlers}>
    <Svg width="100%" height="100%" viewBox="0 0 340 300" preserveAspectRatio="none" style={StyleSheet.absoluteFill} aria-hidden accessible={Platform.OS === 'web' ? undefined : false}>
      <Rect width="340" height="300" fill="#1d402b" />
      <G stroke="#729778" strokeWidth="1" opacity="0.32">{Array.from({ length: 14 }, (_, i) => <Line key={`v${i}`} x1={i * 26} y1="28" x2={i * 26} y2="230" />)}{Array.from({ length: 9 }, (_, i) => <Line key={`h${i}`} x1="18" y1={28 + i * 25} x2="322" y2={28 + i * 25} />)}</G>
      <Path d="M20 230V28H320V230" stroke="#f2f4e5" strokeWidth="7" fill="none" strokeLinejoin="round" /><Path d="M0 250H340M98 300V272H242V300" stroke="#729778" strokeWidth="2" fill="none" />
    </Svg>
    <View style={s.secret} pointerEvents="none">
      {revealed && <><Text style={[s.label, imposter && { color: '#ff9b61' }]}>{imposter ? t.imposter : t.footballer}</Text>{!imposter && <Text testID="footballer-name" style={s.name}>{secret}</Text>}{imposter && hint && <View style={s.hintBox}><Text style={s.hintLabel}>{language === 'de' ? 'DEIN HINWEIS' : 'YOUR HINT'}</Text><Text testID="imposter-hint" style={s.hint}>{hint}</Text></View>}</>}
    </View>
    <Animated.View testID="reveal-ball" style={[s.ball, { transform: [{ translateX: offset }, { translateY: offset.interpolate({ inputRange: [0, revealX], outputRange: [0, 88], extrapolate: 'clamp' }) }, { scale: offset.interpolate({ inputRange: [0, revealX], outputRange: [1, 0.48], extrapolate: 'clamp' }) }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={revealed ? t.hide : t.card} onPress={revealed ? onHide : onReveal} style={s.ballButton}><Ball /></Pressable>
    </Animated.View>
    {!revealed && <Text style={s.swipe}>{t.swipe} →</Text>}
  </View>;
}
const s = StyleSheet.create({
  card: { height: 300, backgroundColor: '#1d402b', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#2b4835', ...(Platform.OS === 'web' ? { touchAction: 'pan-y', userSelect: 'none' } as object : {}) },
  secret: { position: 'absolute', top: 40, bottom: 88, left: 27, right: 27, justifyContent: 'center', alignItems: 'center', gap: 13 },
  label: { color: '#c4fa61', fontWeight: '900', fontSize: 13, letterSpacing: 1, textAlign: 'center', backgroundColor: '#173320', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8 },
  name: { color: '#f2f4e5', fontWeight: '900', fontSize: 29, lineHeight: 34, textAlign: 'center', backgroundColor: '#173320', padding: 8, borderRadius: 10 },
  hintBox: { backgroundColor: '#173320', padding: 12, borderRadius: 12, alignItems: 'center', gap: 7 }, hintLabel: { color: '#ff9b61', fontWeight: '800', fontSize: 9, letterSpacing: 1 }, hint: { color: '#f2f4e5', fontSize: 15, lineHeight: 21, textAlign: 'center' },
  ball: { position: 'absolute', width: 168, height: 168, top: 67, left: '50%', marginLeft: -84 }, ballButton: { flex: 1 }, swipe: { position: 'absolute', bottom: 22, left: 10, right: 10, color: '#f2f4e5', fontWeight: '800', fontSize: 12, textAlign: 'center' },
});
