import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

interface IPoint {
  x: number;
  y: number;
}

interface ILine {
  lineId: number;
  points: IPoint[];
}

interface IBoardPoint {
  crossingLineIds: number[];
  x: number;
  y: number;
}

const dim = 1000;
const board: IBoardPoint[] = new Array<IBoardPoint>(dim ^ 2);
const lines: ILine[] = [];
let linesIndex = 0;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '05', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const numbers = line.split('->').join().split(',').map(x => +x);
    const [x1, y1, x2, y2] = numbers;

    //consider only horizontal or vertical lines
    if (x1 !== x2 && y1 !== y2) {
      continue;
    }

    lines.push({
      lineId: linesIndex,
      points: getTotalPoints([x1, y1, x2, y2])
    });
    linesIndex++;
  }
}

loadInputData()
  .then(() => {
    markTheBoard();

    const score =
      board
        .filter(x => x?.crossingLineIds.length >= 2)
        .length;

    console.log(score);
  });

function markTheBoard() {
  lines.forEach(line => {
    line.points.forEach(linePoint => {
      const boardPoint = board[linePoint.x * dim + linePoint.y];
      if (!boardPoint) {
        board[linePoint.x * dim + linePoint.y] = {
          crossingLineIds: [line.lineId],
          x: linePoint.x,
          y: linePoint.y
        }
        return;
      }
      boardPoint.crossingLineIds.push(line.lineId);
      //remove dupes
      boardPoint.crossingLineIds = Array.from(new Set(boardPoint.crossingLineIds));
    });
  });
}

function getTotalPoints([x1, y1, x2, y2]: number[]) {
  const totalPoints: IPoint[] = [];
  if (x1 === x2) {
    const [y1s, y2s] = [y1, y2].sort((a, b) => a - b);
    for (let index = y1s; index <= y2s; index++) {
      totalPoints.push({ x: x1, y: index })
    }
  }
  if (y1 === y2) {
    const [x1s, x2s] = [x1, x2].sort((a, b) => a - b);
    for (let index = x1s; index <= x2s; index++) {
      totalPoints.push({ x: index, y: y1 })
    }
  }
  return totalPoints;
}
