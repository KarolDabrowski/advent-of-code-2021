import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

let crabs: number[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '07', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    crabs = line.split(',').map(x => +x);
  }
}

loadInputData()
  .then(() => {
    //index- horizontal position
    //value- how many crabs exists with that distance
    const mapCrabs: number[] = [];

    crabs.forEach((_x, i) => { mapCrabs[crabs[i]] = mapCrabs[crabs[i]] ? mapCrabs[crabs[i]] + 1 : 1 });
    const fuelCosts: number[] = [];

    for (let i = 0; i < mapCrabs.length; i++) {
      fuelCosts[i] = mapCrabs
        .reduce((prev, curr, j) => {
          const fuelCost = Math.abs(i - j);
          const crabEngineeringFuelCost = (fuelCost * (fuelCost + 1)) / 2;
          return prev + (curr * crabEngineeringFuelCost);
        }, 0);
    }

    console.log(`Minimum required fuel is ${Math.min(...fuelCosts)}`);
  });
