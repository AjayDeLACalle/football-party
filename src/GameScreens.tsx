import React, { useEffect, useRef, useState } from 'react';
import { AppState, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ModeIcon } from './FootballArt';
import { advanceRound, BOMB_DURATION_MS, createImposterRound, remainingSeconds, selectQuestion } from './game';
import type { BombQuestion } from './catalog';
import { gameCopy } from './gameCopy';
import { copy } from './copy';
import type { Difficulty, Language } from './lobby';
import { useBombSound } from './useBombSound';
import { GoalCard } from './GoalCard';
import { Avatar } from './Avatar';
import type { PlayerProfile } from './profiles';

const C = { bg: '#0c1e16', panel: '#142b20', line: '#2b4835', ink: '#f2f4e5', muted: '#a6b4a3', lime: '#c4fa61', orange: '#ff9b61' };

function Action({ title, onPress, disabled = false, secondary = false }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{ disabled }} onPress={onPress} style={({ pressed }) => [s.action, secondary && s.secondary, disabled && { opacity: 0.35 }, pressed && { opacity: 0.75 }]}><Text style={[s.actionText, secondary && { color: C.ink }]}>{title}</Text></Pressable>;
}

export function ImposterGame({ players, profiles, imposters, hintsEnabled, difficulty, language, onExit, onFinished }: { players: string[]; profiles: PlayerProfile[]; hintsEnabled: boolean; imposters: number; difficulty: Difficulty; language: Language; onExit: () => void; onFinished: () => void }) {
  const [round, setRound] = useState(() => createImposterRound(players, imposters, difficulty, undefined, Math.random, hintsEnabled));
  const t = gameCopy[language];
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
    {round.phase === 'deal' ? <>
      <View style={s.topline}><Text style={s.eyebrow}>IMPOSTER</Text><Text style={s.progress}>{round.current + 1} / {round.players.length}</Text></View>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>{profiles[round.current] && <Avatar config={profiles[round.current].avatar} size={65} />}</View><Text style={s.muted}>{t.pass}</Text><Text accessibilityRole="header" style={s.player}>{round.players[round.current]}</Text><Text style={s.description}>{t.onlyYou}</Text>
      <GoalCard hint={round.hint?.[language]} key={round.current} revealed={round.revealed} secret={round.footballer} imposter={round.imposters.includes(round.current)} language={language} onReveal={() => dispatch('reveal')} onHide={() => dispatch('hide')} />
      <View style={s.hideSlot}>{round.revealed && <Action title={t.hide} onPress={() => dispatch('hide')} secondary />}</View>
      <Text style={s.cardHint}>{round.revealed ? t.hideFirst : round.hasSeen ? t.continue : t.swipeFirst}</Text>
      <Action title={t.next} disabled={!round.hasSeen || round.revealed} onPress={() => dispatch('next')} />
    </> : round.phase === 'discussion' ? <>
      <View style={s.centerIcon}><ModeIcon size={80} /></View><Text accessibilityRole="header" style={s.title}>{t.ready}</Text><Text style={s.discuss}>{t.discuss}</Text>
      <View style={s.spacer} /><Action title={t.unmask} onPress={() => dispatch('unmask')} />
    </> : <>
      <Text style={s.eyebrow}>IMPOSTER</Text><Text accessibilityRole="header" style={s.title}>{t.impostersWere}</Text>
      <View style={s.results}>{round.imposters.map((index) => <View key={index} style={s.result}><ModeIcon size={42} /><Text style={s.resultName}>{round.players[index]}</Text></View>)}</View>
      <Action title={t.again} onPress={() => setRound(createImposterRound(players, imposters, difficulty, round.footballer, Math.random, hintsEnabled))} /><View style={{ height: 12 }} /><Action title={t.back} onPress={onFinished} secondary />
    </>}
  </View>;
}

