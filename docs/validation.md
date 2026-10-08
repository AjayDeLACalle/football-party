# Prüfung von Footy Party

Stand: 8. Oktober 2026.

- `npm run typecheck`: erfolgreich. `npm test`: 24 erfolgreiche Modelltests für Rollenverteilung, sichere Übergabe, abgebrochene Ziehanimation, Wiederholung, Hinweise, Kombinationen, Profilmigration und Bombenzeit.
- Expo-Export für iOS, Android und Web erfolgreich; GitHub-Pages-Export mit `/football-party`-Basispfad erfolgreich. Native Exporte sind JavaScript-/Hermes-Bundles, keine Store-Builds.
- Visuell geprüft: schwarzes Design mit Blau/Rot, eigenes FP-Icon und Cover, Chibi-Schiri, gelbe und rote Karten. Die Grafiken sind eigene Maskottchen; Fußballernamen bleiben echt.
- Mobiler Chromium mit Touch-Eingang: Schiri antippen, kurze Ziehanimation und Kartenzoom, Wischen nach unten zum Verdecken, gesperrtes Weiter vor dem Anschauen/während des Ziehens/bei offener Karte. Geheimnisse sind bei verdeckter Karte nicht im DOM. Fokusverlust während des Ziehens verhindert eine spätere Aufdeckung; Fokusverlust bei offener Karte verdeckt sofort.
- Drei verschiedene Imposter mit identischem Hinweis; normale Spieler sehen den Fußballernamen ohne Imposter-Hinweis. Hinweise standardmäßig aus (Modellprüfung). Manuelle Aufdeckung mit rotem Ergebnisbildschirm, Wiederholung setzt den Bildschirm zurück. Kein automatisches Raten oder Abstimmen.
- Zufallsfiguren: vier unterschiedliche Chibis im Browserteam, Speicherung und Wiederherstellung nach Neuladen. Alte Namen aus v1 migrieren in v2. Kein Charaktereditor mehr. Modellprüfung bestätigt zehn Figuren ohne Wiederholung.
- Dreierkette: drei Vorgaben ohne Spielername, neue andere Kombination, Deutsch/Englisch und Rückkehr zum Menü ohne Namenpflicht.
- Keine JavaScript-/Konsolenfehler. Kein horizontaler Seitenüberlauf bei 320, 390 und 768 Pixel Breite auf Startseite und Lobby. Reduzierte Bewegung unterdrückt den Modus-Effekt.
- Echte Bombenrunde für 60 Sekunden: Tonprobe, zum Ablauf geplantes Audio, abgespielte Audiosource bis zum Audio-Endereignis, „BOOM!“, roter Bildschirm, Sprachwechsel, Wiederholung mit anderer Frage und schwarzem Bildschirm, Abbruch. Kein beschleunigter Timer.

- Statischer GitHub-Pages-Export: vollständiger mobiler Spielfluss sowie echte 60-Sekunden-Bombenrunde mit Ton und rotem Ergebnis bestanden.

Die Browserprüfung verwendet Chromium mit Touch- und Handygröße. Das ist kein Test auf einem echten iPhone mit Safari oder einem Android-Gerät. Vor Store-Veröffentlichung folgen native Gerätetests, Audio/Unterbrechungen und App-Metadaten.
