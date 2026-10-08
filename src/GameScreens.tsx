import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, Platform, StyleSheet, Switch, Text, Vibration, View } from 'react-native';
import { ModeIcon } from './FootballArt';
import { advanceRound, BOMB_DURATION_MS, createImposterRound, remainingSeconds, selectQuestion, selectGroupStart } from './game';
import type { BombQuestion } from './catalog';
import { gameCopy } from './gameCopy';
import { copy } from './copy';
import type { Difficulty, Language } from './lobby';
import { useBombSound } from './useBombSound';
import { RefereeCard } from './RefereeCard';
import { Entrance, MotionPressable as Pressable, useReducedMotion } from './Motion';
import { colors as C } from './theme';
import { Avatar } from './Avatar';
import { GroupStart } from './GroupStart';
import type { PlayerProfile } from './profiles';

function Action({ title, onPress, disabled = false, secondary = false }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled }} onPress={onPress} style={({ pressed }) => [s.action, secondary && s.secondary, disabled && { opacity: 0.35 }, pressed && { opacity: 0.75 }]}><Text style={[s.actionText, secondary && { color: C.ink }]}>{title}</Text></Pressable>;
}

export function ImposterGame({ players, profiles, imposters, hintsEnabled, difficulty, language, onExit, onFinished, onResult }: { onResult: (kind: 'bomb' | 'imposter' | null) => void; players: string[]; profiles: PlayerProfile[]; hintsEnabled: boolean; imposters: number; difficulty: Difficulty; language: Language; onExit: () => void; onFinished: () => void }) {
  const [round, setRound] = useState(() => createImposterRound(players, imposters, difficulty, undefined, Math.random, hintsEnabled));
  const recent = useRef([round.footballer]);
  function replay() {
    const next = createImposterRound(players, imposters, difficulty, recent.current, Math.random, hintsEnabled);
    recent.current = [...recent.current.slice(-5), next.footballer];
    setRound(next);
  }
  const t = gameCopy[language];
  useEffect(() => { onResult(round.phase === 'result' ? 'imposter' : null); return () => onResult(null); }, [round.phase, onResult]);
  const dispatch = (action: Parameters<typeof advanceRound>[1]) => setRound((current) => advanceRound(current, action));

  useEffect(() => {
    const hide = () => setRound((current) => advanceRound(current, 'hide'));
    const subscription = AppState.addEventListener('change', (state) => { if (state !== 'active') hide(); });
    const onVisibility = () => { if (document.hidden) hide(); };
    if (Platform.OS === 'web') { document.addEventListener('visibilitychange', onVisibility); window.addEventListener('blur', hide); }
    return () => { subscription.remove(); if (Platform.OS === 'web') { document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('blur', hide); } };
  }, []);

  return <View style={s.game}>
    <Pressable accessibilityRole="button" onPress={onExit} style={s.exit}><Text style={s.exitText}>← {t.cancel}</Text></Pressable>
    <Entrance key={`${round.phase}-${round.current}`}>
    {round.phase === 'deal' ? <>
      <View style={s.topline}><Text style={s.eyebrow}>IMPOSTER</Text><Text style={s.progress}>{round.current + 1} / {round.players.length}</Text></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        {profiles[round.current] && <Avatar config={profiles[round.current].avatar} size={62} />}
        <View style={{ flex: 1 }}><Text style={s.muted}>{t.pass}</Text><Text accessibilityRole="header" style={s.player}>{round.players[round.current]}</Text><Text style={[s.description, { marginBottom: 0 }]}>{t.onlyYou}</Text></View>
      </View>
      <RefereeCard dealing={round.dealing} coverToken={round.coverToken} onDeal={() => dispatch('deal')} key={round.current} revealed={round.revealed} secret={round.footballer} imposter={round.imposters.includes(round.current)} language={language} onReveal={() => dispatch('reveal')} onHide={() => dispatch('hide')} />
      {round.revealed && round.imposters.includes(round.current) && round.hint && <View style={s.hintBox}><Text style={s.eyebrow}>{language === 'de' ? 'DEIN HINWEIS' : 'YOUR HINT'}</Text><Text testID="imposter-hint" style={s.hintText}>{round.hint[language]}</Text></View>}
      <View style={s.hideSlot}>{round.revealed && <Action title={t.hide} onPress={() => dispatch('hide')} secondary />}</View>
      <Text style={s.cardHint}>{round.revealed ? t.hideFirst : round.hasSeen ? t.continue : t.swipeFirst}</Text>
      <Action title={t.next} disabled={!round.hasSeen || round.revealed || round.dealing} onPress={() => dispatch('next')} />
    </> : round.phase === 'discussion' ? <>
      <View style={s.centerIcon}><ModeIcon size={80} /></View><Text accessibilityRole="header" style={s.title}>{t.ready}</Text><Text style={s.discuss}>{t.discuss}</Text>
      <GroupStart start={round.groupStart} profiles={profiles} language={language} /><View style={{ height: 20 }} /><Action title={t.unmask} onPress={() => dispatch('unmask')} />
    </> : <>
      <Text style={s.eyebrow}>IMPOSTER</Text><Text accessibilityRole="header" style={s.title}>{t.impostersWere}</Text>
      <View style={s.results}>{round.imposters.map((index) => <View key={index} style={s.result}><Avatar label={round.players[index]} config={profiles[index].avatar} size={68} /><Text style={s.resultName}>{round.players[index]}</Text></View>)}</View>
      <Action title={t.again} onPress={replay} /><View style={{ height: 12 }} /><Action title={t.back} onPress={onFinished} secondary />
    </>}
    </Entrance>
  </View>;
}

