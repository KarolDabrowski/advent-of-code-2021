import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const cave = {};

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '15', 'smallinput.txt'), { encoding: 'utf-8' });
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

}

loadInputData()
  .then(() => {
    // Find path with lowest risk - it's a path finding problem in a weighted vertices graph (input).
    // It can be easily reduced to normal Dijkstra's solution for graphs with weighted edges, though:
    // https://stackoverflow.com/a/10453192
    // Algorithm pseudocode:
    // https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm (version with priority queue)

    const source = '0,0'; //starting vertex
    const target = `${Object.entries(cave).length - 1},${Object.entries(cave).length - 1}`; //target vertex

    const Q = [];
    const dist = {};
    const prev = {};

    for (const [i, row] of Object.entries(cave)) {
      for (const [j, _col] of Object.entries(row)) {
        const vCoord = i + ',' + j;
        dist[vCoord] = Number.MAX_VALUE;
        prev[vCoord] = undefined;
        Q.push({ coord: vCoord, prio: dist[vCoord] });
      }
    }
    dist[source] = 0;

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
        const alt = dist[u.coord] + cave[v.x][v.y]; //
        const vCoord = v.x + ',' + v.y;
        if (alt < dist[vCoord]) {
          dist[vCoord] = alt;
          prev[vCoord] = u.coord;

          //simulate priority queue
          const ind = Q.findIndex(x => x.coord === vCoord);
          Q[ind] = { coord: vCoord, prio: dist[vCoord] };
          Q.sort((a, b) => a.prio - b.prio);

        }
      });

    }

    // Uncomment to see exact path and its weights
    // const S = [];
    // let u = target;

    // if (prev[u]) {
    //   while (u) {
    //     S.push(u);
    //     u = prev[u];
    //   }
    // }

    // console.table(cave);
    // console.log(S.reverse());

    // console.log(S.map((s) => {
    //   const [sx, sy] = s.split(',');
    //   return cave[sx][sy];
    // }));

    console.log('minimal risk: ', dist[target]);
  });
