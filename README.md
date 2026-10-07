# Football Party

Eine Fußball-Party-App für ein gemeinsames Handy, auf Basis von Expo und React Native für iOS, Android und Web. Deutsch und Englisch sind in der Oberfläche umschaltbar.

## Stand: erster spielbarer Prototyp

- Sportliche Startseite mit eigenen Vektor-Cartoons, ohne Vereinswappen oder Sponsoren.
- Moduswahl: Imposter oder Bombe.
- Gemeinsame Spielerliste mit 3–10 Namen; Hinzufügen, Entfernen und Duplikatprüfung.
- Imposter-Einstellungen: leicht, mittel oder schwer und 1–3 Imposter, solange mindestens eine Person den Fußballernamen erhält.
- Zusammenfassung der Aufstellung. Namen und Einstellungen bleiben während der Sitzung beim Navigieren erhalten.

- Geheime Rollenkarten: hochwischen, Rolle merken, wieder zudecken, weitergeben. „Weiter“ wird erst nach Anschauen und Zudecken freigeschaltet. Tastatur- und Screenreader-Nutzer können die Karte auch als Button aufdecken.
- Alle normalen Mitspieler erhalten denselben Fußballernamen. Die 1–3 zufällig zugewiesenen Imposter erhalten nur „Du bist Imposter“, ohne Hinweis.
- Nach der Verteilung diskutiert und rät die Gruppe selbst. Die App bietet „Imposter aufdecken“, zeigt die Namen und erlaubt eine neue Runde mit einem anderen Fußballer. Keine Abstimmung, Punkte, Gewinnerentscheidung oder automatische Ausscheidung im Imposter-Modus.
- Bombe: zufällige Frage nach Schwierigkeit, exakt 60 Sekunden, Explosion mit Ton, „Nochmal spielen“ mit einer anderen Frage. Wer das Handy bei der Explosion hält, ist raus; die Gruppe kümmert sich um das Ausscheiden.

Der Katalog enthält zunächst **96 unterschiedliche Fußballer und Legenden** (32 pro Schwierigkeitsstufe) und **24 zweisprachige Bombenfragen**. Die vollständige Abdeckung aller Spieler der Top-5-Ligen ist noch offen. Namen und Einstellungen bleiben während der Sitzung erhalten; ein Neuladen setzt die App zurück.

Store-Konfiguration, native Gerätetests und Store-Veröffentlichung folgen später.

## Entwicklung

Node.js 24 und npm verwenden. Keine Accounts, Secrets oder Backend-Dienste erforderlich.

```sh
npm ci
npm start
```

Auf einem echten Handy mit einer zum Expo-SDK passenden Expo-Go-Version oder einem Development Build testen. `npm run ios` setzt macOS und den iOS-Simulator voraus; `npm run android` benötigt ein Android-Gerät oder einen Emulator. Web dient zusätzlich als UI-Testziel:

```sh
npm run web
npm run typecheck
npm test
npm run build:web
npm run build:pages
```

Native Geräte- und Store-Tests sind durch einen erfolgreichen Web-Build nicht abgedeckt.

## Browser-Testlink über GitHub Pages

`npm run build:pages` erzeugt `dist-pages/` mit dem Basis-Pfad `/football-party` und `.nojekyll`. Für die Pages-Veröffentlichung nur diese generierten Dateien auf den Branch `gh-pages` hochladen; kein Backend und keine Umgebungsvariablen werden beim Besuch benötigt.

In GitHub unter **Settings → Pages** als Quelle **Deploy from a branch**, Branch **gh-pages**, Verzeichnis **/ (root)** auswählen und speichern. Für private Repositorys hängt die Verfügbarkeit von GitHub Pages vom GitHub-Tarif ab. Das Repository bleibt privat; eine normale Pages-Testseite kann öffentlich erreichbar sein.

Nach erfolgreicher Veröffentlichung den echten HTTPS-Link auf einem iPhone in Safari öffnen. Lautstärke einschalten, im Bombenmodus den Ton testen und den Browser während der Runde im Vordergrund lassen. Mobile Browser können Ton und Timer im Hintergrund oder bei gesperrtem Bildschirm aussetzen. Rollenkarten werden bei Tab-Wechsel oder Verlust des Fensterfokus automatisch verdeckt.

## Spielkonzept

**Imposter:** Mitspieler sehen denselben Namen eines aktiven Fußballers oder einer Legende. Imposter erhalten keinen Namen und keinen Hinweis. Nach dem verdeckten Weiterreichen gibt die Gruppe Hinweise, diskutiert und rät selbst. Die App deckt abschließend die Namen der Imposter auf.

**Bombe:** Eine zufällige Frage erscheint. Die Spieler nennen passende Fußballer und reichen das Handy weiter. Nach genau einer Minute ertönt die Explosion; wer das Handy hält, scheidet aus. Leicht: Vereine oder Nationalitäten, z. B. Barcelona-Spieler. Mittel: Nationalität und Position, z. B. brasilianische Verteidiger. Schwer: Teamkollegen und Karrierewissen, z. B. ehemalige Teamkollegen von Ángel Di María. Aktive Spieler und Legenden sind bei Antworten gleichermaßen erlaubt.

Beim Imposter richtet sich die Schwierigkeit nach Bekanntheit: leicht Weltstars und berühmte Legenden, mittel bekannte Topspieler und Legenden, schwer weniger bekannte Spieler und Kultlegenden. Die Pools sind getrennt, damit bei „schwer“ keine leicht erkennbaren Weltstars zufällig auftauchen.
