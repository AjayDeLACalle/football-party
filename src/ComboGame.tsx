import React, { useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, Text, View } from 'react-native';
import { nationFlag, nationLabel, selectCombination } from './combinations';
import { positionLabel } from './footballFacts';
import type { Language } from './lobby';
import { Entrance, MotionPressable as Pressable } from './Motion';
import { ModeArt } from './FootballArt';
import { COMBO_REVEAL_MS, comboRevealStep } from './comboReveal';
import { colors as C } from './theme';
export const comboCopy = {
  de: { name: 'DREIERKETTE', tag: 'NATION · POSITION · LIGA', description: 'Drei Vorgaben. Nennt passende Fußballer. Wem zuletzt etwas einfällt, verliert.', start: 'Kombination ziehen', title: 'DREI INFOS.\nEIN SPIELER.', intro: 'Der Host liest die drei Vorgaben vor. Alle nennen passende Fußballer oder Legenden.', league: 'Liga', nation: 'Nation', position: 'Position', next: 'Neue Kombination', menu: 'Zum Menü', rules: 'Auch frühere Vereine zählen. Die Position muss der Spieler regelmäßig gespielt haben – ein einzelner Einsatz reicht nicht. Es zählt seine Fußball-Nationalität. Wer zuletzt antwortet oder keinen Spieler weiß, verliert. Ihr entscheidet gemeinsam.', note: 'Keine Namen auf dem Bildschirm. Euer Wissen entscheidet.', begin: 'Spiel starten', drawing: 'Kombination wird aufgedeckt …', ready: 'In drei Sekunden erscheinen Nation, Position und Liga. Danach spielt ihr direkt los.' },
  en: { name: 'TRIPLE THREAT', tag: 'NATION · POSITION · LEAGUE', description: 'Three conditions. Name matching footballers. The last to answer loses.', start: 'Draw a combination', title: 'THREE CLUES.\nONE PLAYER.', intro: 'The host reads the three conditions aloud. Everyone names matching footballers or legends.', league: 'League', nation: 'Nation', position: 'Position', next: 'New combination', menu: 'Back to menu', rules: 'Former clubs count too. The player must have played the position regularly – one appearance is not enough. Use his football nationality. Whoever answers last or cannot think of a player loses. Your group decides.', note: 'No player names on screen. Let your knowledge decide.', begin: 'Start game', drawing: 'Revealing the combination …', ready: 'Nation, position and league appear over three seconds. Then start playing together.' },
};
export function ComboGame({ language, onExit }: { language: Language; onExit: () => void }) {
  const [combination, setCombination] = useState(() => selectCombination());
  const [phase, setPhase] = useState<'ready' | 'revealing' | 'revealed'>('ready');
  const [step, setStep] = useState(0);
  const deadline = useRef(0);
  const drawing = useRef(false);
  const t = comboCopy[language];
  function begin(next = false) {
    if (drawing.current) return;
    drawing.current = true;
    if (next) setCombination(current => selectCombination(current));
    deadline.current = Date.now() + COMBO_REVEAL_MS;
    setStep(1);
    setPhase('revealing');
  }
  useEffect(() => {
    if (phase !== 'revealing') return;
    const update = () => {
      const elapsed = COMBO_REVEAL_MS - (deadline.current - Date.now());
      setStep(comboRevealStep(elapsed));
      if (elapsed >= COMBO_REVEAL_MS) { drawing.current = false; setPhase('revealed'); }
    };
    const timer = setInterval(update, 40);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') update(); });
    if (Platform.OS === 'web') document.addEventListener('visibilitychange', update);
    return () => { clearInterval(timer); sub.remove(); if (Platform.OS === 'web') document.removeEventListener('visibilitychange', update); };
  }, [phase, combination.id]);
  const rows = [
    { id: 'nation', label: t.nation, value: nationLabel(combination.nation, language), symbol: nationFlag(combination.nation) },
    { id: 'position', label: t.position, value: positionLabel(combination.position, language), symbol: '◎' },
    { id: 'league', label: t.league, value: combination.league, symbol: '◈' },
  ];
  return <View style={s.screen}>
    <Text style={s.eyebrow}>{t.name}</Text><Text accessibilityRole="header" style={s.title}>{t.title}</Text><Text style={s.intro}>{t.intro}</Text>
    {phase === 'ready' ? <><ModeArt mode="combo" height={200} /><Text style={s.ready}>{t.ready}</Text><Pressable accessibilityRole="button" onPress={() => begin()} style={s.primary}><Text style={s.primaryText}>{t.begin}</Text></Pressable></> : <>
      <View testID="combination" style={s.ticket}>
        {rows.map((row, index) => <View key={row.id} style={[s.row, index === 2 && { borderBottomWidth: 0 }]}><Text style={s.number}>0{index + 1}</Text><View style={s.value}><Text style={s.label}>{row.label}</Text>{step > index ? <Entrance key={`${combination.id}-${row.id}`}><Text testID={`combo-${row.id}`} style={s.condition}>{row.value}</Text></Entrance> : <Text accessibilityLabel={language === 'de' ? 'Noch verdeckt' : 'Not revealed yet'} style={s.hidden}>•••</Text>}</View>{step > index && <Entrance><Text style={s.symbol}>{row.symbol}</Text></Entrance>}</View>)}
      </View>
      <Text testID="combo-status" accessibilityLiveRegion="polite" style={s.status}>{phase === 'revealing' ? t.drawing : t.note}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={t.next} disabled={phase === 'revealing'} onPress={() => begin(true)} style={[s.primary, phase === 'revealing' && { opacity: 0.35 }]}><Text style={s.primaryText}>{t.next} ↻</Text></Pressable>
    </>}
    <Text style={s.rules}>{t.rules}</Text>
    <Pressable accessibilityRole="button" onPress={onExit} style={s.secondary}><Text style={s.secondaryText}>{t.menu}</Text></Pressable>
  </View>;
}
const s = StyleSheet.create({
  screen: { paddingVertical: 24 }, eyebrow: { color: C.blue, fontWeight: '800', fontSize: 11, letterSpacing: 2, marginBottom: 18 }, title: { color: C.ink, fontSize: 36, lineHeight: 40, fontWeight: '900', fontStyle: 'italic' }, intro: { color: C.muted, lineHeight: 23, fontSize: 14, marginTop: 17, marginBottom: 26 }, ready: { color: C.muted, fontSize: 13, lineHeight: 21, marginVertical: 20 },
  ticket: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, paddingHorizontal: 20, borderRadius: 24 }, row: { flexDirection: 'row', alignItems: 'center', gap: 14, height: 110, borderBottomWidth: 1, borderColor: C.line }, number: { color: '#626F89', fontWeight: '900', fontSize: 13 }, value: { flex: 1 }, label: { color: C.blue, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700', marginBottom: 9 }, condition: { color: C.ink, fontSize: 22, lineHeight: 28, fontWeight: '800' }, hidden: { color: '#536078', fontSize: 22, lineHeight: 28, letterSpacing: 5 }, symbol: { color: C.blue, fontSize: 26 }, status: { color: C.muted, lineHeight: 20, fontSize: 12, marginVertical: 18, textAlign: 'center' },
  rules: { color: C.muted, fontSize: 13, lineHeight: 22, marginVertical: 22 }, primary: { backgroundColor: C.blue, padding: 18, minHeight: 58, borderRadius: 16, alignItems: 'center' }, primaryText: { color: C.bg, fontWeight: '800', fontSize: 15 }, secondary: { padding: 18, borderRadius: 16, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, alignItems: 'center' }, secondaryText: { color: C.ink, fontWeight: '700', fontSize: 14 },
});
