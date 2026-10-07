import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowIcon, FootballArt, ModeIcon } from './src/FootballArt';
import { copy } from './src/copy';
import { gameCopy } from './src/gameCopy';
import { BombGame, ImposterGame } from './src/GameScreens';
import { Difficulty, Language, MAX_PLAYERS, MIN_PLAYERS, Mode, maxImposters, validateName } from './src/lobby';

const C = { bg: '#0c1e16', panel: '#142b20', panelLight: '#1d382a', line: '#2b4835', ink: '#f2f4e5', muted: '#a6b4a3', lime: '#c4fa61', orange: '#ff9b61' };
type Screen = 'home' | 'lobby' | 'lineup' | 'game';

function Button({ title, onPress, disabled = false, secondary = false }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondaryButton, disabled && s.disabled, pressed && s.pressed]}>
    <Text style={[s.buttonText, secondary && { color: C.ink }]}>{title}</Text>
    <ArrowIcon color={secondary ? C.ink : C.bg} />
  </Pressable>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>('de');
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode>('imposter');
  const [players, setPlayers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<'empty' | 'duplicate' | 'full' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [imposters, setImposters] = useState(1);
  const [confirmExit, setConfirmExit] = useState(false);
  const t = copy[language];
  const g = gameCopy[language];
  const currentImposters = Math.min(imposters, maxImposters(players.length));
  const levelHint = mode === 'imposter' ? { easy: t.easyHint, medium: t.mediumHint, hard: t.hardHint }[difficulty] : { easy: g.bombEasy, medium: g.bombMedium, hard: g.bombHard }[difficulty];

  function addPlayer() {
    const validation = validateName(name, players);
    setError(validation);
    if (validation) return;
    setPlayers((current) => [...current, name.trim()]);
    setName('');
  }

  function removePlayer(index: number) {
    const next = players.filter((_, i) => i !== index);
    setPlayers(next);
    setImposters((current) => Math.min(current, maxImposters(next.length)));
    setError(null);
  }

  function navigate(next: Screen) {
    setError(null);
    setName('');
    setScreen(next);
  }

  return <SafeAreaProvider>
    <StatusBar style="light" />
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={s.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView key={screen} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.shell}>
            <View style={s.header}>
              <Pressable accessibilityRole="button" accessibilityLabel={t.home} onPress={() => screen === 'game' ? setConfirmExit(true) : navigate('home')} style={s.brand}>
                <View style={s.brandMark}><Text style={s.brandMarkText}>FP</Text></View>
                <Text style={s.brandText}>FOOTBALL{ '\n' }PARTY<Text style={{ color: C.lime }}>.</Text></Text>
              </Pressable>
              <View accessibilityLabel={t.language} style={s.languageSwitch}>
                {(['de', 'en'] as Language[]).map((lang) => <Pressable key={lang} accessibilityRole="button" accessibilityLabel={lang === 'de' ? 'Deutsch' : 'English'} accessibilityState={{ selected: language === lang }} onPress={() => setLanguage(lang)} style={[s.languageButton, language === lang && s.languageActive]}>
                  <Text style={[s.languageText, language === lang && { color: C.bg }]}>{lang.toUpperCase()}</Text>
                </Pressable>)}
              </View>
            </View>

            {screen === 'game' ? (mode === 'imposter' ? <ImposterGame players={players} imposters={currentImposters} difficulty={difficulty} language={language} onExit={() => setConfirmExit(true)} onFinished={() => navigate('lobby')} /> : <BombGame difficulty={difficulty} language={language} onExit={() => setConfirmExit(true)} onFinished={() => navigate('lobby')} />) : screen === 'home' ? <>
              <View style={s.hero}>
                <Text style={s.eyebrow}>{t.eyebrow}</Text>
                <Text accessibilityRole="header" style={s.heroTitle}>{t.title}</Text>
                <Text style={s.intro}>{t.intro}</Text>
                <FootballArt label={t.footballArt} />
                <View style={s.metaRow}><Text style={s.meta}>●  {t.players}</Text><Text style={s.meta}>↔  {t.onePhone}</Text></View>
              </View>
              <Text accessibilityRole="header" style={s.sectionTitle}>{t.choose}</Text>
              {(['imposter', 'bomb'] as Mode[]).map((game, index) => <Pressable key={game} accessibilityRole="button" accessibilityLabel={`${game === 'imposter' ? t.imposter : t.bomb}: ${t.start}`} onPress={() => { setMode(game); navigate('lobby'); }} style={({ pressed }) => [s.modeCard, game === 'bomb' && s.bombCard, pressed && s.pressed]}>
                <View style={s.modeTop}><View style={[s.iconBox, game === 'bomb' && { backgroundColor: '#513428' }]}><ModeIcon bomb={game === 'bomb'} /></View><Text style={[s.modeIndex, game === 'bomb' && { color: C.orange }]}>0{index + 1}</Text></View>
                <Text style={[s.modeTag, game === 'bomb' && { color: C.orange }]}>{game === 'imposter' ? t.bluff : t.speed}</Text>
                <Text style={s.modeName}>{game === 'imposter' ? t.imposter : t.bomb}</Text>
                <Text style={s.modeDescription}>{game === 'imposter' ? t.imposterDescription : t.bombDescription}</Text>
                <View style={s.cardFooter}><Text style={[s.cardAction, game === 'bomb' && { color: C.orange }]}>{t.start}</Text><ArrowIcon color={game === 'bomb' ? C.orange : C.lime} /></View>
              </Pressable>)}
              <Text style={s.footer}>FOOTBALL PARTY · {t.onePhone.toUpperCase()}</Text>
            </> : <>
              <Pressable accessibilityRole="button" onPress={() => navigate(screen === 'lineup' ? 'lobby' : 'home')} style={s.back}><Text style={s.backText}>←  {t.back}</Text></Pressable>
              <View style={s.lobbyTitleRow}><View style={{ flex: 1 }}><Text style={s.eyebrow}>{mode === 'imposter' ? t.imposter : t.bomb} / {t.singleRound.toUpperCase()}</Text><Text accessibilityRole="header" style={s.pageTitle}>{screen === 'lineup' ? t.lineup : t.team}</Text></View><ModeIcon bomb={mode === 'bomb'} size={54} /></View>
              <Text style={s.pageIntro}>{screen === 'lineup' ? t.lineupHint : t.teamIntro}</Text>

              {screen === 'lobby' ? <>
                <View style={s.inputRow}>
                  <TextInput accessibilityLabel={t.name} placeholder={t.namePlaceholder} placeholderTextColor={C.muted} value={name} onChangeText={(value) => { setName(value); setError(null); }} maxLength={20} autoCapitalize="words" autoCorrect={false} returnKeyType="done" onSubmitEditing={addPlayer} editable={players.length < MAX_PLAYERS} style={s.input} />
                  <Pressable accessibilityRole="button" accessibilityLabel={t.add} accessibilityState={{ disabled: players.length >= MAX_PLAYERS }} disabled={players.length >= MAX_PLAYERS} onPress={addPlayer} style={({ pressed }) => [s.addButton, players.length >= MAX_PLAYERS && s.disabled, pressed && s.pressed]}><Text style={s.plus}>+</Text></Pressable>
                </View>
                {error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.error}>{t[error]}</Text>}
                <View style={s.teamHeader}><Text style={s.sectionTitle}>{t.team}</Text><Text style={s.counter}>{players.length} / {MAX_PLAYERS}</Text></View>
                {players.length === 0 && <View style={s.emptyTeam}><Text style={s.emptyNumber}>01</Text><View style={s.fill}><Text style={s.emptyTitle}>{t.emptyTeam}</Text><Text style={s.emptyHint}>{t.emptyTeamHint}</Text></View></View>}
                {players.map((player, index) => <View key={player} style={s.playerRow}><View style={[s.avatar, { backgroundColor: index % 2 === 0 ? C.lime : C.orange }]}><Text style={s.avatarText}>{player.slice(0, 1).toUpperCase()}</Text></View><Text style={s.playerName}>{player}</Text><Text style={s.playerIndex}>{String(index + 1).padStart(2, '0')}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${player}: ${t.remove}`} onPress={() => removePlayer(index)} hitSlop={8} style={s.remove}><Text style={s.removeText}>×</Text></Pressable></View>)}

                  <Text accessibilityRole="header" style={[s.sectionTitle, s.settingsTitle]}>{t.difficulty}</Text>
                  <View style={s.segmentRow}>{(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => <Pressable key={level} accessibilityRole="button" accessibilityState={{ selected: difficulty === level }} onPress={() => setDifficulty(level)} style={[s.segment, difficulty === level && s.segmentActive]}><Text style={[s.segmentText, difficulty === level && { color: C.bg }]}>{t[level]}</Text></Pressable>)}</View>
                  <Text style={s.settingHint}>{levelHint}</Text>
                {mode === 'imposter' ? <>
                  <View style={s.legendBadge}><Text style={s.legendText}>✦  {t.legends}</Text></View>
                  <Text accessibilityRole="header" style={[s.sectionTitle, s.settingsTitle]}>{t.imposters}</Text>
                  <View style={s.segmentRow}>{[1, 2, 3].map((count) => <Pressable key={count} accessibilityRole="button" accessibilityLabel={`${count} ${t.imposters.toLowerCase()}`} accessibilityState={{ selected: currentImposters === count, disabled: count > maxImposters(players.length) }} disabled={count > maxImposters(players.length)} onPress={() => setImposters(count)} style={[s.segment, currentImposters === count && s.segmentActive, count > maxImposters(players.length) && s.disabled]}><Text style={[s.segmentText, currentImposters === count && { color: C.bg }]}>{count}</Text></Pressable>)}</View>
                  <Text style={s.settingHint}>{t.impostersHint} {t.oneKnows}</Text>
                </> : <View style={s.rulesBox}><Text style={s.rulesTitle}>{t.rules}</Text><Text style={s.rulesCopy}>{t.bombHint}</Text></View>}
                <View style={s.bottomAction}><Button title={t.review} disabled={players.length < MIN_PLAYERS} onPress={() => navigate('lineup')} /><Text style={s.actionHint}>{t.needPlayers}</Text></View>
              </> : <>
                <View style={s.lineupCard}><View style={s.lineupHeading}><Text style={s.sectionTitle}>{t.team}</Text><Text style={s.counter}>{players.length}</Text></View><View style={s.chips}>{players.map((player, index) => <View key={player} style={s.chip}><Text style={s.chipNumber}>{String(index + 1).padStart(2, '0')}</Text><Text style={s.chipName}>{player}</Text></View>)}</View><View style={s.summaryRow}><Text style={s.summaryLabel}>{t.mode}</Text><Text style={s.summaryValue}>{mode === 'imposter' ? t.imposter : t.bomb}</Text></View><View style={s.summaryRow}><Text style={s.summaryLabel}>{t.level}</Text><Text style={s.summaryValue}>{t[difficulty]}</Text></View>{mode === 'imposter' && <View style={s.summaryRow}><Text style={s.summaryLabel}>{t.imposters}</Text><Text style={s.summaryValue}>{currentImposters} · {t.noHint}</Text></View>}</View>
                <View style={s.rulesBox}><Text style={s.rulesTitle}>{t.rules}</Text><Text style={s.rulesCopy}>{mode === 'imposter' ? t.imposterRules : t.bombRules}</Text></View>
                <View style={s.bottomAction}><Button title={g.start} onPress={() => navigate('game')} /><View style={{ height: 12 }} /><Button title={t.edit} secondary onPress={() => navigate('lobby')} /></View>
              </>}
            </>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={confirmExit} transparent animationType="fade" onRequestClose={() => setConfirmExit(false)}>
        <View style={s.modalOverlay}><View accessibilityViewIsModal style={s.modalCard}><Text accessibilityRole="header" style={s.modalTitle}>{g.cancelTitle}</Text><Text style={s.pageIntro}>{g.cancelHint}</Text><Button title={g.cancelNo} onPress={() => setConfirmExit(false)} /><View style={{ height: 12 }} /><Button title={g.cancelYes} secondary onPress={() => { setConfirmExit(false); navigate('lobby'); }} /></View></View>
      </Modal>
    </SafeAreaView>
  </SafeAreaProvider>;
}

const s = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: '#000000bb', alignItems: 'center', justifyContent: 'center', padding: 22 }, modalCard: { width: '100%', maxWidth: 450, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, padding: 24, borderRadius: 24 }, modalTitle: { color: C.ink, fontSize: 24, fontWeight: '900' },
  fill: { flex: 1 }, safe: { flex: 1, backgroundColor: C.bg }, scroll: { flexGrow: 1, paddingBottom: 30 },
  shell: { width: '100%', maxWidth: 500, alignSelf: 'center', paddingHorizontal: 22 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 22 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandMark: { backgroundColor: C.lime, borderRadius: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }] }, brandMarkText: { fontSize: 19, fontWeight: '900', color: C.bg, fontStyle: 'italic' }, brandText: { color: C.ink, fontSize: 13, lineHeight: 14, fontWeight: '900', letterSpacing: 0.8 },
  languageSwitch: { flexDirection: 'row', padding: 4, backgroundColor: C.panel, borderRadius: 25, borderWidth: 1, borderColor: C.line }, languageButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20 }, languageActive: { backgroundColor: C.lime }, languageText: { fontWeight: '800', fontSize: 11, color: C.muted },
  hero: { paddingTop: 22 }, eyebrow: { color: C.lime, fontWeight: '800', fontSize: 10, letterSpacing: 2, marginBottom: 12 }, heroTitle: { color: C.ink, fontWeight: '900', fontSize: 48, lineHeight: 49, letterSpacing: -1.5, fontStyle: 'italic' }, intro: { color: C.muted, fontSize: 15, lineHeight: 23, marginTop: 16, marginBottom: 13, maxWidth: 350 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', paddingTop: 8, paddingBottom: 28 }, meta: { color: C.muted, fontSize: 11, fontWeight: '600' },
  sectionTitle: { color: C.ink, fontSize: 11, letterSpacing: 1.8, fontWeight: '800', marginBottom: 14 },
  modeCard: { backgroundColor: C.panel, padding: 23, borderRadius: 24, borderWidth: 1, borderColor: C.line, marginBottom: 15 }, bombCard: { backgroundColor: '#302b20', borderColor: '#51432f' }, modeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }, iconBox: { backgroundColor: C.panelLight, borderRadius: 17, width: 62, height: 62, alignItems: 'center', justifyContent: 'center' }, modeIndex: { color: C.lime, opacity: 0.5, fontSize: 31, fontWeight: '900', fontStyle: 'italic' }, modeTag: { color: C.lime, fontSize: 9, letterSpacing: 1.4, fontWeight: '800', marginBottom: 7 }, modeName: { color: C.ink, fontSize: 32, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 }, modeDescription: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 320 }, cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, borderTopWidth: 1, borderTopColor: '#ffffff12', paddingTop: 15 }, cardAction: { fontSize: 13, fontWeight: '800', color: C.lime }, cardArrow: { fontSize: 24, color: C.lime }, footer: { textAlign: 'center', fontWeight: '700', color: '#6e826e', fontSize: 9, letterSpacing: 1.1, paddingTop: 15 },
  back: { alignSelf: 'flex-start', paddingVertical: 12, paddingRight: 20, marginBottom: 15 }, backText: { color: C.muted, fontSize: 13, fontWeight: '600' }, lobbyTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 15 }, pageTitle: { color: C.ink, fontSize: 34, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 }, pageIntro: { color: C.muted, fontSize: 14, lineHeight: 22, marginTop: 12, marginBottom: 24 },
  inputRow: { flexDirection: 'row', gap: 10 }, input: { minWidth: 0, flex: 1, color: C.ink, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16 }, addButton: { width: 56, minHeight: 56, borderRadius: 15, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' }, plus: { color: C.bg, fontSize: 29, fontWeight: '500' }, error: { color: C.orange, fontSize: 13, marginTop: 10 },
  teamHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }, counter: { color: C.lime, fontSize: 12, fontWeight: '800', marginBottom: 14 }, emptyTeam: { flexDirection: 'row', alignItems: 'center', padding: 20, borderWidth: 1, borderColor: C.line, borderStyle: 'dashed', borderRadius: 16, gap: 16 }, emptyNumber: { color: '#58735a', fontSize: 28, fontWeight: '900' }, emptyTitle: { color: C.muted, fontSize: 13, fontWeight: '700' }, emptyHint: { color: '#70866f', fontSize: 12, marginTop: 5 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: C.panel, padding: 12, marginBottom: 8 }, avatar: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, avatarText: { fontWeight: '900', color: C.bg, fontSize: 17 }, playerName: { flex: 1, color: C.ink, fontSize: 15, fontWeight: '600' }, playerIndex: { color: '#6e826e', fontWeight: '700', fontSize: 12 }, remove: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }, removeText: { color: C.muted, fontSize: 24 },
  settingsTitle: { marginTop: 27 }, segmentRow: { flexDirection: 'row', gap: 8 }, segment: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, alignItems: 'center' }, segmentActive: { backgroundColor: C.lime, borderColor: C.lime }, segmentText: { fontSize: 14, fontWeight: '800', color: C.muted }, settingHint: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 12 }, legendBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 7, marginTop: 12, backgroundColor: C.panel, borderRadius: 8 }, legendText: { color: C.lime, fontSize: 8, letterSpacing: 1, fontWeight: '800' },
  bottomAction: { marginTop: 30, paddingBottom: 12 }, button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.lime, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, minHeight: 58 }, secondaryButton: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line }, buttonText: { color: C.bg, fontSize: 15, fontWeight: '800', flexShrink: 1 }, buttonArrow: { fontSize: 23, color: C.bg }, disabled: { opacity: 0.35 }, pressed: { opacity: 0.75 }, actionHint: { textAlign: 'center', color: C.muted, fontSize: 11, paddingTop: 12 },
  rulesBox: { backgroundColor: C.panel, borderRadius: 18, padding: 20, marginTop: 25, borderWidth: 1, borderColor: C.line }, rulesTitle: { color: C.ink, fontSize: 14, fontWeight: '800', marginBottom: 8 }, rulesCopy: { color: C.muted, fontSize: 13, lineHeight: 22 },
  lineupCard: { backgroundColor: C.panel, borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 20 }, lineupHeading: { flexDirection: 'row', justifyContent: 'space-between' }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 23 }, chip: { maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.panelLight, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10 }, chipNumber: { color: C.lime, fontSize: 10, fontWeight: '800' }, chipName: { color: C.ink, fontSize: 13, fontWeight: '600', flexShrink: 1 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.line }, summaryLabel: { color: C.muted, fontSize: 12 }, summaryValue: { color: C.ink, fontSize: 12, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
});
