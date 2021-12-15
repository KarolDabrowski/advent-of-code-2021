import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';


let polymer: string;
const insertionRules = {};

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '14', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineIndex = 0;

  for await (const line of rl) {
    if (lineIndex === 0) {
      polymer = line;
      lineIndex++;
      continue;
    }
    if (line === '') {
      lineIndex++;
      continue;
    }
    const [pair, insertion] = line.split('->');
    insertionRules[pair.trim()] = insertion.trim();
    lineIndex++;
  };

}

loadInputData()
  .then(() => {
    let steps = 10;

    while (steps--) {
      let newPolymer = '';
      for (let index = 0; index < polymer.length - 1; index++) {
        let pair = polymer[index] + polymer[index + 1];
        if (insertionRules[pair]) {
          pair = polymer[index] + insertionRules[pair];
        }
        newPolymer += pair;
        if (index === polymer.length - 2) {
          newPolymer += polymer[index + 1];
        }
      }
      polymer = newPolymer;
    }

    //countstats
    const polymerStats = {};
    for (let index = 0; index < polymer.length; index++) {
      if (Number.isInteger(polymerStats[polymer[index]])) {
        polymerStats[polymer[index]] += 1;
        continue;
      }
      polymerStats[polymer[index]] = 0;
    }

    const statsArray: number[] = Object.values(polymerStats);
    console.log(Math.max(...statsArray) - Math.min(...statsArray));
  });
