/**
 * Some predefined delay values (in milliseconds).
 */
export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

/**
 * Returns a Promise<string> that resolves after a given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - A number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(name: string, delay: number = Delays.Medium): Promise<string> {
  return new Promise((resolve: (value?: string) => void) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay)
  );
}

// Below are examples of using ESLint errors suppression
// Here it is suppressing a missing return type definition for the greeter function.

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function greeter(name: string) {
  return await delayedHello(name, Delays.Long);
}



// import { readFile, writeFile, appendFile, rename, unlink } from 'fs/promises';
// import { join } from 'path';

// export const fileOps = async () => {
//   try {
//     const data = await readFile(join('src', '01', 'input.txt'), 'utf8');
//     // console.log(data);
//     await writeFile(join(__dirname, 'output.txt'), data);
//     await appendFile(join(__dirname, 'output.txt'), '\n\nnice to meet you');
//     await rename(join(__dirname, 'output.txt'), join(__dirname, 'output2.txt'));

//     const newData = await readFile(join(__dirname, 'output2.txt'), 'utf8');
//     await unlink(join(__dirname, 'output2.txt'));

//     console.log(newData);
//   } catch (error) {
//     console.error(error);
//   }
// }

// import { createReadStream, createWriteStream } from "fs";
// import { join } from "path";

// const rs = createReadStream(join('src', '01', 'input.txt'), { encoding: 'utf-8' });

// const ws = createWriteStream(join('src', '01', 'output.txt'));

// rs.on('data', (dataChunk) => {
//   ws.write(dataChunk);
// })
