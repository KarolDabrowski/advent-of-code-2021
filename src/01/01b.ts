import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const depths: number[] = [];
const threeSums: number[] = [];

let numberOfTimesDepthMeasurmentIncreased = 0;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '01', 'input.txt'), { encoding: 'utf-8' });

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,

  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    depths.push(+line);
    // console.log(`Line from file: ${line}`);
  }
  // console.log(depths.length);
}


loadInputData()
  .then(() => {

    for (let index = 0; index < depths.length - 2; index++) {
      const element1 = depths[index];
      const element2 = depths[index + 1];
      const element3 = depths[index + 2];
      threeSums.push(element1 + element2 + element3);
    }

    threeSums.reduce((a, b) => {
      if (a - b < 0) {
        numberOfTimesDepthMeasurmentIncreased++;
      }
      return b;
    })
    console.log(numberOfTimesDepthMeasurmentIncreased);
  });