export function BombGame({ difficulty, language, onExit, onFinished }: { difficulty: Difficulty; language: Language; onExit: () => void; onFinished: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'finished'>('ready');
  const [question, setQuestion] = useState<BombQuestion | undefined>();
  const [seconds, setSeconds] = useState(60);
  const [starting, setStarting] = useState(false);
  const deadline = useRef(0);
  const sound = useBombSound();
  const t = gameCopy[language];

  async function start() {
    if (starting || phase === 'running') return;
    setStarting(true);
    if (!await sound.prepare()) { setStarting(false); return; }
    deadline.current = Date.now() + BOMB_DURATION_MS;
    setQuestion(selectQuestion(difficulty, question));
    setSeconds(60);
    sound.schedule(BOMB_DURATION_MS / 1000);
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
    <View style={s.topline}><Text style={[s.eyebrow, { color: C.orange }]}>{copy[language].bomb}</Text><Text style={s.progress}>{copy[language][difficulty]}</Text></View>
    {phase === 'ready' ? <>
      <View style={s.centerIcon}><ModeIcon bomb size={90} /></View><Text accessibilityRole="header" style={s.title}>{t.bombReady}</Text><Text style={s.discuss}>{t.bombIntro}</Text>
      <Text style={s.cardHint}>{t.soundHint}</Text><Action title={t.soundTest} onPress={() => { void sound.preview(); }} secondary />
      {sound.unavailable && <Text accessibilityRole="alert" style={s.soundError}>{t.soundError}</Text>}
      <View style={{ height: 14 }} /><Action title={starting ? t.loading : t.start} onPress={() => { void start(); }} disabled={starting} /><Text style={s.cardHint}>{t.soundRequired}</Text>
    </> : <>
      <Text accessibilityRole="header" style={s.question}>{question?.[language]}</Text>
      <View style={[s.timer, phase === 'finished' && { borderColor: C.orange, backgroundColor: '#402e23' }]}>
        <ModeIcon bomb size={65} /><Text accessibilityRole="timer" accessibilityLabel={t.time} testID="bomb-countdown" style={[s.timerText, seconds <= 10 && { color: C.orange }]}>{phase === 'finished' ? t.finished : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}</Text>
      </View>
      <Text style={s.bombHint}>{phase === 'finished' ? t.out : t.passBomb}</Text>
      {phase === 'running' && <><Text style={s.cardHint}>{t.soundHint}</Text><View style={s.progressTrack}><View style={[s.progressFill, { width: `${seconds / 60 * 100}%` }]} /></View></>}
      {phase === 'finished' && <><Action title={starting ? t.loading : t.again} onPress={() => { void start(); }} disabled={starting} /><View style={{ height: 12 }} /><Action title={t.back} onPress={onFinished} secondary />{sound.unavailable && <Text accessibilityRole="alert" style={s.soundError}>{t.soundError}</Text>}</>}
    </>}
  </View>;
}

const s = StyleSheet.create({
  game: { paddingTop: 8, paddingBottom: 25 }, exit: { alignSelf: 'flex-start', paddingVertical: 14, paddingRight: 20, marginBottom: 20 }, exitText: { fontSize: 13, color: C.muted, fontWeight: '600' },
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, eyebrow: { color: C.lime, letterSpacing: 2, fontSize: 11, fontWeight: '800' }, progress: { color: C.muted, fontSize: 12, fontWeight: '700' }, muted: { color: C.muted, fontSize: 14 }, player: { color: C.ink, fontSize: 35, fontWeight: '900', fontStyle: 'italic', marginTop: 8 }, description: { color: C.muted, fontSize: 13, marginTop: 8, marginBottom: 24 },
  hideSlot: { minHeight: 69, paddingTop: 12 }, cardHint: { color: C.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', marginVertical: 15 },
  action: { minHeight: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: C.lime, borderRadius: 16, padding: 17 }, actionText: { color: C.bg, fontSize: 15, fontWeight: '800', textAlign: 'center' }, secondary: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line },
  centerIcon: { alignItems: 'center', paddingVertical: 30 }, title: { fontSize: 36, lineHeight: 42, color: C.ink, fontWeight: '900', fontStyle: 'italic' }, discuss: { fontSize: 16, lineHeight: 25, color: C.muted, marginTop: 22, marginBottom: 28 }, spacer: { height: 65 }, results: { gap: 10, marginTop: 30, marginBottom: 30 }, result: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 18, borderWidth: 1, borderColor: C.line, borderRadius: 18, backgroundColor: C.panel }, resultName: { flex: 1, color: C.ink, fontSize: 24, fontWeight: '800' },
  question: { color: C.ink, fontSize: 27, fontWeight: '900', lineHeight: 35, marginTop: 15, marginBottom: 28 }, timer: { height: 240, borderRadius: 28, borderWidth: 2, borderColor: C.line, backgroundColor: C.panel, justifyContent: 'center', alignItems: 'center', gap: 15 }, timerText: { color: C.lime, fontSize: 58, fontWeight: '900', fontVariant: ['tabular-nums'] }, bombHint: { color: C.ink, fontSize: 17, fontWeight: '800', textAlign: 'center', marginVertical: 24 }, progressTrack: { height: 8, backgroundColor: C.panel, borderRadius: 5, overflow: 'hidden', marginTop: 12 }, progressFill: { height: '100%', backgroundColor: C.orange, borderRadius: 5 }, soundError: { color: C.orange, fontSize: 13, lineHeight: 20, marginVertical: 14 },
});
