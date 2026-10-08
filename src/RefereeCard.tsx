import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, AppState, Easing, Image, PanResponder, Platform, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { gameCopy } from './gameCopy';
import type { Language } from './lobby';
import { MotionPressable, useReducedMotion } from './Motion';
import { colors as C } from './theme';

export function mascotForName(name: string): number {
  return Array.from(name).reduce((hash, letter) => (hash * 31 + letter.codePointAt(0)!) >>> 0, 0) % 12;
}
export function RefereeCard({ revealed, dealing, coverToken, secret, hint, imposter, language, onDeal, onReveal, onHide }: {
  revealed: boolean; dealing: boolean; coverToken: number; secret: string; hint?: string; imposter: boolean; language: Language;
  onDeal: () => void; onReveal: () => void; onHide: () => void;
}) {
  const t = gameCopy[language];
  const reduced = useReducedMotion();
  const [refereeReady, setRefereeReady] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;
  const generation = useRef(0);
  const drawing = useRef(false);
  const callbacks = useRef({ onReveal, onHide });
  callbacks.current = { onReveal, onHide };

  function stop() {
    generation.current++;
    drawing.current = false;
    progress.stopAnimation();
    wobble.stopAnimation();
    wobble.setValue(0);
  }
  useEffect(() => {
    stop();
    Animated.timing(progress, { toValue: 0, duration: reduced ? 0 : 180, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(({ finished }) => { if (finished) setCardVisible(false); });
  }, [coverToken]);
  useEffect(() => {
    // Invalidate synchronously: a pending animation must never reveal after blur.
    const cancel = () => { stop(); setCardVisible(false); progress.setValue(0); };
    const native = AppState.addEventListener('change', state => { if (state !== 'active') cancel(); });
    const visibility = () => { if (document.hidden) cancel(); };
    if (Platform.OS === 'web') { window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', visibility); }
    return () => { stop(); native.remove(); if (Platform.OS === 'web') { window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', visibility); } };
  }, []);

  function draw() {
    if (!refereeReady || revealed || dealing || drawing.current) return;
    const ticket = ++generation.current;
    drawing.current = true;
    onDeal();
    setCardVisible(true);
    progress.setValue(0);
    Animated.sequence([
      Animated.timing(wobble, { toValue: -1, duration: reduced ? 0 : 90, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: 1, duration: reduced ? 0 : 110, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: 0, duration: reduced ? 0 : 130, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(reduced ? 0 : 130),
      Animated.timing(progress, { toValue: 1, duration: reduced ? 0 : 430, easing: Easing.out(Easing.back(1.15)), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished || ticket !== generation.current) return;
      drawing.current = false;
      callbacks.current.onReveal();
    });
  }
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => revealed && Math.abs(gesture.dy) > 12 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_, gesture) => { if (revealed) progress.setValue(1 - Math.max(0, Math.min(gesture.dy, 200)) / 260); },
    onPanResponderRelease: (_, gesture) => {
      if (revealed && gesture.dy > 45) callbacks.current.onHide();
      else Animated.spring(progress, { toValue: 1, useNativeDriver: true, speed: 25, bounciness: 3 }).start();
    },
    onPanResponderTerminate: () => Animated.spring(progress, { toValue: revealed ? 1 : 0, useNativeDriver: true }).start(),
  }), [revealed]);
  const accent = imposter ? '#D52B48' : C.yellow;
  return <View testID="secret-card" style={s.stage} {...pan.panHandlers}>
    <View style={s.spotlight} />
    <Animated.View style={[s.referee, { opacity: progress.interpolate({ inputRange: [0, 0.65, 1], outputRange: [1, 0.4, 0] }), transform: [{ rotate: wobble.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] }) }, { translateY: wobble.interpolate({ inputRange: [-1, 1], outputRange: [2, -3] }) }] }]} pointerEvents={revealed ? 'none' : 'auto'}>
      <MotionPressable accessibilityRole="button" accessibilityLabel={t.card} disabled={!refereeReady || dealing || revealed} onPress={draw} style={s.refereeButton}>
        <Image source={require('../assets/chibi/referee.png')} resizeMode="contain" onLoad={() => setRefereeReady(true)} style={s.refereeImage} />
      </MotionPressable>
    </Animated.View>
    {!revealed && !dealing && !cardVisible && <View pointerEvents="none" style={s.tapBadge}><Text style={s.tapText}>{!refereeReady ? (language === 'de' ? 'SCHIRI KOMMT …' : 'REFEREE LOADING …') : language === 'de' ? 'SCHIRI ANTIPPEN' : 'TAP THE REFEREE'}</Text><Text style={s.tapSub}>{language === 'de' ? 'Deine Karte wartet.' : 'Your card is waiting.'}</Text></View>}
    {cardVisible && <Animated.View testID="referee-card" style={[s.card, { backgroundColor: accent, opacity: progress.interpolate({ inputRange: [0, 0.09, 1], outputRange: [0, 1, 1] }), transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [55, 0] }) }, { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [70, 0] }) }, { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.04, 1] }) }, { rotate: progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: ['-25deg', '3deg', '0deg'] }) }] }]}>
      {revealed ? <View style={s.face}>
        <View style={s.cardHeader}><Text style={[s.cardBrand, imposter && s.white]}>FP</Text><Text style={[s.cardType, imposter && s.white]}>{imposter ? (language === 'de' ? 'ROTE KARTE' : 'RED CARD') : (language === 'de' ? 'GELBE KARTE' : 'YELLOW CARD')}</Text></View>
        <Avatar config={{ character: imposter ? 10 : mascotForName(secret) }} size={125} />
        <Text accessibilityLiveRegion="polite" style={[s.role, imposter && s.white]}>{imposter ? t.imposter : t.footballer}</Text>
        {!imposter && <Text testID="footballer-name" style={s.name}>{secret}</Text>}
        {imposter && hint && <View style={s.hintBox}><Text style={s.hintLabel}>{language === 'de' ? 'DEIN HINWEIS' : 'YOUR HINT'}</Text><Text testID="imposter-hint" style={s.hint}>{hint}</Text></View>}
        <Text style={[s.returnHint, imposter && s.white]}>{language === 'de' ? '↓ Zum Verdecken nach unten wischen' : '↓ Swipe down to cover'}</Text>
      </View> : <View style={s.cardBack}><Text style={s.backLetters}>FP</Text><Text style={s.backSub}>FOOTY PARTY</Text></View>}
    </Animated.View>}
  </View>;
}
const s = StyleSheet.create({
  stage: { height: 378, position: 'relative', alignItems: 'center', justifyContent: 'center', backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, borderRadius: 28, overflow: 'hidden', ...(Platform.OS === 'web' ? { userSelect: 'none', touchAction: 'none' } as object : {}) },
  spotlight: { position: 'absolute', width: 240, height: 240, borderRadius: 130, borderWidth: 1, borderColor: '#5592ff25', backgroundColor: '#5592ff08' },
  referee: { position: 'absolute', top: 12, bottom: 42, left: 0, right: 0 }, refereeButton: { flex: 1, alignItems: 'center', justifyContent: 'center' }, refereeImage: { width: 220, height: 330 },
  tapBadge: { position: 'absolute', bottom: 19, alignItems: 'center' }, tapText: { color: C.blue, fontSize: 11, fontWeight: '900', letterSpacing: 1.5 }, tapSub: { color: C.muted, fontSize: 11, marginTop: 5 },
  card: { position: 'absolute', left: 24, right: 24, top: 18, bottom: 18, borderRadius: 22, borderWidth: 2, borderColor: '#ffffff50', shadowColor: '#000', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.4, shadowRadius: 22, elevation: 10 },
  face: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 9 }, cardHeader: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }, cardBrand: { color: '#332407', fontWeight: '900', fontStyle: 'italic', fontSize: 24 }, cardType: { fontSize: 9, letterSpacing: 1.3, fontWeight: '900', color: '#332407' },
  role: { color: '#332407', fontWeight: '900', fontSize: 12, letterSpacing: 0.7, textAlign: 'center' }, white: { color: '#fff' }, name: { color: '#241a06', fontWeight: '900', fontSize: 27, lineHeight: 31, textAlign: 'center' },
  hintBox: { alignSelf: 'stretch', backgroundColor: '#080A1025', padding: 11, borderRadius: 12, gap: 5 }, hintLabel: { color: '#ffffffb0', fontSize: 9, fontWeight: '900', textAlign: 'center', letterSpacing: 1 }, hint: { color: '#fff', fontSize: 14, lineHeight: 18, textAlign: 'center', fontWeight: '600' }, returnHint: { color: '#332407aa', fontSize: 9, textAlign: 'center', marginTop: 3 },
  cardBack: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }, backLetters: { fontSize: 68, fontWeight: '900', fontStyle: 'italic', color: '#080A1060' }, backSub: { fontSize: 10, letterSpacing: 3, fontWeight: '800', color: '#080A1060' },
});
