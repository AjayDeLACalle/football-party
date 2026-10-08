import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import { ArrowIcon, FootballArt, ModeArt, ModeIcon } from './src/FootballArt';
import { copy } from './src/copy';
import { gameCopy } from './src/gameCopy';
import { BombGame, ImposterGame } from './src/GameScreens';
import { ComboGame, comboCopy } from './src/ComboGame';
import { Avatar } from './src/Avatar';
import { randomAvatar } from './src/profiles';
import { MotionProvider, MotionPressable as Pressable, useReducedMotion } from './src/Motion';
import { ModeLaunch, ResultBlast } from './src/Effects';
import { colors as C } from './src/theme';
import { useProfiles } from './src/useProfiles';
import { Difficulty, Language, MAX_PLAYERS, MIN_PLAYERS, Mode, maxImposters, validateName } from './src/lobby';

type Screen = 'home' | 'lobby' | 'lineup' | 'game';

function Button({ title, onPress, disabled = false, secondary = false }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondaryButton, disabled && s.disabled, pressed && s.pressed]}>
    <Text style={[s.buttonText, secondary && { color: C.ink }]}>{title}</Text>
    <ArrowIcon color={secondary ? C.ink : C.bg} />
  </Pressable>;
}

function PartyApp() {
  useEffect(() => {
    void Asset.loadAsync([require('./assets/chibi/referee.png'), require('./assets/chibi/players.png')]).catch(() => {});
  }, []);
  const [language, setLanguage] = useState<Language>('de');
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode>('imposter');
  const { profiles, setProfiles, ready, storageUnavailable } = useProfiles();
  const players = profiles.map(profile => profile.name);
  const reduced = useReducedMotion();
  const scene = useRef(new Animated.Value(1)).current;
  const moving = useRef(false);
  const [transitioning, setTransitioning] = useState(false);
  const [launch, setLaunch] = useState<Mode | null>(null);
  const [result, setResult] = useState<'bomb' | 'imposter' | null>(null);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<'empty' | 'duplicate' | 'full' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [imposters, setImposters] = useState(1);
  const [confirmExit, setConfirmExit] = useState(false);
  useEffect(() => {
    if (!moving.current) return;
    // The keyed ScrollView must mount before its new Animated.View can fade in.
    const animation = Animated.timing(scene, { toValue: 1, duration: reduced ? 0 : 250, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start(() => { moving.current = false; setTransitioning(false); });
    return () => animation.stop();
  }, [screen]);
  const t = copy[language];
  const g = gameCopy[language];
  const combo = comboCopy[language];
  const hintLabel = language === 'de' ? 'Hinweis für Imposter' : 'Hint for imposters';
  const hintStatus = hintsEnabled ? (language === 'de' ? 'Mit Hinweis' : 'With hint') : t.noHint;
  const currentImposters = Math.min(imposters, maxImposters(players.length));
  const levelHint = mode === 'imposter' ? { easy: t.easyHint, medium: t.mediumHint, hard: t.hardHint }[difficulty] : { easy: g.bombEasy, medium: g.bombMedium, hard: g.bombHard }[difficulty];

  function addPlayer() {
    const validation = validateName(name, players);
    setError(validation);
    if (validation) return;
    if (!ready) return;
    const profile = { name: name.trim(), avatar: randomAvatar(profiles.map(profile => profile.avatar)) };
    setProfiles(current => [...current, profile]);
    setName('');
  }

  function removePlayer(index: number) {
    const next = players.filter((_, i) => i !== index);
    setProfiles(current => current.filter((_, i) => i !== index));
    setImposters((current) => Math.min(current, maxImposters(next.length)));
    setError(null);
  }

  function navigate(next: Screen) {
    if (moving.current || next === screen) return;
    moving.current = true;
    setTransitioning(true);
    setError(null);
    setName('');
    Keyboard.dismiss();
    Animated.timing(scene, { toValue: 0, duration: reduced ? 0 : 130, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(({ finished }) => {
      if (!finished) { moving.current = false; setTransitioning(false); return; }
      setScreen(next);
    });
  }
  function chooseMode(game: Mode) {
    if (moving.current || launch) return;
    setMode(game);
    setLaunch(game);
    navigate(game === 'combo' ? 'game' : 'lobby');
  }

  return <>
    <StatusBar style="light" />
    <SafeAreaView style={[s.safe, result && { backgroundColor: C.result }]} testID={result ? 'red-result-screen' : 'app-screen'}>
      <KeyboardAvoidingView style={s.fill} aria-hidden={!!launch || confirmExit} accessibilityElementsHidden={!!launch || confirmExit} importantForAccessibility={launch || confirmExit ? 'no-hide-descendants' : 'auto'} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView key={screen} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.shell}>
            <View style={s.header}>
              <Pressable disabled={transitioning} accessibilityRole="button" accessibilityLabel={t.home} onPress={() => screen === 'game' && mode !== 'combo' ? setConfirmExit(true) : navigate('home')} style={s.brand}>
                <Image source={require('./assets/chibi/icon.png')} style={s.brandIcon} />
                <Text style={s.brandText}>FOOTY{ '\n' }PARTY<Text style={{ color: C.blue }}>.</Text></Text>
              </Pressable>
              <View accessibilityLabel={t.language} style={s.languageSwitch}>
                {(['de', 'en'] as Language[]).map((lang) => <Pressable key={lang} accessibilityRole="button" accessibilityLabel={lang === 'de' ? 'Deutsch' : 'English'} accessibilityState={{ selected: language === lang }} {...(Platform.OS === 'web' ? { 'aria-pressed': language === lang } : {})} onPress={() => setLanguage(lang)} style={[s.languageButton, language === lang && s.languageActive]}>
                  <Text style={[s.languageText, language === lang && { color: C.bg }]}>{lang.toUpperCase()}</Text>
                </Pressable>)}
              </View>
            </View>

            <Animated.View pointerEvents={transitioning ? 'none' : 'auto'} style={{ opacity: scene, transform: [{ translateY: scene.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
            {screen === 'game' ? (mode === 'combo' ? <ComboGame language={language} onExit={() => navigate('home')} /> : mode === 'imposter' ? <ImposterGame onResult={setResult} profiles={profiles} hintsEnabled={hintsEnabled} players={players} imposters={currentImposters} difficulty={difficulty} language={language} onExit={() => setConfirmExit(true)} onFinished={() => navigate('lobby')} /> : <BombGame profiles={profiles} onResult={setResult} difficulty={difficulty} language={language} onExit={() => setConfirmExit(true)} onFinished={() => navigate('lobby')} />) : screen === 'home' ? <>
              <View style={s.hero}>
                <Text style={s.eyebrow}>{t.eyebrow}</Text>
                <Text accessibilityRole="header" style={s.heroTitle}>{t.title}</Text>
                <Text style={s.intro}>{t.intro}</Text>
                <FootballArt label={t.footballArt} />
                <View style={s.metaRow}><Text style={s.meta}>●  {t.players}</Text><Text style={s.meta}>↔  {t.onePhone}</Text></View>
              </View>
              <Text accessibilityRole="header" style={s.sectionTitle}>{t.choose}</Text>
              {(['imposter', 'bomb', 'combo'] as Mode[]).map((game, index) => {
                const info = game === 'imposter' ? { title: t.imposter, tag: t.bluff, description: t.imposterDescription, action: t.start, accent: C.blue }
                  : game === 'bomb' ? { title: t.bomb, tag: t.speed, description: t.bombDescription, action: t.start, accent: C.red }
                    : { title: combo.name, tag: combo.tag, description: combo.description, action: combo.start, accent: '#5592FF' };
                return <Pressable key={game} accessibilityRole="button" accessibilityLabel={`${info.title}: ${info.action}`} onPress={() => chooseMode(game)} style={({ pressed }) => [s.modeCard, game === 'bomb' && s.bombCard, game === 'combo' && { backgroundColor: '#10192A', borderColor: '#283A58' }, pressed && s.pressed]}>
                  <View style={s.modeTop}><Text style={[s.modeTag, { color: info.accent }]}>{info.tag}</Text><Text style={[s.modeIndex, { color: info.accent }]}>0{index + 1}</Text></View><ModeArt mode={game} height={190} />
                  <Text style={s.modeName}>{info.title}</Text><Text style={s.modeDescription}>{info.description}</Text>
                  <View style={s.cardFooter}><Text style={[s.cardAction, { color: info.accent }]}>{info.action}</Text><ArrowIcon color={info.accent} /></View>
                </Pressable>;
              })}
              <Text style={s.footer}>FOOTY PARTY · {t.onePhone.toUpperCase()}</Text>
            </> : <>
              <Pressable accessibilityRole="button" onPress={() => navigate(screen === 'lineup' ? 'lobby' : 'home')} style={s.back}><Text style={s.backText}>←  {t.back}</Text></Pressable>
              <View style={s.lobbyTitleRow}><View style={{ flex: 1 }}><Text style={s.eyebrow}>{mode === 'imposter' ? t.imposter : t.bomb} / {t.singleRound.toUpperCase()}</Text><Text accessibilityRole="header" style={s.pageTitle}>{screen === 'lineup' ? t.lineup : t.team}</Text></View><ModeIcon bomb={mode === 'bomb'} size={54} /></View>
              <Text style={s.pageIntro}>{screen === 'lineup' ? t.lineupHint : t.teamIntro}</Text>

              {screen === 'lobby' ? <>
                <View style={s.inputRow}>
                  <TextInput accessibilityLabel={t.name} placeholder={t.namePlaceholder} placeholderTextColor={C.muted} value={name} onChangeText={(value) => { setName(value); setError(null); }} maxLength={20} autoCapitalize="words" autoCorrect={false} returnKeyType="done" onSubmitEditing={addPlayer} editable={ready && players.length < MAX_PLAYERS} style={s.input} />
                  <Pressable accessibilityRole="button" accessibilityLabel={t.add} accessibilityState={{ disabled: !ready || players.length >= MAX_PLAYERS }} disabled={!ready || players.length >= MAX_PLAYERS} onPress={addPlayer} style={({ pressed }) => [s.addButton, players.length >= MAX_PLAYERS && s.disabled, pressed && s.pressed]}><Text style={s.plus}>+</Text></Pressable>
                </View>
                {error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.error}>{t[error]}</Text>}
                <View style={s.teamHeader}><Text style={s.sectionTitle}>{t.team}</Text><Text style={s.counter}>{players.length} / {MAX_PLAYERS}</Text></View>
                {players.length === 0 && <View style={s.emptyTeam}><Text style={s.emptyNumber}>01</Text><View style={s.fill}><Text style={s.emptyTitle}>{t.emptyTeam}</Text><Text style={s.emptyHint}>{t.emptyTeamHint}</Text></View></View>}
                {profiles.map((profile, index) => <View key={profile.name} style={s.playerRow}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}><Avatar config={profile.avatar} size={52} /><Text style={s.playerName}>{profile.name}</Text></View>
                  <Text style={s.playerIndex}>{String(index + 1).padStart(2, '0')}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${profile.name}: ${t.remove}`} onPress={() => removePlayer(index)} hitSlop={8} style={s.remove}><Text style={s.removeText}>×</Text></Pressable>
                </View>)}
                <Text style={s.settingHint}>{!ready ? (language === 'de' ? 'Team wird geladen …' : 'Loading team …') : storageUnavailable ? (language === 'de' ? 'Speicherung nicht verfügbar. Dein Team bleibt für diese Sitzung erhalten.' : 'Storage unavailable. Your team stays for this session.') : (language === 'de' ? 'Jeder bekommt automatisch einen Chibi. Dein Team bleibt auf diesem Gerät gespeichert.' : 'Everyone gets a random chibi. Your team is saved on this device.')}</Text>

                  <Text accessibilityRole="header" style={[s.sectionTitle, s.settingsTitle]}>{t.difficulty}</Text>
                  <View style={s.segmentRow}>{(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => <Pressable key={level} accessibilityRole="button" accessibilityState={{ selected: difficulty === level }} {...(Platform.OS === 'web' ? { 'aria-pressed': difficulty === level } : {})} onPress={() => setDifficulty(level)} style={[s.segment, difficulty === level && s.segmentActive]}><Text style={[s.segmentText, difficulty === level && { color: C.bg }]}>{t[level]}</Text></Pressable>)}</View>
                  <Text style={s.settingHint}>{levelHint}</Text>
                {mode === 'imposter' ? <>
                  <View style={s.legendBadge}><Text style={s.legendText}>✦  {difficulty === 'hard' ? (language === 'de' ? 'TOP-5-LIGEN · AKTIVE PROFIS' : 'TOP FIVE LEAGUES · ACTIVE PROS') : t.legends}</Text></View>
                  <Text accessibilityRole="header" style={[s.sectionTitle, s.settingsTitle]}>{t.imposters}</Text>
                  <View style={s.segmentRow}>{[1, 2, 3].map((count) => <Pressable key={count} accessibilityRole="button" accessibilityLabel={`${count} ${t.imposters.toLowerCase()}`} accessibilityState={{ selected: currentImposters === count, disabled: count > maxImposters(players.length) }} {...(Platform.OS === 'web' ? { 'aria-pressed': currentImposters === count } : {})} disabled={count > maxImposters(players.length)} onPress={() => setImposters(count)} style={[s.segment, currentImposters === count && s.segmentActive, count > maxImposters(players.length) && s.disabled]}><Text style={[s.segmentText, currentImposters === count && { color: C.bg }]}>{count}</Text></Pressable>)}</View>
                  <Text style={s.settingHint}>{t.impostersHint} {t.oneKnows}</Text>
                  <View style={s.hintRow}><View style={{ flex: 1 }}><Text style={s.rulesTitle}>{hintLabel}</Text><Text style={s.settingHint}>{hintsEnabled ? (language === 'de' ? 'Ein früherer Verein, eine Liga oder eine Position. Alle Imposter erhalten denselben Hinweis.' : 'A former club, a league or a position. All imposters receive the same hint.') : (language === 'de' ? 'Die Imposter sehen nur ihre Rolle.' : 'Imposters only see their role.')}</Text></View><Switch accessibilityLabel={hintLabel} value={hintsEnabled} onValueChange={setHintsEnabled} trackColor={{ false: C.line, true: '#284A87' }} thumbColor={hintsEnabled ? C.blue : C.muted} /></View>
                </> : <View style={s.rulesBox}><Text style={s.rulesTitle}>{t.rules}</Text><Text style={s.rulesCopy}>{t.bombHint}</Text></View>}
                <View style={s.bottomAction}><Button title={t.review} disabled={players.length < MIN_PLAYERS} onPress={() => navigate('lineup')} /><Text style={s.actionHint}>{t.needPlayers}</Text></View>
              </> : <>
                <View style={s.lineupCard}><View style={s.lineupHeading}><Text style={s.sectionTitle}>{t.team}</Text><Text style={s.counter}>{players.length}</Text></View><View style={s.chips}>{players.map((player, index) => <View key={player} style={s.chip}><Avatar config={profiles[index].avatar} size={25} /><Text style={s.chipName}>{player}</Text></View>)}</View><View style={s.summaryRow}><Text style={s.summaryLabel}>{t.mode}</Text><Text style={s.summaryValue}>{mode === 'imposter' ? t.imposter : t.bomb}</Text></View><View style={s.summaryRow}><Text style={s.summaryLabel}>{t.level}</Text><Text style={s.summaryValue}>{t[difficulty]}</Text></View>{mode === 'imposter' && <View style={s.summaryRow}><Text style={s.summaryLabel}>{t.imposters}</Text><Text style={s.summaryValue}>{currentImposters} · {hintStatus}</Text></View>}</View>
                <View style={s.rulesBox}><Text style={s.rulesTitle}>{t.rules}</Text><Text style={s.rulesCopy}>{mode === 'imposter' ? t.imposterRules : t.bombRules}</Text></View>
                <View style={s.bottomAction}><Button title={g.start} onPress={() => navigate('game')} /><View style={{ height: 12 }} /><Button title={t.edit} secondary onPress={() => navigate('lobby')} /></View>
              </>}
            </>}
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {result && <ResultBlast key={result} kind={result} language={language} />}
      {launch && <ModeLaunch mode={launch} language={language} onDone={() => setLaunch(null)} />}
      <Modal visible={confirmExit} transparent animationType="fade" onRequestClose={() => setConfirmExit(false)}>
        <View style={s.modalOverlay}><View accessibilityViewIsModal role="dialog" accessibilityLabel={g.cancelTitle} aria-modal style={s.modalCard}><Text accessibilityRole="header" style={s.modalTitle}>{g.cancelTitle}</Text><Text style={s.pageIntro}>{g.cancelHint}</Text><Button title={g.cancelNo} onPress={() => setConfirmExit(false)} /><View style={{ height: 12 }} /><Button title={g.cancelYes} secondary onPress={() => { setConfirmExit(false); navigate('lobby'); }} /></View></View>
      </Modal>
    </SafeAreaView>
  </>;
}

export default function App() {
  return <SafeAreaProvider><MotionProvider><PartyApp /></MotionProvider></SafeAreaProvider>;
}

const s = StyleSheet.create({
  brandIcon: { width: 46, height: 46, borderRadius: 13, borderWidth: 1, borderColor: C.line },
  hintRow: { flexDirection: 'row', gap: 15, alignItems: 'center', backgroundColor: C.panel, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: C.line, marginTop: 25 },
  modalOverlay: { flex: 1, backgroundColor: '#000000bb', alignItems: 'center', justifyContent: 'center', padding: 22 }, modalCard: { width: '100%', maxWidth: 450, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, padding: 24, borderRadius: 24 }, modalTitle: { color: C.ink, fontSize: 24, fontWeight: '900' },
  fill: { flex: 1 }, safe: { flex: 1, backgroundColor: C.bg }, scroll: { flexGrow: 1, paddingBottom: 30 },
  shell: { width: '100%', maxWidth: 500, alignSelf: 'center', paddingHorizontal: 22 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 22 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandMark: { backgroundColor: C.blue, borderRadius: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }] }, brandMarkText: { fontSize: 19, fontWeight: '900', color: C.bg, fontStyle: 'italic' }, brandText: { color: C.ink, fontSize: 13, lineHeight: 14, fontWeight: '900', letterSpacing: 0.8 },
  languageSwitch: { flexDirection: 'row', padding: 4, backgroundColor: C.panel, borderRadius: 25, borderWidth: 1, borderColor: C.line }, languageButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20 }, languageActive: { backgroundColor: C.blue }, languageText: { fontWeight: '800', fontSize: 11, color: C.muted },
  hero: { paddingTop: 22 }, eyebrow: { color: C.blue, fontWeight: '800', fontSize: 10, letterSpacing: 2, marginBottom: 12 }, heroTitle: { color: C.ink, fontWeight: '900', fontSize: 48, lineHeight: 49, letterSpacing: -1.5, fontStyle: 'italic' }, intro: { color: C.muted, fontSize: 15, lineHeight: 23, marginTop: 16, marginBottom: 13, maxWidth: 350 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', paddingTop: 8, paddingBottom: 28 }, meta: { color: C.muted, fontSize: 11, fontWeight: '600' },
  sectionTitle: { color: C.ink, fontSize: 11, letterSpacing: 1.8, fontWeight: '800', marginBottom: 14 },
  modeCard: { backgroundColor: C.panel, padding: 23, borderRadius: 24, borderWidth: 1, borderColor: C.line, marginBottom: 15 }, bombCard: { backgroundColor: '#22111A', borderColor: '#4B1B2C' }, modeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }, iconBox: { backgroundColor: C.panelLight, borderRadius: 17, width: 62, height: 62, alignItems: 'center', justifyContent: 'center' }, modeIndex: { color: C.blue, opacity: 0.5, fontSize: 31, fontWeight: '900', fontStyle: 'italic' }, modeTag: { color: C.blue, fontSize: 9, letterSpacing: 1.4, fontWeight: '800', marginBottom: 7 }, modeName: { color: C.ink, fontSize: 32, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 }, modeDescription: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 320 }, cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, borderTopWidth: 1, borderTopColor: '#ffffff12', paddingTop: 15 }, cardAction: { fontSize: 13, fontWeight: '800', color: C.blue }, cardArrow: { fontSize: 24, color: C.blue }, footer: { textAlign: 'center', fontWeight: '700', color: '#606B82', fontSize: 9, letterSpacing: 1.1, paddingTop: 15 },
  back: { alignSelf: 'flex-start', paddingVertical: 12, paddingRight: 20, marginBottom: 15 }, backText: { color: C.muted, fontSize: 13, fontWeight: '600' }, lobbyTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 15 }, pageTitle: { color: C.ink, fontSize: 34, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 }, pageIntro: { color: C.muted, fontSize: 14, lineHeight: 22, marginTop: 12, marginBottom: 24 },
  inputRow: { flexDirection: 'row', gap: 10 }, input: { minWidth: 0, flex: 1, color: C.ink, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16 }, addButton: { width: 56, minHeight: 56, borderRadius: 15, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center' }, plus: { color: C.bg, fontSize: 29, fontWeight: '500' }, error: { color: C.red, fontSize: 13, marginTop: 10 },
  teamHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }, counter: { color: C.blue, fontSize: 12, fontWeight: '800', marginBottom: 14 }, emptyTeam: { flexDirection: 'row', alignItems: 'center', padding: 20, borderWidth: 1, borderColor: C.line, borderStyle: 'dashed', borderRadius: 16, gap: 16 }, emptyNumber: { color: '#536078', fontSize: 28, fontWeight: '900' }, emptyTitle: { color: C.muted, fontSize: 13, fontWeight: '700' }, emptyHint: { color: '#69758A', fontSize: 12, marginTop: 5 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: C.panel, padding: 12, marginBottom: 8 }, avatar: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, avatarText: { fontWeight: '900', color: C.bg, fontSize: 17 }, playerName: { flex: 1, color: C.ink, fontSize: 15, fontWeight: '600' }, playerIndex: { color: '#606B82', fontWeight: '700', fontSize: 12 }, remove: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }, removeText: { color: C.muted, fontSize: 24 },
  settingsTitle: { marginTop: 27 }, segmentRow: { flexDirection: 'row', gap: 8 }, segment: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, alignItems: 'center' }, segmentActive: { backgroundColor: C.blue, borderColor: C.blue }, segmentText: { fontSize: 14, fontWeight: '800', color: C.muted }, settingHint: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 12 }, legendBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 7, marginTop: 12, backgroundColor: C.panel, borderRadius: 8 }, legendText: { color: C.blue, fontSize: 8, letterSpacing: 1, fontWeight: '800' },
  bottomAction: { marginTop: 30, paddingBottom: 12 }, button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.blue, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, minHeight: 58 }, secondaryButton: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line }, buttonText: { color: C.bg, fontSize: 15, fontWeight: '800', flexShrink: 1 }, buttonArrow: { fontSize: 23, color: C.bg }, disabled: { opacity: 0.35 }, pressed: { opacity: 0.75 }, actionHint: { textAlign: 'center', color: C.muted, fontSize: 11, paddingTop: 12 },
  rulesBox: { backgroundColor: C.panel, borderRadius: 18, padding: 20, marginTop: 25, borderWidth: 1, borderColor: C.line }, rulesTitle: { color: C.ink, fontSize: 14, fontWeight: '800', marginBottom: 8 }, rulesCopy: { color: C.muted, fontSize: 13, lineHeight: 22 },
  lineupCard: { backgroundColor: C.panel, borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 20 }, lineupHeading: { flexDirection: 'row', justifyContent: 'space-between' }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 23 }, chip: { maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.panelLight, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10 }, chipNumber: { color: C.blue, fontSize: 10, fontWeight: '800' }, chipName: { color: C.ink, fontSize: 13, fontWeight: '600', flexShrink: 1 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.line }, summaryLabel: { color: C.muted, fontSize: 12 }, summaryValue: { color: C.ink, fontSize: 12, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
});
