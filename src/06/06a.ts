import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

let fishes: number[] = [];
const restartLifespan = 6;
const newbornLifespan = 8;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '06', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    fishes = line.split(',').map(x => +x);
  }
}

loadInputData()
  .then(() => {
    const periodInDays = 80;

    for (let index = 0; index < periodInDays; index++) {
      const fishesAfterOneDay: number[] = [];
      fishes.forEach(x => {
        if (x > 0) {
          fishesAfterOneDay.push(x - 1);
          return;
        }
        if (x === 0) {
          fishesAfterOneDay.push(restartLifespan);
          fishesAfterOneDay.push(newbornLifespan);
          return;
        }
      })
      fishes = fishesAfterOneDay;
    }

    console.log(`After ${periodInDays} days, there is a total of ${fishes.length} lanternfishes nearby.`);
  });
