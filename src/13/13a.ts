import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const dotsCoords: number[][] = [];
let paper: string[][];
const instructions: string[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '13', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (line === '') {
      continue;
    }
    if (line.includes('=')) {
      const [fold, value] = line.split('=');
      instructions.push(`${fold[fold.length - 1]},${value}`)
      continue;
    }

    dotsCoords.push(line.split(',').map(x => +x));
  };

  const maxX = Math.max(...dotsCoords.map(([y, x]) => x)) + 1;
  const maxY = Math.max(...dotsCoords.map(([y, x]) => y)) + 1;

  paper = new Array<string>(maxX)
    .fill(null)
    .map(_x => new Array<string>(maxY).fill('.'));

  dotsCoords.forEach(([y, x]) => { paper[x][y] = '#' });
}

loadInputData()
  .then(() => {

    instructions.forEach((x, i) => {
      if (i > 0) return; //just first fold.
      const [direction, position] = x.split(',')
      if (direction === 'x') foldX(+position);
      if (direction === 'y') foldY(+position);
    });

    const score = paper.reduce((a, b) => a + b.reduce((c, d) => c + (d === '#' ? 1 : 0), 0), 0)
    console.log(score);

  });

function foldY(position: number) {
  let [top, bottom] = [
    paper.filter((x, i) => i < position),
    paper.filter((x, i) => i > position)
  ]

  const isReversed = top.length < bottom.length;
  if (isReversed) {
    const temp = top;
    top = bottom.reverse();
    bottom = temp.reverse();
  }

  //folding
  for (let i = top.length - 1; i >= 0; i--) {
    for (let j = 0; j < top[i].length; j++) {
      const foldedValue = bottom[top.length - 1 - i][j];
      if (foldedValue === undefined) continue;
      top[i][j] = foldedValue === '#' ? '#' : top[i][j];
    }
  }

  if (isReversed) {
    top = top.reverse();
  }

  paper = top;
}

function foldX(position: number) {
  let [left, right] = [
    paper.map(rows => rows.filter((cols, i) => i < position)),
    paper.map(rows => rows.filter((cols, i) => i > position))
  ]
  const isReversed = left.length < right.length;

  // if left length is less than right length, reverse both arrays, do the folding and reverse the result
  if (isReversed) {
    const temp = left;
    left = right.map(rows => rows.reverse());
    right = temp.map(rows => rows.reverse());
  }

  //folding
  for (let i = 0; i < left.length; i++) {
    for (let j = left[i].length - 1; j >= 0; j--) {
      const foldedValue = right[i][left[i].length - 1 - j];
      if (foldedValue === undefined) continue;
      left[i][j] = foldedValue === '#' ? '#' : left[i][j];
    }
  }

  if (isReversed) {
    left = left.map(rows => rows.reverse());
  }

  paper = left;
}
