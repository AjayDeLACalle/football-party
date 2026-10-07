import { test } from 'node:test';
import assert from 'node:assert/strict';
import { footballers } from '../src/catalog.ts';
import { footballFacts, hintsFor, positionLabel, positions } from '../src/footballFacts.ts';
import { advanceRound, createImposterRound } from '../src/game.ts';
import { combinations, leagues, nationLabel, selectCombination } from '../src/combinations.ts';
import { defaultAvatar, normalizeAvatar, parseProfiles } from '../src/profiles.ts';

test('every selectable footballer has translated factual hints without revealing his name', () => {
  for (const name of Object.values(footballers).flat()) {
    assert.ok(footballFacts.has(name));
    const hints = hintsFor(name);
    assert.ok(hints.length >= 2);
    for (const hint of hints) {
      for (const language of ['de','en']) {
        assert.ok(hint[language].length > 10);
        assert.ok(!hint[language].includes(name));
      }
    }
  }
});

test('hints default to off and enabling them assigns one shared hint for the entire round', () => {
  assert.equal(createImposterRound(['A','B','C'],1,'easy').hint, undefined);
  for (const difficulty of ['easy','medium','hard']) {
    let round = createImposterRound(['A','B','C','D'],3,difficulty,undefined,() => 0,true);
    assert.ok(hintsFor(round.footballer).some(h => h.de === round.hint.de && h.en === round.hint.en));
    const sharedHint = round.hint;
    for (let seat = 0; seat < 4; seat++) {
      round = advanceRound(advanceRound(advanceRound(round,'reveal'),'hide'),'next');
      assert.equal(round.hint,sharedHint);
    }
  }
});

test('combination pool consists of distinct specific positions in the top five leagues with multiple witnesses', () => {
  assert.ok(combinations.length >= 30);
  assert.equal(new Set(combinations.map(c => c.id)).size, combinations.length);
  assert.deepEqual(new Set(combinations.map(c => c.league)),new Set(leagues));
  for (const combo of combinations) {
    assert.ok(combo.position in positions);
    assert.ok(new Set(combo.examples).size >= 2);
    assert.ok(nationLabel(combo.nation,'de') && nationLabel(combo.nation,'en'));
    for (const language of ['de','en']) assert.ok(positionLabel(combo.position,language).includes(' · '));
  }
  // Career witnesses, not every position a player has ever covered in one match.
  const franceRB = combinations.find(c => c.league === 'Premier League' && c.nation === 'FRA' && c.position === 'RV');
  assert.ok(franceRB.examples.includes('Bacary Sagna'));
  assert.ok(!franceRB.examples.includes('Olivier Giroud'));
  const italyCM = combinations.find(c => c.league === 'Serie A' && c.nation === 'ITA' && c.position === 'ZM');
  assert.ok(!italyCM.examples.includes('Marco Verratti')); // Pescara was Serie B during his career there.
});

test('new combinations exclude the entire prior tuple even with a deterministic random source', () => {
  const first = selectCombination(undefined,() => 0);
  const second = selectCombination(first,() => 0);
  assert.notEqual(first.id,second.id);
  for (const current of combinations) assert.notEqual(selectCombination(current,() => 0).id,current.id);
});

test('stored profiles reject malformed data and normalize missing or unsafe avatar choices', () => {
  for (const raw of [null,'{oops','{}','null','42']) assert.deepEqual(parseProfiles(raw),[]);
  assert.deepEqual(normalizeAvatar(null),defaultAvatar);
  assert.deepEqual(normalizeAvatar({ hair: -1, head: 5, skin: 1.5, jersey: '2', accessory: 6 }),defaultAvatar);
  assert.deepEqual(normalizeAvatar({ hair: 4, head: 4, skin: 4, jersey: 4, accessory: 5 }),{ hair: 4, head: 4, skin: 4, jersey: 4, accessory: 5 });
});

test('device profiles trim names, remove duplicates, cap the team at ten, and round-trip their figures', () => {
  const entries = [null,{name:' '},{name:' Alex ',avatar:{hair:4,accessory:5}},{name:'aLeX'},{name:4},...Array.from({length:15},(_,i)=>({name:`Player ${i}`,avatar:{skin:i%5}}))];
  const profiles = parseProfiles(JSON.stringify(entries));
  assert.equal(profiles.length,10);
  assert.equal(profiles[0].name,'Alex');
  assert.equal(profiles[0].avatar.hair,4);
  assert.equal(profiles[0].avatar.accessory,5);
  assert.deepEqual(parseProfiles(JSON.stringify(profiles)),profiles);
  assert.ok(profiles.every(p => p.name.length <= 20));
});
