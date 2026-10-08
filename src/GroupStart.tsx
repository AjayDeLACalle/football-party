import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import type { GroupStart as Start } from './game';
import type { Language } from './lobby';
import type { PlayerProfile } from './profiles';
import { colors as C } from './theme';

export function GroupStart({ start, profiles, language }: { start: Start; profiles: PlayerProfile[]; language: Language }) {
  const player = profiles[start.playerIndex];
  return <View testID="group-start" style={s.box}>
    <Avatar config={player.avatar} size={48} />
    <View style={{ flex: 1 }}><Text style={s.label}>{language === 'de' ? 'STARTET DIE RUNDE' : 'STARTS THE ROUND'}</Text><Text testID="starting-player" style={s.name}>{player.name}</Text><Text testID="play-direction" style={s.direction}>{start.clockwise ? '↻ ' : '↺ '}{language === 'de' ? (start.clockwise ? 'Im Uhrzeigersinn' : 'Gegen den Uhrzeigersinn') : (start.clockwise ? 'Clockwise' : 'Counterclockwise')}</Text></View>
  </View>;
}
const s = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: C.panelLight, borderWidth: 1, borderColor: '#33486A', borderRadius: 18, marginVertical: 16 }, label: { fontSize: 9, letterSpacing: 1.2, color: C.blue, fontWeight: '800' }, name: { color: C.ink, fontSize: 22, fontWeight: '800', marginVertical: 5 }, direction: { color: C.muted, fontSize: 12, lineHeight: 18 },
});
