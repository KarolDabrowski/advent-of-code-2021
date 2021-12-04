import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const byteLength = 12;
let oxygenGenRating: string[] = [];
let co2scrubberRating: string[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '03', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,

  });
  for await (const line of rl) {
    oxygenGenRating.push(line);
    co2scrubberRating.push(line);
  }

  for (let index = 0; index < byteLength; index++) {
    const stats = checkStatsAtPosAndFavorMore(index, oxygenGenRating);
    oxygenGenRating = oxygenGenRating.filter(x => {
      if (stats) {
        return +x[index] === 1;
      } else {
        return +x[index] === 0;
      }
    });

    if (oxygenGenRating.length === 1) { break; }

  }

  for (let index = 0; index < byteLength; index++) {
    const stats = checkStatsAtPosAndFavorLess(index, co2scrubberRating);
    co2scrubberRating = co2scrubberRating.filter(x => {
      if (stats) {
        return +x[index] === 1;
      } else {
        return +x[index] === 0;
      }
    })
    console.log(co2scrubberRating);
    if (co2scrubberRating.length === 1) { break; }

  }

  console.log('oxygenRating: ', oxygenGenRating);
  console.log('co2scrubberRating: ', co2scrubberRating);

}

function checkStatsAtPosAndFavorMore(pos: number, byteArray: string[]): boolean {
  const ones = byteArray.filter(x => +x[pos] === 1).length;
  const moreOrEqualOnesThanZeros = ones >= byteArray.length - ones;
  return moreOrEqualOnesThanZeros;
}

function checkStatsAtPosAndFavorLess(pos: number, byteArray: string[]): boolean {
  const ones = byteArray.filter(x => +x[pos] === 1).length;
  const moreOrEqualOnesThanZeros = ones < byteArray.length - ones;
  return moreOrEqualOnesThanZeros;
}

loadInputData()
  .then(() => {
    const oxygen = getNumberFromByte(oxygenGenRating[0]);
    const scrubber = getNumberFromByte(co2scrubberRating[0]);

    console.log('oxygen number: ', oxygen);
    console.log('scrubber number: ', scrubber);
    console.log('oxygen * scrubber =  ', oxygen * scrubber);
  });


function getNumberFromByte(byte: string): number {
  let acc = 0;
  for (let index = 0; index < byteLength; index++) {
    if (+byte[index]) {
      acc += Math.pow(2, byteLength - 1 - index);
    }
  }
  return acc;
}
