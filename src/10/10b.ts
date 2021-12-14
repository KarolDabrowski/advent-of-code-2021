import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const brackets: string[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '10', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    brackets.push(line)
  }
}

loadInputData()
  .then(() => {

    const corruptChars: string[] = [];
    brackets.forEach(line => {
      corruptChars.push(findFirstCorruptedBracket(line));
    });

    const incomplete = brackets.filter((_x, i) => corruptChars[i] === '');

    const scoring = {
      ')': 1,
      ']': 2,
      '}': 3,
      '>': 4
    }
    let scores: number[] = [];
    const closures: string[] = [];

    incomplete.forEach(x => closures.push(findClosingSequence(x)));

    scores = closures.map(x => [...x]).map(x => x.map(y => scoring[y])).map(x => x.reduce((a, b) => a * 5 + b, 0));
    console.log(scores.sort((a, b) => a - b).at(Math.floor(scores.length / 2)));
  });


function findFirstCorruptedBracket(line: string): string {
  const stack: string[] = [];

  for (let i = 0; i < line.length; i++) {
    const x = line[i];

    if (x == '(' || x == '[' || x == '{' || x == '<') {
      stack.push(x);
      continue;
    }

    let check: string;
    switch (x) {
      case ')':
        check = stack.pop();
        if (check == '{' || check == '[' || check == '<')
          return x;
        break;

      case '}':
        check = stack.pop();
        if (check == '(' || check == '[' || check == '<')
          return x;
        break;

      case ']':
        check = stack.pop();
        if (check == '(' || check == '{' || check == '<')
          return x;
        break;

      case '>':
        check = stack.pop();
        if (check == '(' || check == '{' || check == '[')
          return x;
        break;

    }
  }

  return ('');
}

function findClosingSequence(line: string): string {
  const openings = ['(', '{', '[', '<'];
  const endings = [')', '}', ']', '>'];

  const stack: string[] = [];

  for (let i = 0; i < line.length; i++) {
    const x = line[i];

    if (openings.includes(x)) {
      stack.push(x);
      continue;
    }

    if (endings.includes(x)) {
      stack.pop();
    }
  }

  return stack.map(x => endings[openings.indexOf(x)]).reverse().join('');
}
