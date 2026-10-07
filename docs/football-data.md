# Fußballerdaten

Die Pools sind handverlesen und werden ohne Live-API im Spiel verwendet. Bekanntheit ist eine redaktionelle Einstufung, kein Leistungsranking. Die schwere Stufe enthält aktive Profis der fünf großen europäischen Ligen, keine obskuren Legenden. Vereinszugehörigkeiten sind veränderlich; vor einer Erweiterung aktuelle Kader prüfen.

## Quellen zur schweren Auswahl

Die folgenden Wikipedia-Spielerprofile wurden am 7. Oktober 2026 per HTTPS abgerufen. Club-/Karriereabschnitte belegen Top-5-Liga-Bezug; die drei vom Nutzer genannten Beispiele sind enthalten. Hinweise in der App verwenden bewusst frühere Vereine („hat bei … gespielt“), keine Behauptung über den aktuellen Verein.

- [Arnaud Kalimuendo](https://en.wikipedia.org/wiki/Arnaud_Kalimuendo)
- [Omari Hutchinson](https://en.wikipedia.org/wiki/Omari_Hutchinson)
- [Riccardo Calafiori](https://en.wikipedia.org/wiki/Riccardo_Calafiori)
- [Georginio Rutter](https://en.wikipedia.org/wiki/Georginio_Rutter)
- [Jean-Philippe Mateta](https://en.wikipedia.org/wiki/Jean-Philippe_Mateta)
- [Beto](https://en.wikipedia.org/wiki/Beto_%28footballer%2C_born_1998%29)
- [Loïs Openda](https://en.wikipedia.org/wiki/Lo%C3%AFs_Openda)
- [Jonathan David](https://en.wikipedia.org/wiki/Jonathan_David)
- [Jørgen Strand Larsen](https://en.wikipedia.org/wiki/J%C3%B8rgen_Strand_Larsen)
- [Yankuba Minteh](https://en.wikipedia.org/wiki/Yankuba_Minteh)
- [Dango Ouattara](https://en.wikipedia.org/wiki/Dango_Ouattara)
- [Jacob Ramsey](https://en.wikipedia.org/wiki/Jacob_Ramsey)
- [Maxence Lacroix](https://en.wikipedia.org/wiki/Maxence_Lacroix)
- [Jean-Clair Todibo](https://en.wikipedia.org/wiki/Jean-Clair_Todibo)
- [Malick Thiaw](https://en.wikipedia.org/wiki/Malick_Thiaw)
- [Milos Kerkez](https://en.wikipedia.org/wiki/Milos_Kerkez)
- [Angelo Stiller](https://en.wikipedia.org/wiki/Angelo_Stiller)
- [Deniz Undav](https://en.wikipedia.org/wiki/Deniz_Undav)
- [Chris Führich](https://en.wikipedia.org/wiki/Chris_F%C3%BChrich)
- [Hugo Larsson](https://en.wikipedia.org/wiki/Hugo_Larsson_%28footballer%29)
- [Robin Koch](https://en.wikipedia.org/wiki/Robin_Koch)
- [Waldemar Anton](https://en.wikipedia.org/wiki/Waldemar_Anton)
- [Arthur Theate](https://en.wikipedia.org/wiki/Arthur_Theate)
- [Riccardo Orsolini](https://en.wikipedia.org/wiki/Riccardo_Orsolini)
- [Mattia Zaccagni](https://en.wikipedia.org/wiki/Mattia_Zaccagni)
- [Samuele Ricci](https://en.wikipedia.org/wiki/Samuele_Ricci)
- [Andrea Pinamonti](https://en.wikipedia.org/wiki/Andrea_Pinamonti)
- [Javi Guerra](https://en.wikipedia.org/wiki/Javi_Guerra_%28footballer%2C_born_2003%29)
- [Ayoze Pérez](https://en.wikipedia.org/wiki/Ayoze_Perez)
- [Oihan Sancet](https://en.wikipedia.org/wiki/Oihan_Sancet)
- [Dani Vivian](https://en.wikipedia.org/wiki/Daniel_Vivian)
- [Maghnes Akliouche](https://en.wikipedia.org/wiki/Maghnes_Akliouche)

## Hinweise

`src/footballFacts.ts` enthält je Fußballer einen tatsächlich vertretenen Verein und eine etablierte Rolle. Die Hinweis-Auswahl nutzt Verein, Rolle und (wo vorhanden) die zugehörige Liga. Eine Rolle ist nicht auf einen einzelnen Notfalleinsatz gestützt. Liga- und Vereins-Hinweis sprechen über die Karriere, nicht zwingend die aktuelle Saison. Alle Imposter einer Runde teilen einen Hinweis; ohne aktivierten Hinweis wird keiner erzeugt. Neue Namen erst mit passenden, sachlich geprüften Fakten aufnehmen.

## Kombinationen

`src/combinations.ts` definiert vollständige Liga-Nation-Positions-Tupel mit mehreren konkreten Karrierebeispielen. Keine unabhängig zufällige Mischung, keine Kreuzprodukte sämtlicher Karriere-Ligen und jemals eingesetzter Positionen. Die Beispiele müssen diese Rolle über längere Zeit in dieser Liga gespielt haben. Bei Spielerwechseln zwischen Rollen für jede Liga einzeln prüfen. Beispielspieler sind interne Belege, keine automatische Antwortliste.

Die Nation richtet sich nach der vertretenen Fußball-Nationalmannschaft: Diego Costa zählt beispielsweise für Spanien. Historische Spieler und längst beendete Liga-Aufenthalte sind gültig. Zweifelsfälle wie einen als Notfall-Torwart eingesetzten Stürmer nicht als regulären Torwart hinzufügen.

Bewusst berücksichtigt: Marco Verratti spielte bei Pescara in der Serie B; deshalb ist er kein Beispiel für italienische zentrale Mittelfeldspieler in der Serie A. Kopfform, Name, Verein oder Nationalität allein belegen keine Position. Die automatischen Tests prüfen Struktur, Einzigartigkeit, Sprachdaten und Referenzen; sie ersetzen keine sportliche Faktenprüfung.

Beispielprofile zur manuellen Karriere-/Positionsprüfung:

- [Bacary Sagna](https://en.wikipedia.org/wiki/Bacary_Sagna): Rechtsverteidiger bei Arsenal und Manchester City.
- [Claude Makélélé](https://en.wikipedia.org/wiki/Claude_Mak%C3%A9l%C3%A9l%C3%A9): defensives Mittelfeld bei Chelsea.
- [Paolo Maldini](https://en.wikipedia.org/wiki/Paolo_Maldini): regelmäßige Rollen als Links- und Innenverteidiger bei Milan.
- [Marco Parolo](https://en.wikipedia.org/wiki/Marco_Parolo): zentrales Mittelfeld in der Serie A.

## Pflegegrenzen

Das Spiel akzeptiert Antworten als Gruppenentscheidung, ohne Mikrofon, Spracherkennung oder Serverprüfung. Der Katalog ist keine vollständige Ligadatenbank. Quellen werden nicht beim Spielstart geladen; Änderungen an Quellen ändern keine laufende Runde. Bei Erweiterungen die Rollen und mindestens zwei Beispielspieler je neuer Kombination einzeln prüfen, dann Typprüfung und Spieltests ausführen.
