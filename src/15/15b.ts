import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

console.time("pathfind");
let cave = {};
let initialCaveLength;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '15', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineIndex = 0;
  for await (const line of rl) {
    if (!cave[lineIndex]) {
      cave[+lineIndex] = {};
    }
    [...line].forEach((x, i) => { cave[lineIndex][i] = +x });
    lineIndex += 1;
  };

  initialCaveLength = Object.entries(cave).length;

  //Extend the input
  for (let index = 0; index <= 3; index++) {
    extendRight(index);
  }
  for (let index = 0; index <= 3; index++) {
    extendDown(index);
  }
}

loadInputData()
  .then(() => {
    runPathfind();
    console.timeEnd("pathfind");
  });


function extendRight(index: number) {
  const caveCopy = JSON.parse((JSON.stringify(cave)));
  for (const [i, row] of Object.entries(cave)) {
    for (const [j, col] of Object.entries(row)) {
      if ((+j) < index * initialCaveLength) { continue; }
      caveCopy[i][+j + initialCaveLength] = col === 9 ? 1 : (col + 1);
    }
  }
  cave = caveCopy;
}

function extendDown(index: number) {
  const caveCopy = JSON.parse((JSON.stringify(cave)));
  for (const [i, row] of Object.entries(cave)) {
    if ((+i) < index * initialCaveLength) { continue; }
    if (!caveCopy[+i + initialCaveLength]) { caveCopy[+i + initialCaveLength] = {}; }
    for (const [j, col] of Object.entries(row)) {
      caveCopy[+i + initialCaveLength][j] = col === 9 ? 1 : (col + 1);
    }
  }
  cave = caveCopy;
}

function runPathfind() {
  const source = '0,0';
  const target = `${Object.entries(cave).length - 1},${Object.entries(cave).length - 1}`;

  const Q = [];
  const dist = {};

  for (const [i, row] of Object.entries(cave)) {
    for (const [j, _col] of Object.entries(row)) {
      const vCoord = i + ',' + j;
      dist[vCoord] = Number.MAX_VALUE;
    }
  }

  dist[source] = 0;
  Q.push({ coord: source, prio: dist[source] });

  while (Q.length) {
    const u = Q.shift();
    const [ux, uy] = u.coord.split(',').map(x => +x);

    if (u === target) { break };

    [
      { x: ux, y: uy - 1 }, //up
      { x: ux, y: uy + 1 }, //down
      { x: ux - 1, y: uy }, //left
      { x: ux + 1, y: uy }  //right
    ].forEach(v => {
      if (!cave[v.x] || !cave[v.x][v.y]) { return };
      const alt = dist[u.coord] + cave[v.x][v.y];
      const vCoord = v.x + ',' + v.y;
      if (alt < dist[vCoord]) {
        dist[vCoord] = alt;

        const ind = Q.findIndex(x => x.coord === vCoord);
        if (ind === -1) {
          Q.push({ coord: vCoord, prio: dist[vCoord] });
          Q.sort((a, b) => a.prio - b.prio);
        }

      }
    });

  }

  console.log('minimal risk: ', dist[target]);

}
