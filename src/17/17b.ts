import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

console.time("shoot");

let target = { x1: 0, x2: 0, y1: 0, y2: 0 }

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '17', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [x1, x2, y1, y2] = line
      .split(':')[1]
      .split(',')
      .map(x => x.split('=')[1])
      .map(x => x.split('..'))
      .flat()
      .map(x => +x);
    target = { x1, x2, y1, y2 };
  };

}

loadInputData()
  .then(() => {

    let hitsCount = 0
    for (let x = 0; x <= target.x2; x++) {
      for (let y = target.y1; y < 1000; y++) {
        hitsCount += hits(x, y);
      }
    }
    console.log(hitsCount);
    console.timeEnd("shoot");
  });

function hits(vx, vy): number {

  let pos = { x: 0, y: 0 };
  let v = { x: vx, y: vy };

  while (pos.x <= target.x2 && pos.y >= target.y1) {
    pos = { x: pos.x + v.x, y: pos.y + v.y };
    v = {
      x: v.x - 1 > 0 ? v.x - 1 : 0,
      y: v.y - 1
    }

    if (
      pos.x >= target.x1 &&
      pos.x <= target.x2 &&
      pos.y >= target.y1 &&
      pos.y <= target.y2) {
      return 1;
    }
  }

  return 0;
}
