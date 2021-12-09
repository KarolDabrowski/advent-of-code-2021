import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

interface Point {
  x: number,
  y: number
}

const heightMap: number[][] = [];
const lowPoints: Point[] = [];

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

    console.log(`Score is ${lowPoints.reduce((a, b) => a + heightMap[b.x][b.y], 0) + lowPoints.length}`);
  });
