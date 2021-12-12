import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

interface cave {
  id: string;
  isBigCave: boolean;
  paths: cave[];
}

let caves: cave[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '12', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const [cave1id, cave2id] = line.split('-');
    let cave1ref = caves.find(cave => cave.id === cave1id);
    let cave2ref = caves.find(cave => cave.id === cave2id);

    if (!cave1ref) {
      const newCave = {
        id: cave1id,
        isBigCave: isUppercase(cave1id),
        paths: []
      }
      caves.push(newCave);
      cave1ref = newCave;
    }

    if (!cave2ref) {
      const newCave = {
        id: cave2id,
        isBigCave: isUppercase(cave2id),
        paths: []
      }
      caves.push(newCave);
      cave2ref = newCave;
    }

    if (!cave1ref.paths.find(x => x.id === cave2ref.id)) {
      cave1ref.paths.push(cave2ref);
    }

    if (!cave2ref.paths.find(x => x.id === cave1ref.id)) {
      cave2ref.paths.push(cave1ref);
    }

  }

  //ignore small caves that only have small neighbours (they will never be reached)
  const ignoreCaves = caves
    .filter(x => !x.isBigCave && x.paths.filter(y => y.isBigCave).length === 0)
    .filter(x => x.id !== 'end' && x.id !== 'start');

  ignoreCaves.forEach(x => {
    caves = caves.filter(y => (y.id !== x.id));
    caves.forEach(y => y.paths = y.paths.filter(z => z.id != x.id));
  });
}

loadInputData()
  .then(() => {
    const pathingsStack: string[][] = [];
    const completedPathings: string[][] = [];
    const startCave = caves.find(x => x.id === 'start');

    startCave.paths.forEach(x => pathingsStack.push(['start', x.id]));

    while (pathingsStack.length) {
      const nextPath = pathingsStack.pop();
      const currCave = nextPath[nextPath.length - 1];
      if (currCave === 'end') {
        completedPathings.push(nextPath);
        continue;
      }

      const currCaveRef = caves.find(x => x.id === currCave);

      currCaveRef.paths.forEach(x => {
        if (x.isBigCave || !nextPath.includes(x.id)) {
          pathingsStack.push([...nextPath, x.id]);
        }
      });
    }

    console.log(completedPathings.length);
  });


function isUppercase(expr: string) {
  return expr === expr.toUpperCase();
}
