import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceRound, BOMB_DURATION_MS, createImposterRound, pick, remainingSeconds, selectQuestion } from '../src/game.ts';
import { bombQuestions, footballers } from '../src/catalog.ts';

test('one to three imposters have distinct valid seats for every supported team', () => {
  for (let size = 3; size <= 10; size++) {
    for (let count = 1; count <= Math.min(3, size - 1); count++) {
      const players = Array.from({ length: size }, (_, i) => `Player ${i}`);
      const round = createImposterRound(players, count, 'easy');
      assert.equal(new Set(round.imposters).size, count);
      assert.ok(round.imposters.every(index => index >= 0 && index < size));
      assert.equal(round.revealed, false);
      assert.ok(footballers.easy.includes(round.footballer));
      assert.notEqual(round.players, players);
    }
  }
});

test('invalid configurations cannot start a round', () => {
  assert.throws(() => createImposterRound(['A', 'B'], 1, 'easy'));
  assert.throws(() => createImposterRound(['A', 'B', 'C'], 3, 'easy'));
  assert.throws(() => createImposterRound(['A', 'B', 'C'], 0, 'easy'));
});

test('you must see and then cover the role before advancing', () => {
  const round = createImposterRound(['A', 'B', 'C'], 1, 'easy');
  assert.equal(advanceRound(round, 'next'), round);
  const shown = advanceRound(round, 'reveal');
  assert.equal(advanceRound(shown, 'next'), shown);
  const next = advanceRound(advanceRound(shown, 'hide'), 'next');
  assert.equal(next.current, 1);
  assert.equal(next.revealed, false);
  assert.equal(next.hasSeen, false);
  assert.equal(advanceRound(next, 'next'), next);
});

test('dealing all cards ends in group discussion with roles unchanged', () => {
  let round = createImposterRound(['A', 'B', 'C', 'D'], 3, 'hard');
  const assigned = [...round.imposters];
  for (let i = 0; i < 4; i++) {
    round = advanceRound(advanceRound(advanceRound(round, 'reveal'), 'hide'), 'next');
  }
  assert.equal(round.phase, 'discussion');
  assert.deepEqual(round.imposters, assigned);
  assert.equal(round.players.length, 4);
  assert.equal(advanceRound(round, 'next'), round);
  assert.equal(advanceRound(round, 'unmask').phase, 'result');
});

test('unmasking is unavailable until everyone has seen their role', () => {
  const round = createImposterRound(['A', 'B', 'C'], 1, 'medium');
  assert.equal(advanceRound(round, 'unmask'), round);
});

test('replay selects a fresh footballer from the chosen difficulty', () => {
  const first = createImposterRound(['A', 'B', 'C'], 1, 'hard', undefined, () => 0);
  const next = createImposterRound(first.players, 1, 'hard', first.footballer, () => 0);
  assert.notEqual(first.footballer, next.footballer);
  assert.ok(footballers.hard.includes(next.footballer));
  assert.equal(next.phase, 'deal');
  assert.equal(next.current, 0);
});

test('all name pools are nonempty, unique and separate by familiarity', () => {
  const all = Object.values(footballers).flat();
  assert.equal(all.length, 96);
  assert.equal(new Set(all).size, all.length);
  assert.ok(footballers.easy.includes('Lionel Messi'));
  assert.ok(footballers.easy.includes('Pelé'));
  for (const name of ['Arnaud Kalimuendo', 'Omari Hutchinson', 'Riccardo Calafiori']) assert.ok(footballers.hard.includes(name));
  assert.ok(!footballers.hard.includes('Youri Djorkaeff'));
});

test('bomb has a translated question pool for every difficulty', () => {
  for (const difficulty of ['easy', 'medium', 'hard']) {
    for (const question of bombQuestions[difficulty]) {
      assert.ok(question.de.length > 10 && question.en.length > 10);
    }
    assert.ok(bombQuestions[difficulty].includes(selectQuestion(difficulty)));
  }
  assert.equal(bombQuestions.easy[0].id, 'barca');
  assert.equal(bombQuestions.medium[0].id, 'brazil-defenders');
  assert.equal(bombQuestions.hard[0].id, 'di-maria');
});

test('bomb replay chooses a different question', () => {
  const first = selectQuestion('hard', undefined, () => 0);
  assert.notEqual(selectQuestion('hard', first, () => 0).id, first.id);
});

test('bomb lasts exactly a minute and expires correctly after a delayed callback', () => {
  const start = 100_000;
  const deadline = start + BOMB_DURATION_MS;
  assert.equal(BOMB_DURATION_MS, 60_000);
  assert.equal(remainingSeconds(deadline, start), 60);
  assert.equal(remainingSeconds(deadline, start + 59_999), 1);
  assert.equal(remainingSeconds(deadline, start + 60_000), 0);
  assert.equal(remainingSeconds(deadline, start + 90_000), 0);
});

test('a selection cannot return its immediately preceding item', () => {
  assert.equal(pick(['A', 'B'], () => 0, 'A'), 'B');
});
