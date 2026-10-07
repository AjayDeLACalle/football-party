import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxImposters, validateName, MAX_PLAYERS } from '../src/lobby.ts';

test('up to three imposters leave at least one player who knows the name', () => {
  for (let count = 3; count <= MAX_PLAYERS; count++) {
    const imposters = maxImposters(count);
    assert.ok(imposters >= 1 && imposters <= 3);
    assert.ok(imposters < count);
  }
  assert.equal(maxImposters(3), 2);
  assert.equal(maxImposters(4), 3);
  assert.equal(maxImposters(10), 3);
});

test('empty and whitespace-only names are rejected', () => {
  assert.equal(validateName('', []), 'empty');
  assert.equal(validateName('   ', []), 'empty');
});

test('duplicate names are rejected regardless of case or surrounding whitespace', () => {
  assert.equal(validateName('  aJAY ', ['Ajay']), 'duplicate');
});

test('different names and names with accents are accepted', () => {
  assert.equal(validateName('Jérémy', ['Ajay']), null);
});

test('a team accepts its tenth player but rejects an eleventh', () => {
  const players = Array.from({ length: 10 }, (_, i) => `Player ${i + 1}`);
  assert.equal(validateName('Last player', players.slice(0, 9)), null);
  assert.equal(validateName('Extra player', players), 'full');
});
