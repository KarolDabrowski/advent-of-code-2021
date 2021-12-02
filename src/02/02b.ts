import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

let depthValue = 0;
let horizontalValue = 0;
let aim = 0;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '02', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,

  });
  for await (const line of rl) {
    const instructions = line.split(' ');
    const command = instructions[0];
    const value = +instructions[1];

    switch (command) {
      case 'forward':
        horizontalValue += value;
        depthValue += (aim * value);
        break;

      case 'down':
        aim += value;
        break;

      case 'up':
        aim -= value;
        break;
    }

  }
}

loadInputData()
  .then(() => {
    console.log(`depthValue is ${depthValue}`);
    console.log(`horizontalValue is ${horizontalValue}`);
    console.log(`multiplication equals ${depthValue * horizontalValue}`)
  });
