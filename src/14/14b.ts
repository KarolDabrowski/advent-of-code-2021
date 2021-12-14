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
    let steps = 40;

    // cat inputfile | sed 's/\(.\)/\1\n/g' | sort | uniq -c
    // this command ran on both input files shows statistics unique letter count
    // It can be concluded then that every letter has a combination with each other
    // so 4 letters => 16 combinations in two places (4^2) aka insertion rules
    // 10 letter in big input => 10^2 = 100 insertion rules, exactly insertion rules count in input
    // So this means every pair will grow at least once in each step, there is no pair which wont grow

    let polymerPairCount = {};
    const lettersCount = {};

    for (let index = 0; index < polymer.length - 1; index++) {
      const pair = polymer[index] + polymer[index + 1];
      if (Number.isInteger(polymerPairCount[pair])) {
        polymerPairCount[pair] += 1;
        continue;
      }
      polymerPairCount[pair] = 1;
    }

    [...polymer].forEach(x => lettersCount[x] = Number.isInteger(lettersCount[x]) ? lettersCount[x] + 1 : 1);

    while (steps--) {
      const newPolymerPairCount = {};

      for (const [pair, count] of Object.entries(polymerPairCount)) {
        const insertionLetter = insertionRules[pair];

        lettersCount[insertionLetter] = Number.isInteger(lettersCount[insertionLetter])
          ? lettersCount[insertionLetter] + count : count;

        const newPairLeft = pair[0] + insertionLetter;
        const newPairRight = insertionLetter + pair[1];

        newPolymerPairCount[newPairLeft] = Number.isInteger(newPolymerPairCount[newPairLeft])
          ? newPolymerPairCount[newPairLeft] + count : count;

        newPolymerPairCount[newPairRight] = Number.isInteger(newPolymerPairCount[newPairRight])
          ? newPolymerPairCount[newPairRight] + count : count;
      }

      polymerPairCount = newPolymerPairCount;
    }

    console.log(lettersCount);
    const statsArray: number[] = Object.values(lettersCount);
    console.log(Math.max(...statsArray) - Math.min(...statsArray));
  });