export function BombGame({ profiles, difficulty, language, onExit, onFinished, onResult }: { profiles: PlayerProfile[]; onResult: (kind: 'bomb' | 'imposter' | null) => void; difficulty: Difficulty; language: Language; onExit: () => void; onFinished: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'finished'>('ready');
  const [question, setQuestion] = useState<BombQuestion | undefined>();
  const [seconds, setSeconds] = useState(60);
  const [starting, setStarting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [groupStart, setGroupStart] = useState(() => selectGroupStart(profiles.length));
  const recent = useRef<BombQuestion[]>([]);
  const deadline = useRef(0);
  const pulse = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => { onResult(phase === 'finished' ? 'bomb' : null); return () => onResult(null); }, [phase, onResult]);
  useEffect(() => {
    if (phase !== 'running' || reduced) { pulse.setValue(0); return; }
    const animation = Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1, duration: seconds <= 10 ? 240 : 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }), Animated.timing(pulse, { toValue: 0, duration: seconds <= 10 ? 240 : 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true })]));
    animation.start(); return () => animation.stop();
  }, [phase, seconds <= 10, reduced, pulse]);
  const sound = useBombSound();
  const t = gameCopy[language];
  useEffect(() => {
    if (!audioEnabled) sound.stop();
  }, [audioEnabled]);
  useEffect(() => {
    if (phase !== 'finished' || !vibrationEnabled) return;
    if (Platform.OS === 'web') navigator.vibrate?.([150, 60, 250]);
    else Vibration.vibrate([0, 150, 60, 250]);
  }, [phase, vibrationEnabled]);

  async function start() {
    if (starting || phase === 'running') return;
    setStarting(true);
    if (audioEnabled && !await sound.prepare()) { setStarting(false); return; }
    if (phase === 'finished') setGroupStart(selectGroupStart(profiles.length));
    deadline.current = Date.now() + BOMB_DURATION_MS;
    const next = selectQuestion(difficulty, question, Math.random, recent.current);
    recent.current = [...recent.current.slice(-5), next];
    setQuestion(next);
    setSeconds(60);
    if (audioEnabled) sound.schedule(BOMB_DURATION_MS / 1000);
    setPhase('running');
    setStarting(false);
  }

  useEffect(() => {
    if (phase !== 'running') return;
    function update() {
      const remaining = remainingSeconds(deadline.current, Date.now());
      setSeconds(remaining);
      if (remaining === 0) setPhase('finished');
    }
    const interval = setInterval(update, 100);
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') update(); });
    if (Platform.OS === 'web') document.addEventListener('visibilitychange', update);
    return () => { clearInterval(interval); subscription.remove(); if (Platform.OS === 'web') document.removeEventListener('visibilitychange', update); };
  }, [phase]);

  return <View style={s.game}>
    <Pressable accessibilityRole="button" onPress={onExit} style={s.exit}><Text style={s.exitText}>← {t.cancel}</Text></Pressable>
    <View style={s.topline}><Text style={[s.eyebrow, { color: C.red }]}>{copy[language].bomb}</Text><Text style={s.progress}>{copy[language][difficulty]}</Text></View>
    <Entrance key={phase}>
    {phase === 'ready' ? <>
      <View style={s.centerIcon}><ModeIcon bomb size={90} /></View><Text accessibilityRole="header" style={s.title}>{t.bombReady}</Text><Text style={s.discuss}>{t.bombIntro}</Text>
      <GroupStart start={groupStart} profiles={profiles} language={language} />
      <View style={s.preference}><Text style={s.preferenceText}>{language === 'de' ? 'Explosionston' : 'Explosion sound'}</Text><Switch accessibilityLabel={language === 'de' ? 'Explosionston' : 'Explosion sound'} value={audioEnabled} onValueChange={setAudioEnabled} trackColor={{ false: C.line, true: '#284A87' }} thumbColor={audioEnabled ? C.blue : C.muted} /></View>
      <View style={s.preference}><Text style={s.preferenceText}>{language === 'de' ? 'Vibration' : 'Vibration'}</Text><Switch accessibilityLabel="Vibration" value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ false: C.line, true: '#284A87' }} thumbColor={vibrationEnabled ? C.blue : C.muted} /></View>
      <Text style={s.cardHint}>{language === 'de' ? 'Vibration wird auf unterstützten Geräten verwendet.' : 'Vibration is used on supported devices.'}</Text>
      {audioEnabled && <><Text style={s.cardHint}>{t.soundHint}</Text><Action title={t.soundTest} onPress={() => { void sound.preview(); }} secondary /></>}
      {audioEnabled && sound.unavailable && <Text accessibilityRole="alert" style={s.soundError}>{t.soundError}</Text>}
      <View style={{ height: 14 }} /><Action title={starting ? t.loading : t.start} onPress={() => { void start(); }} disabled={starting} /><Text style={s.cardHint}>{audioEnabled ? t.soundRequired : (language === 'de' ? 'Ihr spielt diese Runde ohne Ton.' : 'This round plays without sound.')}</Text>
    </> : <>
      <GroupStart start={groupStart} profiles={profiles} language={language} /><Text accessibilityRole="header" style={s.question}>{question?.[language]}</Text>
      <Animated.View style={[{ transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, seconds <= 10 ? 1.045 : 1.018] }) }] }, s.timer, phase === 'finished' && { borderColor: C.red, backgroundColor: '#35111f' }]}>
        <ModeIcon bomb size={65} /><Text accessibilityRole="timer" accessibilityLabel={t.time} testID="bomb-countdown" style={[s.timerText, seconds <= 10 && { color: C.red }]}>{phase === 'finished' ? t.finished : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}</Text>
      </Animated.View>
      <Text style={s.bombHint}>{phase === 'finished' ? t.out : t.passBomb}</Text>
      {phase === 'running' && <><Text style={s.cardHint}>{t.soundHint}</Text><View style={s.progressTrack}><View style={[s.progressFill, { width: `${seconds / 60 * 100}%` }]} /></View></>}
      {phase === 'finished' && <><Action title={starting ? t.loading : t.again} onPress={() => { void start(); }} disabled={starting} /><View style={{ height: 12 }} /><Action title={t.back} onPress={onFinished} secondary />{sound.unavailable && <Text accessibilityRole="alert" style={s.soundError}>{t.soundError}</Text>}</>}
    </>}
    </Entrance>
  </View>;
}

