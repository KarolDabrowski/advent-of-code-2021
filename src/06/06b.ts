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
    const periodInDays = 256;

    //index: fishes lifespan
    //value: how many fishes with that lifespan exists
    let fishTrackMap: number[] = new Array<number>(9).fill(0);
    fishes.forEach((_x, i) => { fishTrackMap[fishes[i]] += 1 });

    for (let index = 0; index < periodInDays; index++) {

      const fishesAfterOneDay: number[] = new Array<number>(9).fill(0);
      fishTrackMap.forEach((x, i) => {
        if (i > 0 && x) {
          fishesAfterOneDay[i - 1] += x;
          return;
        }
        if (i === 0 && x) {
          fishesAfterOneDay[newbornLifespan] += x;
          fishesAfterOneDay[restartLifespan] += x;
          return;
        }
      })
      fishTrackMap = fishesAfterOneDay;
    }

    console.log(`After ${periodInDays} days, there is a total of ${fishTrackMap.reduce((a, b) => a + b)} lanternfishes nearby.`);
  });
