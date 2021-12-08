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

const patterns: string[] = [];
const outputs: string[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '08', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (line === '') { continue; }
    const [signalPatterns, signalOutputs] = line.split('|');
    patterns.push(signalPatterns);
    outputs.push(...signalOutputs.split(' ').filter(x => !!x));
  }
}

loadInputData()
  .then(() => {

    console.log(outputs.filter(x => [requiredSegments[1], requiredSegments[4], requiredSegments[7], requiredSegments[8]].includes(x.length)).length);

  });
