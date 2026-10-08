# Footy Party

Eine Fußball-Party-App für ein gemeinsames Handy, mit Expo und React Native für iOS, Android und Web. Deutsch und Englisch sind umschaltbar.

Browser-Testseite: **https://ajaydelacalle.github.io/football-party/**

## Spielbarer Prototyp

- Schwarze Oberfläche mit blauen/roten Akzenten, neuen Modus-Icons und animierten Übergängen. Die Systemeinstellung für reduzierte Bewegung wird berücksichtigt.
- Eigene Chibi-Maskottchen auf Cover und Rollenkarte; echte Fußballernamen bleiben erhalten. Die Figuren stellen keine konkreten Fußballer dar.
- Persönliches FP-Chibi-Icon nach der Beschreibung des Nutzers: brauner Hautton, schwarze lockige Haare, Ohrringe, blau/rotes Custom-Trikot.
- Drei Modi: **Imposter**, **Bombe** und **Dreierkette**.
- Gemeinsames Team aus 3–10 Namen für Imposter und Bombe; Duplikatprüfung. Jeder neue Mitspieler bekommt automatisch einen zufälligen Chibi aus zwölf Figuren, ohne Charaktereditor. Bis zu zehn Figuren werden ohne Wiederholung zugewiesen.
- Profile bleiben auf diesem Gerät gespeichert (Web: localStorage; native: AsyncStorage). Alte Namen aus dem Figuren-Editor werden übernommen und erhalten neue Zufallsfiguren. Bei gesperrtem Speicher bleiben Profile für die Sitzung verfügbar. Geheime Rollen werden nicht gespeichert.

### Imposter

1–3 zufällige Imposter, mindestens ein normaler Mitspieler. Alle normalen Mitspieler sehen denselben Fußballernamen. Vor der Runde könnt ihr Hinweise ein- oder ausschalten; standardmäßig sind sie aus. Mit Hinweisen sehen alle Imposter denselben zufällig gewählten früheren Verein, eine Liga oder eine etablierte Position des Fußballers. Sie sehen seinen Namen nicht.

Ein Chibi-Schiri zieht nach Antippen mit kurzer Animation eine Karte, die nach vorn zoomt: gelb zeigt den Fußballernamen mit eigenem Chibi-Maskottchen, rot die Imposter-Rolle und gegebenenfalls den Hinweis. Danach nach unten wischen oder „Karte verdecken“ drücken, dann weitergeben. „Weiter“ wird erst nach Anschauen und Zudecken freigeschaltet und ist während des Ziehens gesperrt. Button/Tastatur-Bedienung ist ebenfalls vorhanden. Geheimnisse werden nur bei aufgedeckter Karte gerendert. Bei App-/Tab-Wechsel oder Fokusverlust wird sofort verdeckt und eine laufende Ziehanimation abgebrochen.
Nach der Verteilung spielt und rät die Gruppe selbst. Die App bietet „Imposter aufdecken“, zeigt die Namen der Imposter und erlaubt eine neue Runde mit einem anderen Fußballer. Die Aufdeckung erzeugt einen roten Bildschirm-Effekt. Keine Abstimmung, Punkte oder automatische Gewinnerentscheidung.

Die Schwierigkeit richtet sich nach Bekanntheit: leicht Weltstars und berühmte Legenden; mittel bekannte Topspieler und Legenden; schwer erkennbare Profis aus den Top-5-Ligen, z. B. Arnaud Kalimuendo, Omari Hutchinson und Riccardo Calafiori. Es gibt **96 unterschiedliche Fußballernamen**, 32 pro Stufe. Das ist ein kuratierter Pool, keine vollständige oder automatisch aktualisierte Ligadatenbank.

### Bombe

Zufällige Frage nach Schwierigkeit, exakt 60 Sekunden, pulsierender Timer und Explosion mit Ton und rotem Bildschirm-Effekt. Leicht z. B. Barcelona-Spieler, mittel brasilianische Verteidiger, schwer Teamkollegen von Ángel Di María. **24 zweisprachige Fragen**. Wer das Handy bei Ablauf hält, ist raus; die Gruppe verwaltet das Ausscheiden. „Nochmal spielen“ zieht eine andere Frage.

Lautstärke einschalten und Ton vorab testen. Den Browser während der Runde im Vordergrund lassen; mobile Systeme können Hintergrund-Audio und Timer aussetzen.

### Dreierkette

Der Host liest nur **Liga, Nation und konkrete Position** vor. Alle nennen passende Fußballer oder Legenden. Wer zuletzt antwortet oder niemanden weiß, verliert; die Gruppe entscheidet. „Neue Kombination“ zieht einen anderen Dreier, „Zum Menü“ beendet den Modus. Keine Namenseingabe oder automatische Antwortprüfung nötig.

Frühere Liga-Aufenthalte zählen. Die Position muss der Spieler regelmäßig gespielt haben; ein einzelner Einsatz reicht nicht. Nation meint die Fußball-Nationalität, nicht den Geburtsort. Positionen: TW, RV, IV, LV, ZDM, ZM, ZOM, RA, LA und ST (mit englischen Kürzeln in der englischen Oberfläche).

Die Vorgaben werden als zusammengehörige, kuratierte Kombinationen gezogen. Jede hat mindestens zwei hinterlegte Beispielspieler mit etablierten Rollen in der jeweiligen Liga. Diese dienen intern zur Prüfung, werden im Spiel nicht angezeigt und begrenzen gültige Antworten nicht. Quellen und Pflegehinweise: [docs/football-data.md](docs/football-data.md).

## Entwicklung

Node.js 24 und npm. Keine Accounts, Secrets, Datenbank oder Backend-Dienste erforderlich.

```sh
npm ci
npm run web
```

Cloud-Umgebung mit eingeschränkten Cache-Verzeichnissen:

```sh
export npm_config_cache=/workspace/.cache/npm
export EXPO_UNSTABLE_HEADLESS=1
export EXPO_NO_TELEMETRY=1
export __UNSAFE_EXPO_HOME_DIRECTORY=/workspace/.cache/expo
export XDG_CACHE_HOME=/workspace/.cache
npm run web -- --offline --port 8081
```

```sh
npm run typecheck
npm test
npx --no-install expo export --platform all --max-workers 2
npm run build:pages
```

Ein funktionierender Export ersetzt keinen Test auf einem echten iPhone oder Android-Gerät. Store-Konfiguration, native Gerätetests und Store-Veröffentlichung folgen später. `npm run ios` setzt macOS und einen Simulator voraus; `npm run android` ein Gerät oder einen Emulator. Expo Go muss zum SDK passen, alternativ einen Development Build verwenden.

## Veröffentlichung

`npm run build:pages` erzeugt `dist-pages/` mit `/football-party`-Basispfad und `.nojekyll`. Nur diese generierten Dateien werden auf `gh-pages` veröffentlicht; dessen Historie beim Aktualisieren erhalten. Die zuvor veröffentlichten JavaScript-Bundles und zugehörigen Grafikdateien für noch zwischengespeicherte HTML-Seiten zusätzlich behalten, damit ein Browser-Cache während eines Updates keine fehlende Datei anfordert. Der Quellcode ist auf `football-party-prototype` gesichert. GitHub Pages wurde durch den Nutzer aktiviert (Branch `gh-pages`, Verzeichnis `/ (root)`). Der obige HTTPS-Link ist die Testseite für Safari auf dem iPhone.
