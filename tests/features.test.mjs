import { test } from 'node:test';
import assert from 'node:assert/strict';
import { footballers } from '../src/catalog.ts';
import { footballFacts, hintsFor, positionLabel, positions } from '../src/footballFacts.ts';
import { advanceRound, createImposterRound } from '../src/game.ts';
import { combinations, leagues, nationLabel, selectCombination } from '../src/combinations.ts';
import { CHARACTER_COUNT, defaultAvatar, normalizeAvatar, parseProfiles, randomAvatar } from '../src/profiles.ts';

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
      round = advanceRound(advanceRound(advanceRound(advanceRound(round,'deal'),'reveal'),'hide'),'next');
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

test('stored random characters reject malformed data and normalize unsafe choices', () => {
  for (const raw of [null,'{oops','{}','null','42']) assert.deepEqual(parseProfiles(raw),[]);
  assert.deepEqual(normalizeAvatar(null),defaultAvatar);
  for (const value of [-1,12,1.5,'2']) assert.deepEqual(normalizeAvatar({character:value}),defaultAvatar);
  assert.deepEqual(normalizeAvatar({character:11}),{character:11});
});

test('new random characters avoid duplicates for the complete ten-player team', () => {
  const avatars=[];
  for(let seat=0;seat<10;seat++) avatars.push(randomAvatar(avatars,()=>0));
  assert.equal(new Set(avatars.map(a=>a.character)).size,10);
  assert.ok(avatars.every(a=>a.character>=0 && a.character<CHARACTER_COUNT));
  assert.ok(randomAvatar(avatars,()=>0.99).character<CHARACTER_COUNT);
});

test('old names survive the character-builder migration and new characters persist', () => {
  const entries = [null,{name:' '},{name:' Alex ',avatar:{hair:4,accessory:5}},{name:'aLeX'},{name:4},...Array.from({length:15},(_,i)=>({name:`Player ${i}`,avatar:{skin:i%5}}))];
  const profiles = parseProfiles(JSON.stringify(entries),()=>0);
  assert.equal(profiles.length,10);
  assert.equal(profiles[0].name,'Alex');
  assert.equal(new Set(profiles.map(p=>p.avatar.character)).size,10);
  assert.deepEqual(parseProfiles(JSON.stringify(profiles)),profiles);
  assert.ok(profiles.every(p=>p.name.length<=20));
});

test('drawing a card blocks hand-off and hiding invalidates a late reveal completion', () => {
  let round=createImposterRound(['A','B','C'],1,'easy');
  assert.equal(advanceRound(round,'reveal'),round);
  round=advanceRound(round,'deal');
  assert.equal(round.dealing,true);
  assert.equal(round.hasSeen,false);
  assert.equal(advanceRound(round,'next'),round);
  const cancelled=advanceRound(round,'hide');
  assert.equal(cancelled.coverToken,round.coverToken+1);
  assert.equal(cancelled.dealing,false);
  assert.equal(advanceRound(cancelled,'reveal'),cancelled);
  assert.equal(advanceRound(cancelled,'next'),cancelled);
  const shown=advanceRound(advanceRound(cancelled,'deal'),'reveal');
  assert.equal(shown.hasSeen,true);
  assert.equal(shown.revealed,true);
});

test('group start can choose every supported seat and both directions independently of roles', async () => {
  const { selectGroupStart } = await import('../src/game.ts');
  for (let count=3;count<=10;count++) {
    for (let seat=0;seat<count;seat++) {
      for (const clockwise of [true,false]) {
        const values=[(seat+0.5)/count,clockwise ? 0 : 0.99999];
        const result=selectGroupStart(count,()=>values.shift());
        assert.deepEqual(result,{playerIndex:seat,clockwise});
      }
    }
  }
  for (const count of [0,2,11,3.5]) assert.throws(()=>selectGroupStart(count));
});

test('six recent footballers and bomb questions are excluded during repeat rounds', async () => {
  const { selectQuestion } = await import('../src/game.ts');
  for (const difficulty of ['easy','medium','hard']) {
    let recent=[],questions=[];
    for(let turn=0;turn<20;turn++) {
      const round=createImposterRound(['A','B','C'],1,difficulty,recent,()=>0);
      assert.ok(!recent.includes(round.footballer));
      recent=[...recent.slice(-5),round.footballer];
      const question=selectQuestion(difficulty,questions.at(-1),()=>0,questions);
      assert.ok(!questions.includes(question));
      questions=[...questions.slice(-5),question];
    }
  }
});

test('combination reveal stages follow the same three-second deadline after delayed callbacks', async () => {
  const { comboRevealStep,COMBO_REVEAL_MS } = await import('../src/comboReveal.ts');
  assert.equal(COMBO_REVEAL_MS,3000);
  for (const [elapsed,stage] of [[-1000,0],[0,1],[999,1],[1000,2],[1999,2],[2000,3],[3000,3],[60000,3]]) assert.equal(comboRevealStep(elapsed),stage);
});
