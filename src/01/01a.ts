import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const depths: number[] = [];
let numberOfTimesDepthMeasurmentIncreased = 0;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '01', 'input.txt'));

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
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
    depths.reduce((a, b) => {
      if (a - b < 0) {
        numberOfTimesDepthMeasurmentIncreased++;
      }
      return b;
    })
    console.log(numberOfTimesDepthMeasurmentIncreased);
  });
