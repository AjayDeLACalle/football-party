import type { Difficulty, Language } from './lobby';

// Curated prototype pools, ordered by familiarity, not ability or career status.
// Names stay identical in both languages. Full top-five-league coverage is pending.
export const footballers: Record<Difficulty, readonly string[]> = {
  easy: [
    'Lionel Messi', 'Cristiano Ronaldo', 'Kylian Mbappé', 'Erling Haaland',
    'Neymar', 'Mohamed Salah', 'Robert Lewandowski', 'Harry Kane',
    'Vinícius Júnior', 'Jude Bellingham', 'Kevin De Bruyne', 'Antoine Griezmann',
    'Zlatan Ibrahimović', 'Ronaldinho', 'Zinédine Zidane', 'Ronaldo Nazário',
    'Diego Maradona', 'Pelé', 'Thierry Henry', 'David Beckham',
    'Andrés Iniesta', 'Xavi', 'Gianluigi Buffon', 'Iker Casillas',
    'Sergio Ramos', 'Paolo Maldini', 'Roberto Carlos', 'Kaká',
    'Wayne Rooney', 'Luis Suárez', 'Franck Ribéry', 'Arjen Robben',
  ],
  medium: [
    'Paulo Dybala', 'Ángel Di María', 'Bernardo Silva', 'Bruno Fernandes',
    'Martin Ødegaard', 'Lautaro Martínez', 'Victor Osimhen', 'Alexander Isak',
    'Rafael Leão', 'Federico Valverde', 'João Cancelo', 'Alisson Becker',
    'Ederson', 'Achraf Hakimi', 'Nicolò Barella', 'Dani Olmo',
    'Ivan Rakitić', 'David Silva', 'Mesut Özil', 'Wesley Sneijder',
    'Robin van Persie', 'Didier Drogba', 'Samuel Eto’o', 'Fernando Torres',
    'Clarence Seedorf', 'Francesco Totti', 'Alessandro Del Piero', 'Steven Gerrard',
    'Frank Lampard', 'Claude Makélélé', 'Michael Ballack', 'Miroslav Klose',
  ],
  hard: [
    'Pascal Groß', 'Angelo Stiller', 'Robert Andrich', 'Mitchell Weiser',
    'Maximilian Mittelstädt', 'Rocco Reitz', 'Jens Stage', 'Romano Schmid',
    'Morten Hjulmand', 'Lewis Cook', 'Ryan Christie', 'Vitaly Janelt',
    'Daichi Kamada', 'Pape Matar Sarr', 'Yangel Herrera', 'Aleix García',
    'Ayoze Pérez', 'Oihan Sancet', 'Dani Vivian', 'Jon Moncayola',
    'Riccardo Orsolini', 'Mattia Zaccagni', 'Samuele Ricci', 'Andrea Colpani',
    'Gaizka Mendieta', 'Juan Carlos Valerón', 'Diego Tristán', 'Juninho Pernambucano',
    'Guti', 'Alberto Gilardino', 'David Pizarro', 'Youri Djorkaeff',
  ],
};

export type BombQuestion = { id: string; de: string; en: string };
export const bombQuestions: Record<Difficulty, readonly BombQuestion[]> = {
  easy: [
    { id: 'barca', de: 'Nennt Fußballer, die für den FC Barcelona gespielt haben.', en: 'Name footballers who have played for FC Barcelona.' },
    { id: 'real', de: 'Nennt Fußballer, die für Real Madrid gespielt haben.', en: 'Name footballers who have played for Real Madrid.' },
    { id: 'bayern', de: 'Nennt Fußballer, die für Bayern München gespielt haben.', en: 'Name footballers who have played for Bayern Munich.' },
    { id: 'brazil', de: 'Nennt brasilianische Fußballer.', en: 'Name Brazilian footballers.' },
    { id: 'argentina', de: 'Nennt argentinische Fußballer.', en: 'Name Argentinian footballers.' },
    { id: 'france', de: 'Nennt französische Fußballer.', en: 'Name French footballers.' },
    { id: 'germany', de: 'Nennt deutsche Fußballer.', en: 'Name German footballers.' },
    { id: 'strikers', de: 'Nennt Fußballer, die als Stürmer gespielt haben.', en: 'Name footballers who have played as strikers.' },
  ],
  medium: [
    { id: 'brazil-defenders', de: 'Nennt brasilianische Verteidiger.', en: 'Name Brazilian defenders.' },
    { id: 'italy-keepers', de: 'Nennt italienische Torhüter.', en: 'Name Italian goalkeepers.' },
    { id: 'spain-midfield', de: 'Nennt spanische Mittelfeldspieler.', en: 'Name Spanish midfielders.' },
    { id: 'france-strikers', de: 'Nennt französische Stürmer.', en: 'Name French strikers.' },
    { id: 'portugal-midfield', de: 'Nennt portugiesische Mittelfeldspieler.', en: 'Name Portuguese midfielders.' },
    { id: 'dutch-defenders', de: 'Nennt niederländische Verteidiger.', en: 'Name Dutch defenders.' },
    { id: 'argentina-strikers', de: 'Nennt argentinische Stürmer.', en: 'Name Argentinian strikers.' },
    { id: 'germany-keepers', de: 'Nennt deutsche Torhüter.', en: 'Name German goalkeepers.' },
  ],
  hard: [
    { id: 'di-maria', de: 'Nennt Fußballer, die mit Ángel Di María im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Ángel Di María.' },
    { id: 'ibra', de: 'Nennt Fußballer, die mit Zlatan Ibrahimović im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Zlatan Ibrahimović.' },
    { id: 'ozil', de: 'Nennt Fußballer, die mit Mesut Özil im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Mesut Özil.' },
    { id: 'eto', de: 'Nennt Fußballer, die mit Samuel Eto’o im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Samuel Eto’o.' },
    { id: 'torres', de: 'Nennt Fußballer, die mit Fernando Torres im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Fernando Torres.' },
    { id: 'sneijder', de: 'Nennt Fußballer, die mit Wesley Sneijder im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Wesley Sneijder.' },
    { id: 'robben', de: 'Nennt Fußballer, die mit Arjen Robben im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Arjen Robben.' },
    { id: 'seedorf', de: 'Nennt Fußballer, die mit Clarence Seedorf im selben Team gespielt haben.', en: 'Name footballers who have been teammates of Clarence Seedorf.' },
  ],
};

export function questionText(question: BombQuestion, language: Language): string {
  return question[language];
}