const s = StyleSheet.create({
  hintBox: { backgroundColor: '#35111f', borderWidth: 1, borderColor: '#6b2440', padding: 15, marginTop: 12, borderRadius: 16 }, hintText: { color: C.ink, fontSize: 14, lineHeight: 21 }, preference: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }, preferenceText: { color: C.ink, fontSize: 14, fontWeight: '600' },
  game: { paddingTop: 8, paddingBottom: 25 }, exit: { alignSelf: 'flex-start', paddingVertical: 14, paddingRight: 20, marginBottom: 20 }, exitText: { fontSize: 13, color: C.muted, fontWeight: '600' },
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, eyebrow: { color: C.blue, letterSpacing: 2, fontSize: 11, fontWeight: '800' }, progress: { color: C.muted, fontSize: 12, fontWeight: '700' }, muted: { color: C.muted, fontSize: 14 }, player: { color: C.ink, fontSize: 35, fontWeight: '900', fontStyle: 'italic', marginTop: 8 }, description: { color: C.muted, fontSize: 13, marginTop: 8, marginBottom: 24 },
  hideSlot: { minHeight: 69, paddingTop: 12 }, cardHint: { color: C.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', marginVertical: 15 },
  action: { minHeight: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: C.blue, borderRadius: 16, padding: 17 }, actionText: { color: C.bg, fontSize: 15, fontWeight: '800', textAlign: 'center' }, secondary: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line },
  centerIcon: { alignItems: 'center', paddingVertical: 30 }, title: { fontSize: 36, lineHeight: 42, color: C.ink, fontWeight: '900', fontStyle: 'italic' }, discuss: { fontSize: 16, lineHeight: 25, color: C.muted, marginTop: 22, marginBottom: 28 }, spacer: { height: 65 }, results: { gap: 10, marginTop: 30, marginBottom: 30 }, result: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 18, borderWidth: 1, borderColor: C.line, borderRadius: 18, backgroundColor: C.panel }, resultName: { flex: 1, color: C.ink, fontSize: 24, fontWeight: '800' },
  question: { color: C.ink, fontSize: 27, fontWeight: '900', lineHeight: 35, marginTop: 15, marginBottom: 28 }, timer: { height: 240, borderRadius: 28, borderWidth: 2, borderColor: C.line, backgroundColor: C.panel, justifyContent: 'center', alignItems: 'center', gap: 15 }, timerText: { color: C.blue, fontSize: 58, fontWeight: '900', fontVariant: ['tabular-nums'] }, bombHint: { color: C.ink, fontSize: 17, fontWeight: '800', textAlign: 'center', marginVertical: 24 }, progressTrack: { height: 8, backgroundColor: C.panel, borderRadius: 5, overflow: 'hidden', marginTop: 12 }, progressFill: { height: '100%', backgroundColor: C.red, borderRadius: 5 }, soundError: { color: C.red, fontSize: 13, lineHeight: 20, marginVertical: 14 },
});
