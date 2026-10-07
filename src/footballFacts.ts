import type { Language } from './lobby';

export const positions = {
  TW: ['Torwart', 'Goalkeeper', 'GK'], RV: ['Rechtsverteidiger', 'Right-back', 'RB'],
  IV: ['Innenverteidiger', 'Centre-back', 'CB'], LV: ['Linksverteidiger', 'Left-back', 'LB'],
  ZDM: ['Defensives Mittelfeld', 'Defensive midfielder', 'CDM'], ZM: ['Zentrales Mittelfeld', 'Central midfielder', 'CM'],
  ZOM: ['Offensives Mittelfeld', 'Attacking midfielder', 'CAM'], RA: ['Rechtsaußen', 'Right winger', 'RW'],
  LA: ['Linksaußen', 'Left winger', 'LW'], ST: ['Stürmer', 'Striker', 'ST'],
} as const;
export type Position = keyof typeof positions;
export type Hint = { de: string; en: string };
export function positionLabel(position: Position, language: Language) {
  const info = positions[position];
  return `${language === 'de' ? position : info[2]} · ${info[language === 'de' ? 0 : 1]}`;
}

// Historical clubs and established roles, deliberately independent of live transfers.
// A club hint means "has played for", never "currently plays for".
const rows: [string, string, Position][] = [
  ['Lionel Messi','FC Barcelona','RA'], ['Cristiano Ronaldo','Real Madrid','ST'],
  ['Kylian Mbappé','Paris Saint-Germain','ST'], ['Erling Haaland','Borussia Dortmund','ST'],
  ['Neymar','FC Barcelona','LA'], ['Mohamed Salah','Liverpool','RA'],
  ['Robert Lewandowski','Bayern München','ST'], ['Harry Kane','Tottenham Hotspur','ST'],
  ['Vinícius Júnior','Real Madrid','LA'], ['Jude Bellingham','Borussia Dortmund','ZM'],
  ['Kevin De Bruyne','Manchester City','ZM'], ['Antoine Griezmann','Atlético Madrid','ST'],
  ['Zlatan Ibrahimović','AC Milan','ST'], ['Ronaldinho','FC Barcelona','ZOM'],
  ['Zinédine Zidane','Real Madrid','ZOM'], ['Ronaldo Nazário','Inter Milan','ST'],
  ['Diego Maradona','SSC Napoli','ZOM'], ['Pelé','Santos FC','ST'],
  ['Thierry Henry','Arsenal','ST'], ['David Beckham','Real Madrid','ZM'],
  ['Andrés Iniesta','FC Barcelona','ZM'], ['Xavi','FC Barcelona','ZM'],
  ['Gianluigi Buffon','Juventus','TW'], ['Iker Casillas','Real Madrid','TW'],
  ['Sergio Ramos','Real Madrid','IV'], ['Paolo Maldini','AC Milan','IV'],
  ['Roberto Carlos','Real Madrid','LV'], ['Kaká','AC Milan','ZOM'],
  ['Wayne Rooney','Manchester United','ST'], ['Luis Suárez','FC Barcelona','ST'],
  ['Franck Ribéry','Bayern München','LA'], ['Arjen Robben','Bayern München','RA'],
  ['Paulo Dybala','Juventus','ST'], ['Ángel Di María','Paris Saint-Germain','RA'],
  ['Bernardo Silva','Manchester City','RA'], ['Bruno Fernandes','Manchester United','ZOM'],
  ['Martin Ødegaard','Arsenal','ZOM'], ['Lautaro Martínez','Inter Milan','ST'],
  ['Victor Osimhen','SSC Napoli','ST'], ['Alexander Isak','Real Sociedad','ST'],
  ['Rafael Leão','AC Milan','LA'], ['Federico Valverde','Real Madrid','ZM'],
  ['João Cancelo','Manchester City','RV'], ['Alisson Becker','Liverpool','TW'],
  ['Ederson','Manchester City','TW'], ['Achraf Hakimi','Paris Saint-Germain','RV'],
  ['Nicolò Barella','Inter Milan','ZM'], ['Dani Olmo','RB Leipzig','ZOM'],
  ['Ivan Rakitić','FC Barcelona','ZM'], ['David Silva','Manchester City','ZOM'],
  ['Mesut Özil','Arsenal','ZOM'], ['Wesley Sneijder','Inter Milan','ZOM'],
  ['Robin van Persie','Arsenal','ST'], ['Didier Drogba','Chelsea','ST'],
  ['Samuel Eto’o','FC Barcelona','ST'], ['Fernando Torres','Liverpool','ST'],
  ['Clarence Seedorf','AC Milan','ZM'], ['Francesco Totti','AS Roma','ZOM'],
  ['Alessandro Del Piero','Juventus','ST'], ['Steven Gerrard','Liverpool','ZM'],
  ['Frank Lampard','Chelsea','ZM'], ['Claude Makélélé','Chelsea','ZDM'],
  ['Michael Ballack','Bayern München','ZM'], ['Miroslav Klose','Lazio','ST'],
  ['Arnaud Kalimuendo','Stade Rennes','ST'], ['Omari Hutchinson','Ipswich Town','RA'],
  ['Riccardo Calafiori','Bologna','IV'], ['Georginio Rutter','Brighton & Hove Albion','ZOM'],
  ['Jean-Philippe Mateta','Crystal Palace','ST'], ['Beto','Everton','ST'],
  ['Loïs Openda','RB Leipzig','ST'], ['Jonathan David','Lille OSC','ST'],
  ['Jørgen Strand Larsen','Celta Vigo','ST'], ['Yankuba Minteh','Brighton & Hove Albion','RA'],
  ['Dango Ouattara','AFC Bournemouth','RA'], ['Jacob Ramsey','Aston Villa','ZM'],
  ['Maxence Lacroix','VfL Wolfsburg','IV'], ['Jean-Clair Todibo','OGC Nice','IV'],
  ['Malick Thiaw','AC Milan','IV'], ['Milos Kerkez','AFC Bournemouth','LV'],
  ['Angelo Stiller','VfB Stuttgart','ZDM'], ['Deniz Undav','VfB Stuttgart','ST'],
  ['Chris Führich','VfB Stuttgart','LA'], ['Hugo Larsson','Eintracht Frankfurt','ZM'],
  ['Robin Koch','Eintracht Frankfurt','IV'], ['Waldemar Anton','VfB Stuttgart','IV'],
  ['Arthur Theate','Bologna','IV'], ['Riccardo Orsolini','Bologna','RA'],
  ['Mattia Zaccagni','Lazio','LA'], ['Samuele Ricci','Torino','ZDM'],
  ['Andrea Pinamonti','Sassuolo','ST'], ['Javi Guerra','Valencia CF','ZM'],
  ['Ayoze Pérez','Leicester City','ST'], ['Oihan Sancet','Athletic Club','ZOM'],
  ['Dani Vivian','Athletic Club','IV'], ['Maghnes Akliouche','AS Monaco','RA'],
];
export const footballFacts = new Map(rows.map(([name, club, position]) => [name, { club, position }]));
const clubLeagues: Record<string, string> = {};
for (const [league, clubs] of Object.entries({
  'La Liga': ['FC Barcelona', 'Real Madrid', 'Atlético Madrid', 'Real Sociedad', 'Valencia CF', 'Athletic Club'],
  'Premier League': ['Liverpool', 'Tottenham Hotspur', 'Manchester City', 'Arsenal', 'Manchester United', 'Chelsea', 'Ipswich Town', 'Brighton & Hove Albion', 'Crystal Palace', 'Everton', 'AFC Bournemouth', 'Aston Villa', 'Leicester City'],
  'Bundesliga': ['Borussia Dortmund', 'Bayern München', 'RB Leipzig', 'VfL Wolfsburg', 'VfB Stuttgart', 'Eintracht Frankfurt'],
  'Serie A': ['AC Milan', 'Inter Milan', 'SSC Napoli', 'Juventus', 'AS Roma', 'Lazio', 'Bologna', 'Torino', 'Sassuolo'],
  'Ligue 1': ['Paris Saint-Germain', 'Stade Rennes', 'Lille OSC', 'OGC Nice', 'AS Monaco'],
})) for (const club of clubs) clubLeagues[club] = league;
export function hintsFor(name: string): readonly Hint[] {
  const fact = footballFacts.get(name);
  if (!fact) throw new Error(`Missing hints for ${name}`);
  const hints: Hint[] = [
    { de: `Hat bei ${fact.club} gespielt.`, en: `Has played for ${fact.club}.` },
    { de: `Eine seiner Rollen: ${positionLabel(fact.position, 'de')}.`, en: `One of his roles: ${positionLabel(fact.position, 'en')}.` },
  ];
  if (clubLeagues[fact.club]) hints.push({ de: `Hat in der ${clubLeagues[fact.club]} gespielt.`, en: `Has played in ${clubLeagues[fact.club]}.` });
  return hints;
}
