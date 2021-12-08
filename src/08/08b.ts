import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const requiredSegments: number[] = [];
requiredSegments[0] = 6;
requiredSegments[1] = 2;
requiredSegments[2] = 5;
requiredSegments[3] = 5;
requiredSegments[4] = 4;
requiredSegments[5] = 5;
requiredSegments[6] = 6;
requiredSegments[7] = 3;
requiredSegments[8] = 7;
requiredSegments[9] = 6;
// uniques are 1,4,7,8

const patterns: string[][] = [];
const outputs: string[][] = [];
let notesLength = 0;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '08', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (line === '') { continue; }
    const [signalPatterns, signalOutputs] = line.split('|');
    patterns[notesLength] = [...signalPatterns.split(' ').filter(x => !!x)];
    outputs[notesLength] = [...signalOutputs.split(' ').filter(x => !!x)];

    notesLength++;
  }
}

loadInputData()
  .then(() => {
    const values: number[] = [];
    patterns.forEach((pattern: string[], noteIndex) => {
      //  aaaa
      // b    c
      // b    c
      //  dddd
      // e    f
      // e    f
      //  gggg

      // 0 - abcefg
      // 1 - cf
      // 2 - acdeg
      // 3 - acdfg
      // 4 - bcdf
      // 5 - abdfg
      // 6 - abdefg
      // 7 - acf
      // 8 - abcdefg

      // observations
      // known - 1, 4, 7, 8
      // a = 7 - 1
      // b,d = 4 - 1
      // e,g = 8 - 7 - 4

      // required wires - numbers they can display
      // 2 - 1
      // 3 - 7
      // 4 - 4
      // 5 - 2,3,5
      // -- always lit - a,d,g (present in all 3 numbers [longest common subsequence]).
      // -- we know which 'a' is, so this lefts us with d,g.
      // -- we know (4-1) gives b,d, so with d,g we know what d is mapped to, and we also know what b and g are mapped to.
      // 6 - 0,6,9
      // -- always lit - a,b,f,g (present in all 3 numbers).
      // -- we know which 'a' is, so this lefts us with b,f,g.
      // -- since previous deduction, we know what g is mapped to, so this lefts us with b,f.
      // -- we know what b is mapped to, so that lefts us knowing f, and thus last, c.
      // 7 - 8

      const [digit1, digit7, digit4, digit8, digit235, digit069] = [
        pattern.find(p => p.length === 2),
        pattern.find(p => p.length === 3),
        pattern.find(p => p.length === 4),
        pattern.find(p => p.length === 7),
        pattern.filter(p => p.length === 5),
        pattern.filter(p => p.length === 6)
      ]

      const alwaysLitIn5 = findSameSegments(digit235);
      const alwaysLitIn6 = findSameSegments(digit069);

      const a = subStr(digit7, digit1);
      const dg = subStr(alwaysLitIn5, a);
      const bd = subStr(digit4, digit1);
      const d = findSameSegments([dg, bd]);
      const g = subStr(dg, d);
      const b = subStr(bd, d);
      const f = subStr(alwaysLitIn6, a + b + g);
      const c = subStr(digit1, f);
      const eg = subStr(subStr(digit8, digit7), digit4);
      const e = subStr(eg, g);

      let digitWires = [
        'abcefg',
        'cf',
        'acdeg',
        'acdfg',
        'bcdf',
        'abdfg',
        'abdefg',
        'acf',
        'abcdefg',
        'abcdfg'];

      const segmap = {
        'a': a,
        'b': b,
        'c': c,
        'd': d,
        'e': e,
        'f': f,
        'g': g
      }
      digitWires = digitWires.map(reqWires => [...reqWires].map(seg => segmap[seg]).sort().join(''));

      let value = '';
      outputs[noteIndex].forEach(digit => {
        value += digitWires.indexOf([...digit].sort().join(''));
      });
      values.push(+value);
    });

    console.log(values.reduce((a, b) => a + b));

  });

function findSameSegments(digits: string[]): string {
  //probably I could have wrote this function in a better way
  const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const counts = new Array<number>(keys.length).fill(0);
  digits.forEach(digit => {
    for (let i = 0; i < digit.length; i++) {
      const index = keys.indexOf(digit.charAt(i));
      counts[index] += 1;
    }
  })
  let ret = '';
  for (let index = 0; index < counts.length; index++) {
    if (counts[index] === digits.length) {
      ret += keys[index];
    }
  }
  return ret;
}

function subStr(str1, str2): string {
  return [...str1].filter(x => ![...str2].includes(x)).join('');
}
