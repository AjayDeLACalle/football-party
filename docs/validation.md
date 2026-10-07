# Prüfung des erweiterten Prototyps

Stand: 7. Oktober 2026.

- `npm run typecheck`: erfolgreich.
- `npm test`: 22 erfolgreiche Modelltests für Rollenverteilung, Übergabe, Wiederholung, Hinweise, Kombinationen, Profile und Bombenzeit.
- `npm ls --depth=0`: alle deklarierten Abhängigkeiten installiert, inklusive AsyncStorage 2.2.0 aus der Expo-Kompatibilitätsliste.
- Expo-Export für iOS, Android und Web erfolgreich. GitHub-Pages-Export mit `/football-party`-Basispfad erfolgreich.
- Funktionaler Browsertest im mobilen Chromium, mit echtem Touch-Eingang: Ball nach rechts und zurück, zuerst verdeckte Rollen, gesperrtes Weiter bei aufgedeckter Rolle, verdecktes Weiterreichen, drei unterschiedliche Imposter, identischer Hinweis für alle Imposter, keine Hinweise für normale Spieler, Hinweise aus, manuelle Imposter-Aufdeckung, neue Runde und Verdecken bei Fokusverlust.
- Figuren: fünf Optionen je Haare/Kopf/Haut/Trikot und fünf Zubehörteile plus „Ohne“, Speicherung und Wiederherstellung nach Neuladen, Abbrechen ohne Änderung, doppelte Namen beim Bearbeiten abgewiesen.
- Dreierkette: drei Vorgaben ohne Spielername, konkrete Positionskürzel, neue andere Kombination, Deutsch/Englisch und Rückkehr zum Menü ohne Namenpflicht.
- Kein horizontaler Seitenüberlauf bei 320, 390 und 768 Pixel Breite auf Startseite und Kombinationsscreen.
- Echte Bombenrunde für 60 Sekunden: Tonprobe, zum Ablauf geplantes Audio, abgespielte Audiosource bis zum Audio-Endereignis, „BOOM!“, Sprachwechsel, Wiederholung mit anderer Frage und Abbruch. Kein beschleunigter Timer für diesen Test.
- Statischer Pages-Export im mobilen Browser: kompletter erweiterter Spielfluss erfolgreich, ohne JavaScript-/Konsolenfehler.

Die Browserprüfung verwendet Chromium mit Touch- und Handygröße. Das ist kein Test auf einem echten iPhone mit Safari oder einem Android-Gerät. Ein erfolgreicher nativer JavaScript-/Hermes-Export ist kein nativer App-Build und keine Store-Prüfung. Vor Store-Veröffentlichung sind Gerätetests, Audio/Unterbrechungen und App-Metadaten noch zu prüfen.
