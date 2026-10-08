import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, AppState, Easing, Image, PanResponder, Platform, StyleSheet, Text, View } from 'react-native';
import { gameCopy } from './gameCopy';
import type { Language } from './lobby';
import { MotionPressable, useReducedMotion } from './Motion';
import { colors as C } from './theme';

export function RefereeCard({ revealed, dealing, coverToken, secret, imposter, language, onDeal, onReveal, onHide }: {
  revealed: boolean; dealing: boolean; coverToken: number; secret: string; imposter: boolean; language: Language;
  onDeal: () => void; onReveal: () => void; onHide: () => void;
}) {
  const t = gameCopy[language];
  const reduced = useReducedMotion();
  const [refereeReady, setRefereeReady] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const pose = useRef(new Animated.Value(0)).current;
  const generation = useRef(0);
  const drawing = useRef(false);
  const callbacks = useRef({ onReveal, onHide }); callbacks.current = { onReveal, onHide };
  function stop() {
    generation.current++; drawing.current = false;
    progress.stopAnimation(); pose.stopAnimation(); pose.setValue(0);
  }
  useEffect(() => {
    stop();
    Animated.timing(progress, { toValue: 0, duration: reduced ? 0 : 180, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(({ finished }) => { if (finished) setCardVisible(false); });
  }, [coverToken]);
  useEffect(() => {
    const cancel = () => { stop(); setCardVisible(false); progress.setValue(0); };
    const native = AppState.addEventListener('change', state => { if (state !== 'active') cancel(); });
    const visibility = () => { if (document.hidden) cancel(); };
    if (Platform.OS === 'web') { window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', visibility); }
    return () => { stop(); native.remove(); if (Platform.OS === 'web') { window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', visibility); } };
  }, []);
  function draw() {
    if (!refereeReady || revealed || dealing || drawing.current) return;
    const ticket = ++generation.current;
    drawing.current = true; onDeal(); setCardVisible(true); progress.setValue(0); pose.setValue(0);
    Animated.timing(pose, { toValue: 2, duration: reduced ? 0 : 520, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start();
    Animated.sequence([
      Animated.delay(reduced ? 0 : 490),
      Animated.timing(progress, { toValue: 1, duration: reduced ? 0 : 450, easing: Easing.out(Easing.back(1.08)), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished || ticket !== generation.current) return;
      drawing.current = false; callbacks.current.onReveal();
    });
  }
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => revealed && Math.abs(gesture.dy) > 12 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_, gesture) => { if (revealed) progress.setValue(1 - Math.max(0, Math.min(gesture.dy, 200)) / 260); },
    onPanResponderRelease: (_, gesture) => { if (revealed && gesture.dy > 45) callbacks.current.onHide(); else Animated.spring(progress, { toValue: 1, useNativeDriver: true, speed: 25, bounciness: 3 }).start(); },
    onPanResponderTerminate: () => Animated.spring(progress, { toValue: revealed ? 1 : 0, useNativeDriver: true }).start(),
  }), [revealed]);
  const opacities = [
    pose.interpolate({ inputRange: [0, 0.15, 0.65, 2], outputRange: [1, 1, 0, 0] }),
    pose.interpolate({ inputRange: [0, 0.25, 0.8, 1.1, 1.45, 2], outputRange: [0, 0, 1, 1, 0, 0] }),
    pose.interpolate({ inputRange: [0, 1.1, 1.45, 2], outputRange: [0, 0, 1, 1] }),
  ];
  return <View testID="secret-card" style={s.stage} {...pan.panHandlers}>
    <View style={s.spotlight} />
    <Animated.View testID="referee-animation" style={[s.referee, { opacity: progress.interpolate({ inputRange: [0, 0.65, 1], outputRange: [1, 0.4, 0] }), transform: [{ rotate: pose.interpolate({ inputRange: [0, 0.8, 1.5, 2], outputRange: ['0deg', '-3deg', '2deg', '0deg'] }) }, { translateY: pose.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 3, -2] }) }] }]} pointerEvents={revealed ? 'none' : 'auto'}>
      <MotionPressable accessibilityRole="button" accessibilityLabel={t.card} disabled={!refereeReady || dealing || revealed} onPress={draw} style={s.refereeButton}>
        <View style={s.frameContainer}>{[0, 1, 2].map(index => <Animated.View key={index} style={[s.frame, { opacity: opacities[index] }]}><Image source={require('../assets/chibi/referee.png')} onLoad={() => setRefereeReady(true)} style={{ position: 'absolute', width: 660, height: 330, left: -220 * index }} />{index === 2 && imposter && <View style={s.smallRedCard} />}</Animated.View>)}</View>
      </MotionPressable>
    </Animated.View>
    {!revealed && !dealing && !cardVisible && <View pointerEvents="none" style={s.tapBadge}><Text style={s.tapText}>{!refereeReady ? (language === 'de' ? 'SCHIRI KOMMT …' : 'REFEREE LOADING …') : language === 'de' ? 'SCHIRI ANTIPPEN' : 'TAP THE REFEREE'}</Text><Text style={s.tapSub}>{language === 'de' ? 'Deine Karte wartet.' : 'Your card is waiting.'}</Text></View>}
    {cardVisible && <Animated.View testID="referee-card" style={[s.card, { backgroundColor: imposter ? '#D52B48' : C.yellow, opacity: progress.interpolate({ inputRange: [0, 0.09, 1], outputRange: [0, 1, 1] }), transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-68, 0] }) }, { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-85, 0] }) }, { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.06, 1] }) }, { rotate: progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: ['-14deg', '2deg', '0deg'] }) }] }]}>
      {revealed && <View style={s.face}><Text testID={imposter ? 'imposter-role' : 'footballer-name'} accessibilityLiveRegion="polite" style={[s.name, imposter && s.white]}>{imposter ? t.imposter : secret}</Text></View>}
    </Animated.View>}
  </View>;
}
const s = StyleSheet.create({
  stage: { height: 378, position: 'relative', alignItems: 'center', justifyContent: 'center', backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, borderRadius: 28, overflow: 'hidden', ...(Platform.OS === 'web' ? { userSelect: 'none', touchAction: 'none' } as object : {}) },
  spotlight: { position: 'absolute', width: 240, height: 240, borderRadius: 130, borderWidth: 1, borderColor: '#FFD55720', backgroundColor: '#FFD55705' },
  referee: { position: 'absolute', top: 0, bottom: 42, left: 0, right: 0 }, refereeButton: { flex: 1, alignItems: 'center', justifyContent: 'center' }, frameContainer: { width: 220, height: 330, position: 'relative' }, frame: { position: 'absolute', width: 220, height: 330, overflow: 'hidden' }, smallRedCard: { position: 'absolute', left: 36, top: 5, width: 20, height: 30, backgroundColor: '#D52B48', borderRadius: 2, borderWidth: 1, borderColor: '#9F1934' },
  tapBadge: { position: 'absolute', bottom: 19, alignItems: 'center' }, tapText: { color: C.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.5 }, tapSub: { color: C.muted, fontSize: 11, marginTop: 5 },
  card: { position: 'absolute', left: 24, right: 24, top: 18, bottom: 18, borderRadius: 22, borderWidth: 2, borderColor: '#ffffff50', shadowColor: '#000', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.4, shadowRadius: 22, elevation: 10 }, face: { flex: 1, padding: 22, alignItems: 'center', justifyContent: 'center' }, name: { color: '#241a06', fontWeight: '800', fontSize: 32, lineHeight: 39, textAlign: 'center' }, white: { color: '#fff', fontSize: 27 },
});
