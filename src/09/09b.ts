import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

interface Point {
  x: number,
  y: number
}

const heightMap: number[][] = [];
const lowPoints: Point[] = [];
let basins: Point[][];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '09', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    heightMap.push([...line].map(x => +x));
  }
}

loadInputData()
  .then(() => {
    heightMap.forEach((row, i) => {
      row.forEach((_col, j) => {
        const neighbours = [
          Array.isArray(heightMap[i]) ? Number.isInteger(heightMap[i][j - 1]) ? heightMap[i][j - 1] : undefined : undefined,
          Array.isArray(heightMap[i]) ? Number.isInteger(heightMap[i][j + 1]) ? heightMap[i][j + 1] : undefined : undefined,
          Array.isArray(heightMap[i - 1]) ? Number.isInteger(heightMap[i - 1][j]) ? heightMap[i - 1][j] : undefined : undefined,
          Array.isArray(heightMap[i + 1]) ? Number.isInteger(heightMap[i + 1][j]) ? heightMap[i + 1][j] : undefined : undefined
        ].filter(x => Number.isInteger(x));
        if (heightMap[i][j] < Math.min(...neighbours)) {
          lowPoints.push({ x: i, y: j });
        }
      });
    });

    basins = new Array<Point[]>(lowPoints.length).fill(null).map(_x => new Array<Point>()); //filling with nulls enable map to iterate
    lowPoints.forEach((lowpoint, index) => findBasin(lowpoint.x, lowpoint.y, index))

    const score = basins.map(x => x.length).sort((a, b) => a - b).slice(-3).reduce((a, b) => a * b);

    console.log(score);
  });

function findBasin(x: number, y: number, i: number) {
  if (
    !Array.isArray(heightMap[x]) ||
    !Number.isInteger(heightMap[x][y]) ||
    heightMap[x][y] === 9 ||
    basins[i].find(point => point.x === x && point.y === y)
  ) { return; }

  basins[i].push({ x, y });
  findBasin(x - 1, y, i);
  findBasin(x + 1, y, i);
  findBasin(x, y - 1, i);
  findBasin(x, y + 1, i);
}
