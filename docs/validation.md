# Prüfung von Footy Party

Stand: 9. Oktober 2026.

- `npm run typecheck`: erfolgreich. `npm test`: 27 erfolgreiche Modelltests für Rollenverteilung, sichere Übergabe, abgebrochene Ziehanimation, Wiederholung, Hinweise, Kombinationen, Profilmigration, Bombenzeit, zufälligen Gruppenstart und sechs zurückliegende Inhalte.
- Expo-Export für iOS, Android und Web erfolgreich; GitHub-Pages-Export mit `/football-party`-Basispfad erfolgreich. Native Exporte sind JavaScript-/Hermes-Bundles, keine Store-Builds.
- Visuell geprüft: schwarzes Design mit Blau/Rot, eigenes FP-Icon und Cover, gelber Schiri mit drei Posen (Greifen, Ausholen, Zeigen), gelbe Namenskarte und rote Imposter-Karte. Auf der gelben Karte steht ausschließlich der Name; optionale Hinweise sind außerhalb der roten Karte. Die Grafiken sind eigene, schlichtere Fußball-Maskottchen; Fußballernamen bleiben echt.
- Mobiler Chromium mit Touch-Eingang: Schiri antippen, kurze Ziehanimation und Kartenzoom, Wischen nach unten zum Verdecken, gesperrtes Weiter vor dem Anschauen/während des Ziehens/bei offener Karte. Geheimnisse sind bei verdeckter Karte nicht im DOM. Fokusverlust während des Ziehens verhindert eine spätere Aufdeckung; Fokusverlust bei offener Karte verdeckt sofort.
- Drei verschiedene Imposter mit identischem Hinweis; normale Spieler sehen den Fußballernamen ohne Imposter-Hinweis. Hinweise standardmäßig aus (Modellprüfung). Manuelle Aufdeckung mit rotem Ergebnisbildschirm und gespeicherter Mitspielerfigur neben jedem Imposter-Namen; Wiederholung setzt den Bildschirm zurück. Zufälliger Startspieler und Richtung werden nach der Verteilung angezeigt. Kein automatisches Raten oder Abstimmen.
- Zufallsfiguren: vier unterschiedliche Chibis im Browserteam, Speicherung und Wiederherstellung nach Neuladen. Alte Namen aus v1 migrieren in v2. Kein Charaktereditor mehr. Modellprüfung bestätigt zehn Figuren ohne Wiederholung.
- Dreierkette: automatisches Aufdecken in der Reihenfolge Nation → Position → Liga; gemessene Zeitpunkte ca. 40/1047/2047 ms nach dem Start. Neue Kombination ist bis zum Drei-Sekunden-Ende gesperrt. Wiederholung, Abbruch mitten in der Sequenz, erneuter Einstieg, Deutsch/Englisch und reduzierte Bewegung bestanden. Ohne Namenpflicht.
- Keine JavaScript-/Konsolenfehler. Kein horizontaler Seitenüberlauf bei 320, 390 und 768 Pixel Breite auf Startseite und Lobby. Reduzierte Bewegung unterdrückt den Modus-Effekt.
- Echte Bombenrunde für 60 Sekunden: Tonprobe, zum Ablauf geplantes Audio, abgespielte Audiosource bis zum Audio-Endereignis, „BOOM!“, roter Bildschirm, Sprachwechsel, Wiederholung mit anderer Frage und schwarzem Bildschirm, Abbruch. Einmaliger Vibrationsaufruf geprüft (Browser-API instrumentiert, keine reale Geräte-Vibration). Startspieler und Richtung bleiben während derselben Runde stabil. Kein beschleunigter Timer. Separate Prüfung: Ton und Vibration ausschalten, bei fehlendem AudioContext trotzdem starten.

- Statischer GitHub-Pages-Export: vollständiger mobiler Spielfluss und Start ohne AudioContext bei ausgeschaltetem Ton bestanden.

- Aktuelle öffentliche Pages-Version (9. Oktober): HTML entspricht dem Export, SHA-256 von JavaScript, sechs Fußball-Grafiken und Favicon stimmt mit lokalen Dateien überein. Vollständiger mobiler Spieltest der veröffentlichten Antworten erfolgreich, ohne JavaScript-/Konsolenfehler. TLS bleibt verifiziert; wegen fehlender Proxy-Zertifikate in Chromium liefert die Prüfhilfe mit curl verifiziert abgerufene öffentliche Antworten an den Browser.

Die Browserprüfung verwendet Chromium mit Touch- und Handygröße. Das ist kein Test auf einem echten iPhone mit Safari oder einem Android-Gerät. Vor Store-Veröffentlichung folgen native Gerätetests, Audio/Unterbrechungen und App-Metadaten.
