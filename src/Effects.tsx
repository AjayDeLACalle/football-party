import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native';
import { ModeIcon } from './FootballArt';
import type { Language, Mode } from './lobby';
import { useReducedMotion } from './Motion';
import { colors as C } from './theme';

export function ModeLaunch({ mode, language, onDone }: { mode: Mode; language: Language; onDone: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const done = useRef(onDone); done.current = onDone;
  const reduced = useReducedMotion();
  const accent = mode === 'bomb' ? C.red : C.blue;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: reduced ? 100 : 580, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(({ finished }) => { if (finished) done.current(); });
    return () => progress.stopAnimation();
  }, [progress, reduced]);
  if (reduced) return null;
  return <Modal transparent visible animationType="none" onRequestClose={() => done.current()}>
    <Animated.View testID="mode-launch" accessibilityViewIsModal role="dialog" aria-modal accessibilityLabel={language === 'de' ? 'Modus startet' : 'Starting mode'} style={[s.launch, { opacity: progress.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] }) }]}>
      <Animated.View style={[s.launchRing, { borderColor: accent, transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.15, 5] }) }] }]} />
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 1.12, 1] }) }] }}><ModeIcon mode={mode} size={110} /><Text style={[s.launchTitle, { color: accent }]}>KICK-OFF!</Text><Text style={s.launchMode}>{mode === 'bomb' ? (language === 'de' ? 'BOMBE' : 'BOMB') : mode === 'combo' ? (language === 'de' ? 'DREIERKETTE' : 'TRIPLE THREAT') : 'IMPOSTER'}</Text></Animated.View>
    </Animated.View>
  </Modal>;
}
export function ResultBlast({ kind, language }: { kind: 'bomb' | 'imposter'; language: Language }) {
  const progress = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: reduced ? 100 : 780, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    return () => progress.stopAnimation();
  }, [progress, reduced]);
  if (reduced) return null;
  return <Animated.View pointerEvents="none" aria-hidden style={[s.blast, { opacity: progress.interpolate({ inputRange: [0, 0.2, 0.65, 1], outputRange: [0.9, 0.8, 0.3, 0] }) }]}>
    {!reduced && <View style={s.rays}>{Array.from({ length: 10 }, (_, i) => <Animated.View key={i} style={[s.ray, { transform: [{ rotate: `${i * 36}deg` }, { scaleY: progress.interpolate({ inputRange: [0, 1], outputRange: [0.25, 3] }) }] }]} />)}</View>}
    <Animated.Text style={[s.blastWord, { transform: [{ scale: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1.2, 1.4] }) }] }]}>{kind === 'bomb' ? 'BOOM!' : language === 'de' ? 'ERWISCHT!' : 'CAUGHT!'}</Animated.Text>
  </Animated.View>;
}
const s = StyleSheet.create({
  launch: { flex: 1, backgroundColor: '#080A10f5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, launchRing: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 12, opacity: 0.25 }, launchTitle: { fontSize: 42, fontWeight: '900', fontStyle: 'italic', marginTop: 15 }, launchMode: { color: C.ink, fontSize: 11, fontWeight: '900', letterSpacing: 3, marginTop: 13 },
  blast: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center', zIndex: 30, overflow: 'hidden' }, blastWord: { color: '#fff', fontSize: 48, fontWeight: '900', fontStyle: 'italic', textAlign: 'center' }, rays: { position: 'absolute', width: 0, height: 0 }, ray: { position: 'absolute', width: 20, height: 450, left: -10, top: -225, backgroundColor: '#ffffff28' },
});
