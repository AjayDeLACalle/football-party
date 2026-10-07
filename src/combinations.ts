import type { Language } from './lobby';
import type { Position } from './footballFacts';

export const leagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'] as const;
export type League = typeof leagues[number];
const nations = {
  FRA: ['Frankreich', 'France', '🇫🇷'], ESP: ['Spanien', 'Spain', '🇪🇸'], GER: ['Deutschland', 'Germany', '🇩🇪'],
  ITA: ['Italien', 'Italy', '🇮🇹'], BRA: ['Brasilien', 'Brazil', '🇧🇷'], ARG: ['Argentinien', 'Argentina', '🇦🇷'],
  ENG: ['England', 'England', '🏴'], NED: ['Niederlande', 'Netherlands', '🇳🇱'], POR: ['Portugal', 'Portugal', '🇵🇹'],
  URU: ['Uruguay', 'Uruguay', '🇺🇾'], DEN: ['Dänemark', 'Denmark', '🇩🇰'],
} as const;
export type Nation = keyof typeof nations;
export type Combination = { id: string; league: League; nation: Nation; position: Position; examples: readonly string[] };

// Each tuple has multiple curated witnesses with sustained roles in that league.
// Never build arbitrary league × nation × position products. Historical careers count.
// These witnesses establish solvability; the app does not limit or judge answers.
const rows: [League, Nation, Position, string[]][] = [
  ['Premier League','FRA','IV',['William Saliba','Ibrahima Konaté','William Gallas']],
  ['Premier League','FRA','RV',['Bacary Sagna','Mathieu Debuchy','Pascal Chimbonda']],
  ['Premier League','FRA','ZDM',['Claude Makélélé','N’Golo Kanté','Lassana Diarra']],
  ['Premier League','FRA','ST',['Thierry Henry','Olivier Giroud','Jean-Philippe Mateta']],
  ['Premier League','ENG','ST',['Harry Kane','Wayne Rooney','Alan Shearer']],
  ['Premier League','ENG','IV',['John Terry','Rio Ferdinand','John Stones']],
  ['Premier League','ENG','RV',['Kyle Walker','Gary Neville','Trent Alexander-Arnold']],
  ['Premier League','ENG','ZM',['Steven Gerrard','Frank Lampard','Paul Scholes']],
  ['Premier League','ESP','TW',['David de Gea','Pepe Reina','Kepa Arrizabalaga']],
  ['Premier League','ESP','ST',['Fernando Torres','Diego Costa','Álvaro Morata']],
  ['Premier League','BRA','TW',['Alisson Becker','Ederson','Heurelho Gomes']],
  ['Premier League','NED','IV',['Virgil van Dijk','Jaap Stam','Nathan Aké']],
  ['Premier League','NED','ST',['Robin van Persie','Ruud van Nistelrooy','Dennis Bergkamp']],
  ['Premier League','POR','RV',['João Cancelo','Ricardo Pereira','José Bosingwa']],
  ['Premier League','DEN','ZDM',['Pierre-Emile Højbjerg','Christian Nørgaard']],
  ['Premier League','ARG','ST',['Sergio Agüero','Carlos Tévez','Hernán Crespo']],
  ['La Liga','ESP','IV',['Sergio Ramos','Carles Puyol','Gerard Piqué']],
  ['La Liga','ESP','RV',['Dani Carvajal','Jesús Navas','Juanfran']],
  ['La Liga','ESP','LV',['Jordi Alba','Joan Capdevila','José Gayà']],
  ['La Liga','ESP','ZM',['Xavi','Andrés Iniesta','Santi Cazorla']],
  ['La Liga','ESP','ZDM',['Sergio Busquets','Xabi Alonso','Rodri']],
  ['La Liga','ESP','TW',['Iker Casillas','Víctor Valdés','Unai Simón']],
  ['La Liga','BRA','LA',['Neymar','Vinícius Júnior','Robinho']],
  ['La Liga','BRA','LV',['Roberto Carlos','Marcelo','Filipe Luís']],
  ['La Liga','BRA','RV',['Dani Alves','Danilo','Emerson Royal']],
  ['La Liga','ARG','ST',['Sergio Agüero','Gonzalo Higuaín','Diego Milito']],
  ['La Liga','FRA','ST',['Karim Benzema','Antoine Griezmann','Kylian Mbappé']],
  ['La Liga','GER','ZM',['Toni Kroos','İlkay Gündoğan']],
  ['La Liga','NED','ZM',['Frenkie de Jong','Clarence Seedorf']],
  ['La Liga','URU','ST',['Luis Suárez','Diego Forlán','Edinson Cavani']],
  ['Bundesliga','GER','TW',['Manuel Neuer','Oliver Kahn','Marc-André ter Stegen']],
  ['Bundesliga','GER','IV',['Mats Hummels','Jérôme Boateng','Nico Schlotterbeck']],
  ['Bundesliga','GER','LV',['Jonas Hector','Marcel Schmelzer','Maximilian Mittelstädt']],
  ['Bundesliga','GER','ZM',['Michael Ballack','Leon Goretzka','İlkay Gündoğan']],
  ['Bundesliga','GER','ZDM',['Sven Bender','Sebastian Kehl','Angelo Stiller']],
  ['Bundesliga','GER','ST',['Miroslav Klose','Mario Gómez','Deniz Undav']],
  ['Bundesliga','FRA','ST',['Anthony Modeste','Marcus Thuram','Jean-Philippe Mateta']],
  ['Bundesliga','FRA','IV',['Dayot Upamecano','Ibrahima Konaté','Maxence Lacroix']],
  ['Bundesliga','BRA','IV',['Lúcio','Dante','Naldo']],
  ['Bundesliga','NED','ST',['Klaas-Jan Huntelaar','Roy Makaay','Bas Dost']],
  ['Serie A','ITA','TW',['Gianluigi Buffon','Gianluigi Donnarumma','Francesco Toldo']],
  ['Serie A','ITA','IV',['Alessandro Nesta','Fabio Cannavaro','Giorgio Chiellini']],
  ['Serie A','ITA','LV',['Paolo Maldini','Fabio Grosso','Gianluca Zambrotta']],
  ['Serie A','ITA','RV',['Gianluca Zambrotta','Christian Panucci','Giovanni Di Lorenzo']],
  ['Serie A','ITA','ZM',['Nicolò Barella','Claudio Marchisio','Marco Parolo']],
  ['Serie A','ITA','ST',['Filippo Inzaghi','Christian Vieri','Luca Toni']],
  ['Serie A','ARG','ST',['Gabriel Batistuta','Hernán Crespo','Lautaro Martínez']],
  ['Serie A','BRA','ST',['Ronaldo Nazário','Adriano','Alexandre Pato']],
  ['Serie A','FRA','ST',['David Trezeguet','Olivier Giroud','Marcus Thuram']],
  ['Serie A','NED','ZM',['Clarence Seedorf','Edgar Davids']],
  ['Ligue 1','FRA','ST',['Kylian Mbappé','Karim Benzema','Arnaud Kalimuendo']],
  ['Ligue 1','FRA','IV',['Raphaël Varane','Presnel Kimpembe','Jean-Clair Todibo']],
  ['Ligue 1','FRA','TW',['Hugo Lloris','Steve Mandanda','Mike Maignan']],
  ['Ligue 1','BRA','IV',['Marquinhos','Thiago Silva','Dante']],
  ['Ligue 1','ARG','RA',['Ángel Di María','Lionel Messi']],
  ['Ligue 1','ITA','TW',['Gianluigi Donnarumma','Gianluigi Buffon','Salvatore Sirigu']],
];
export const combinations: readonly Combination[] = rows.map(([league, nation, position, examples]) => ({
  id: `${league}-${nation}-${position}`, league, nation, position, examples,
}));
export function nationLabel(nation: Nation, language: Language) { return nations[nation][language === 'de' ? 0 : 1]; }
export function nationFlag(nation: Nation) { return nations[nation][2]; }
export function selectCombination(previous?: Combination, random = Math.random): Combination {
  const choices = combinations.filter(item => item.id !== previous?.id);
  return choices[Math.floor(random() * choices.length)];
}
