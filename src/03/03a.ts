import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

const byteLength = 12;
const countingOnes: number[] = new Array<number>(byteLength).fill(0);
const countingZeros: number[] = new Array<number>(byteLength).fill(0);
const gammaRate: number[] = new Array<number>(byteLength).fill(0);
const epsilonRate: number[] = new Array<number>(byteLength).fill(0);

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '03', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,

  });
  for await (const line of rl) {
    for (let index = 0; index < line.length; index++) {
      const bit = +line[index];
      countingOnes[index] += bit ? 1 : 0;
      countingZeros[index] += bit ? 0 : 1;
    }
  }
}

loadInputData()
  .then(() => {
    for (let index = 0; index < byteLength; index++) {
      gammaRate[index] = countingOnes[index] > countingZeros[index] ? 1 : 0;
      epsilonRate[index] = countingOnes[index] > countingZeros[index] ? 0 : 1;
    }

    console.log('gamma rate: ', gammaRate);
    console.log('epsilon rate: ', epsilonRate);

    const gamma = getNumberFromByte(gammaRate)
    const epsilon = getNumberFromByte(epsilonRate)

    console.log('gamma number: ', gamma);
    console.log('epsilon number: ', epsilon);

    console.log('gamma * epsilon =  ', gamma * epsilon);
  });


function getNumberFromByte(byte: number[]): number {
  let acc = 0;
  for (let index = 0; index < byteLength; index++) {
    if (byte[index]) {
      acc += Math.pow(2, byteLength - 1 - index);
    }
  }
  return acc;
}
