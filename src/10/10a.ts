import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const brackets: string[] = [];
//  openingBrackets = ['(', '[', '{', '<'];

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


    const scoring = {
      ')': 3,
      ']': 57,
      '}': 1197,
      '>': 25137
    }

    const score = corruptChars.filter(x => !!x).map(x => scoring[x]).reduce((a, b) => (a + b));

    console.log(score);
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
