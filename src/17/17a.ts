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
    // console.log(target);

    // let pos = { x: 0, y: 0 };
    // let acc = { x: 6, y: 9 };
    // let landed = false;

    // while (!(pos.y < target.y1)) {
    //   pos = { x: pos.x + acc.x, y: pos.y + acc.y };
    //   console.log(pos);
    //   acc = { x: acc.x - 1 > 0 ? acc.x - 1 : 0, y: acc.y - 1 }
    //   landed =
    //     pos.x >= target.x1 &&
    //     pos.x <= target.x2 &&
    //     pos.y >= target.y1 &&
    //     pos.y <= target.y2;
    //   if (landed) { break; }
    // }
    // console.log('landed: ', landed, pos);

    // { x1: 20, x2: 30, y1: -10, y2: -5 }
    // { x: 6, y: 9 }
    // { x: 11, y: 17 }
    // { x: 15, y: 24 }
    // { x: 18, y: 30 }
    // { x: 20, y: 35 }
    // { x: 21, y: 39 }
    // { x: 21, y: 42 }
    // { x: 21, y: 44 }
    // { x: 21, y: 45 }
    // { x: 21, y: 45 }
    // { x: 21, y: 44 }
    // { x: 21, y: 42 }
    // { x: 21, y: 39 }
    // { x: 21, y: 35 }
    // { x: 21, y: 30 }
    // { x: 21, y: 24 }
    // { x: 21, y: 17 }
    // { x: 21, y: 9 }
    // { x: 21, y: 0 }
    // { x: 21, y: -10 }
    // landed:  true { x: 21, y: -10 }
    // shoot: 16.912ms

    // movement can be described independently in x or y axis
    // output for acc (6,9) shows that y= -10,0,9,18... = 10 + 9 + 8 + ... are divergent series
    // so to find highest posible y,
    // all there is to do is to calculate divergent series of lowest y target boundary (y1)

    console.log('highest y: ', (target.y1 * target.y1 + target.y1) / 2);
    console.timeEnd("shoot");
  });

