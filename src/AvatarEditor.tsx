import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, skinColors } from './Avatar';
import type { AvatarConfig, PlayerProfile } from './profiles';
import type { Language } from './lobby';
import { copy } from './copy';

const labels = {
  de: { title: 'DEINE SPIELFIGUR', save: 'Figur speichern', cancel: 'Abbrechen', hair: 'Haare', head: 'Kopfform', skin: 'Hautfarbe', jersey: 'Trikot', accessory: 'Zubehör', storage: 'Nur auf diesem Gerät gespeichert. Ohne Account.', jerseys: ['Blau-Rot','Schwarz-Gelb','Weiß-Gold','Himmelblau-Weiß','Dunkelblau'], accessories: ['Ohne','Cap','Brille','Schal','Stirnband','Ohrring'] },
  en: { title: 'YOUR PLAYER', save: 'Save player', cancel: 'Cancel', hair: 'Hair', head: 'Head shape', skin: 'Skin tone', jersey: 'Shirt', accessory: 'Accessory', storage: 'Saved only on this device. No account.', jerseys: ['Blue-Red','Black-Yellow','White-Gold','Sky blue-White','Dark blue'], accessories: ['None','Cap','Glasses','Scarf','Headband','Earring'] },
};
export function AvatarEditor({ initial, language, onSave, onCancel }: { initial: PlayerProfile; language: Language; onSave: (profile: PlayerProfile) => 'empty' | 'duplicate' | 'full' | null; onCancel: () => void }) {
  const [avatar, setAvatar] = useState<AvatarConfig>({ ...initial.avatar });
  const [name, setName] = useState(initial.name);
  const [error, setError] = useState<'empty' | 'duplicate' | 'full' | null>(null);
  const t = labels[language];
  return <Modal visible animationType="slide" onRequestClose={onCancel}>
    <SafeAreaView style={s.safe} role="dialog" accessibilityLabel={t.title} accessibilityViewIsModal aria-modal><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={s.title}>{t.title}</Text>
        <View style={s.preview}><Avatar config={avatar} size={150} label={t.title} /></View>
        <TextInput accessibilityLabel={copy[language].name} style={s.input} value={name} onChangeText={v => { setName(v); setError(null); }} maxLength={20} autoCorrect={false} />
        {error && <Text accessibilityRole="alert" style={s.error}>{copy[language][error]}</Text>}
        {(['hair','head','skin','jersey','accessory'] as const).map(key => <View key={key} style={s.category}>
          <Text style={s.label}>{t[key]}</Text>
          <View style={s.options}>{Array.from({ length: key === 'accessory' ? 6 : 5 }, (_, i) => {
            const caption = key === 'jersey' ? t.jerseys[i] : key === 'accessory' ? t.accessories[i] : String(i + 1);
            return <Pressable key={i} accessibilityRole="button" accessibilityLabel={`${t[key]}: ${caption}`} accessibilityState={{ selected: avatar[key] === i }} {...(Platform.OS === 'web' ? { 'aria-pressed': avatar[key] === i } : {})} onPress={() => setAvatar(a => ({ ...a, [key]: i }))} style={[s.option, avatar[key] === i && s.active]}>
              {key === 'skin' ? <View style={[s.swatch, { backgroundColor: skinColors[i] }]} /> : <Avatar config={{ ...avatar, [key]: i }} size={42} />}
              <Text style={s.caption}>{caption}</Text>
            </Pressable>;
          })}</View>
        </View>)}
        <Text style={s.note}>{t.storage}</Text>
      </ScrollView>
      <View style={s.actions}><Pressable accessibilityRole="button" onPress={onCancel} style={s.cancel}><Text style={s.cancelText}>{t.cancel}</Text></Pressable><Pressable accessibilityRole="button" onPress={() => setError(onSave({ name: name.trim(), avatar }))} style={s.save}><Text style={s.saveText}>{t.save}</Text></Pressable></View>
    </KeyboardAvoidingView></SafeAreaView>
  </Modal>;
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c1e16', paddingTop: 25, paddingBottom: 25 }, scroll: { padding: 22, width: '100%', maxWidth: 500, alignSelf: 'center' },
  title: { color: '#f2f4e5', fontWeight: '900', fontSize: 26, fontStyle: 'italic' }, preview: { alignItems: 'center', marginVertical: 18 }, input: { color: '#f2f4e5', fontSize: 18, backgroundColor: '#142b20', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2b4835' },
  category: { marginTop: 25 }, label: { color: '#c4fa61', fontSize: 12, fontWeight: '800', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, option: { width: '18%', minWidth: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#142b20', borderWidth: 1, borderColor: '#2b4835', borderRadius: 12, paddingVertical: 8, minHeight: 75 }, active: { borderColor: '#c4fa61', backgroundColor: '#26432d', borderWidth: 2 }, caption: { color: '#f2f4e5', fontSize: 9, marginTop: 4, textAlign: 'center', paddingHorizontal: 2 }, swatch: { height: 33, width: 33, borderRadius: 20 }, note: { color: '#a6b4a3', fontSize: 12, marginTop: 24 }, error: { color: '#ff9b61', fontSize: 13, marginTop: 12 },
  actions: { width: '100%', maxWidth: 500, alignSelf: 'center', flexDirection: 'row', paddingHorizontal: 22, gap: 12, paddingTop: 12 }, cancel: { paddingVertical: 17, paddingHorizontal: 13, justifyContent: 'center' }, save: { flex: 1, padding: 17, alignItems: 'center', backgroundColor: '#c4fa61', borderRadius: 15 }, cancelText: { color: '#a6b4a3', fontWeight: '700' }, saveText: { color: '#0c1e16', fontWeight: '800' },
});
