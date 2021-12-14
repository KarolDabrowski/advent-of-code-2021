import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

interface OctoPos {
  x: number,
  y: number
}

let octos: number[][] = [];
let flashOctos: OctoPos[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '11', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    octos.push([...line].map(x => +x));

  }
}

loadInputData()
  .then(() => {
    let steps = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      steps += 1;
      goStep();
      if (allOctosFlashes()) break;
    }
    console.log(steps);
  });

function goStep(): void {
  flashOctos = [];
  octos = octos.map((x, i) => x.map((y, j) => {
    if (y + 1 > 9) {
      flashOctos.push({ x: i, y: j });
    }
    return y += 1;
  }));

  for (let index = 0; index < flashOctos.length; index++) {
    const [x, y] = [flashOctos[index].x, flashOctos[index].y];
    incr({ x, y: y - 1 }); //left;
    incr({ x: x - 1, y: y - 1 }); //top left;
    incr({ x: x - 1, y }); //top;
    incr({ x: x - 1, y: y + 1 }); //top right;
    incr({ x: x, y: y + 1 }); //right;
    incr({ x: x + 1, y: y + 1 }); //bottom right;
    incr({ x: x + 1, y }); //bottom;
    incr({ x: x + 1, y: y - 1 }); //bottom left;
  }

  octos = octos.map(x => x.map(y => {
    return y > 9 ? 0 : y;
  }));
}


function incr(octo: OctoPos): void {
  const [x, y] = [octo.x, octo.y];
  if (Array.isArray(octos[x]) && Number.isInteger(octos[x][y])) {
    if (octos[x][y] > 9) {
      return;
    }
    if (octos[x][y] + 1 > 9) {
      flashOctos.push({ x, y });
    }
    octos[x][y] += 1;
  }
}

function allOctosFlashes() {
  return octos.filter(x => x.filter(y => y === 0).length === x.length).length === octos.length;
}
