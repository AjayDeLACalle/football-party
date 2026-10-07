import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { nationFlag, nationLabel, selectCombination } from './combinations';
import { positionLabel } from './footballFacts';
import type { Language } from './lobby';
export const comboCopy = {
  de: { name: 'DREIERKETTE', tag: 'LIGA · NATION · POSITION', description: 'Drei Vorgaben. Nennt passende Fußballer. Wem zuletzt etwas einfällt, verliert.', start: 'Kombination ziehen', title: 'DREI INFOS.\nEIN SPIELER.', intro: 'Der Host liest nur diese drei Vorgaben vor. Alle nennen passende Fußballer oder Legenden.', league: 'Liga', nation: 'Nation', position: 'Position', next: 'Neue Kombination', menu: 'Zum Menü', rules: 'Auch frühere Vereine zählen. Die Position muss der Spieler regelmäßig gespielt haben – ein einzelner Einsatz reicht nicht. Es zählt seine Fußball-Nationalität. Wer zuletzt antwortet oder keinen Spieler weiß, verliert. Ihr entscheidet gemeinsam.', note: 'Keine Namen auf dem Bildschirm. Euer Wissen entscheidet.' },
  en: { name: 'TRIPLE THREAT', tag: 'LEAGUE · NATION · POSITION', description: 'Three conditions. Name matching footballers. The last to answer loses.', start: 'Draw a combination', title: 'THREE CLUES.\nONE PLAYER.', intro: 'The host reads only these three conditions aloud. Everyone names matching footballers or legends.', league: 'League', nation: 'Nation', position: 'Position', next: 'New combination', menu: 'Back to menu', rules: 'Former clubs count too. The player must have played the position regularly – one appearance is not enough. Use his football nationality. Whoever answers last or cannot think of a player loses. Your group decides.', note: 'No player names on screen. Let your knowledge decide.' },
};
export function ComboGame({ language, onExit }: { language: Language; onExit: () => void }) {
  const [combination, setCombination] = useState(() => selectCombination());
  const t = comboCopy[language];
  return <View style={s.screen}>
    <Text style={s.eyebrow}>{t.name}</Text><Text accessibilityRole="header" style={s.title}>{t.title}</Text><Text style={s.intro}>{t.intro}</Text>
    <View testID="combination" style={s.ticket}>
      <View style={s.row}><Text style={s.number}>01</Text><View style={s.value}><Text style={s.label}>{t.league}</Text><Text testID="combo-league" style={s.condition}>{combination.league}</Text></View><Text style={s.symbol}>◈</Text></View>
      <View style={s.row}><Text style={s.number}>02</Text><View style={s.value}><Text style={s.label}>{t.nation}</Text><Text testID="combo-nation" style={s.condition}>{nationLabel(combination.nation, language)}</Text></View><Text style={s.flag}>{nationFlag(combination.nation)}</Text></View>
      <View style={[s.row, { borderBottomWidth: 0 }]}><Text style={s.number}>03</Text><View style={s.value}><Text style={s.label}>{t.position}</Text><Text testID="combo-position" style={s.condition}>{positionLabel(combination.position, language)}</Text></View></View>
    </View>
    <Text style={s.rules}>{t.rules}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={t.next} onPress={() => setCombination(current => selectCombination(current))} style={s.primary}><Text style={s.primaryText}>{t.next} ↻</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={onExit} style={s.secondary}><Text style={s.secondaryText}>{t.menu}</Text></Pressable>
  </View>;
}
const s = StyleSheet.create({
  screen: { paddingVertical: 24 }, eyebrow: { color: '#94ccff', fontWeight: '800', fontSize: 11, letterSpacing: 2, marginBottom: 18 }, title: { color: '#f2f4e5', fontSize: 36, lineHeight: 40, fontWeight: '900', fontStyle: 'italic' }, intro: { color: '#a6b4a3', lineHeight: 23, fontSize: 14, marginTop: 17, marginBottom: 26 },
  ticket: { backgroundColor: '#172e35', borderWidth: 1, borderColor: '#37535e', paddingHorizontal: 20, borderRadius: 24 }, row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 23, borderBottomWidth: 1, borderColor: '#37535e' }, number: { color: '#688b9d', fontWeight: '900', fontSize: 13 }, value: { flex: 1 }, label: { color: '#94ccff', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700', marginBottom: 9 }, condition: { color: '#f2f4e5', fontSize: 22, lineHeight: 28, fontWeight: '800' }, flag: { fontSize: 27 }, symbol: { color: '#94ccff', fontSize: 35 },
  rules: { color: '#a6b4a3', fontSize: 13, lineHeight: 22, marginVertical: 25 }, primary: { backgroundColor: '#94ccff', padding: 18, minHeight: 58, borderRadius: 16, alignItems: 'center' }, primaryText: { color: '#0c1e16', fontWeight: '800', fontSize: 15 }, secondary: { marginTop: 13, padding: 18, borderRadius: 16, backgroundColor: '#142b20', borderWidth: 1, borderColor: '#2b4835', alignItems: 'center' }, secondaryText: { color: '#f2f4e5', fontWeight: '700', fontSize: 14 },
});
