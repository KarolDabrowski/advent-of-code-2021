import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

console.time("decode");

let packets;
const hex2bin = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  'A': '1010',
  'B': '1011',
  'C': '1100',
  'D': '1101',
  'E': '1110',
  'F': '1111'
}
const literalValueTypeId = 4; //any other type id is operator type
const packetsVersions: number[] = [];

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '16', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    packets = [...line]
      .map(x => hex2bin[x]).join('')
  };

}

loadInputData()
  .then(() => {
    decode();
    console.log(packetsVersions);
    console.log(packetsVersions.reduce((a, b) => a + b));
    console.timeEnd("decode");

  });

function decode(beginIndex = 0): number {
  let readPos = beginIndex;
  let packetLength = 0;

  const [version, type] = [
    packets.slice(readPos, readPos + 3),
    packets.slice(readPos + 3, readPos + 6)
  ];
  packetsVersions.push(parseInt(version, 2));
  packetLength += 6;
  readPos += 6;

  if (parseInt(type, 2) === literalValueTypeId) {
    const groupsStart = readPos;
    const groupLength = 5;
    let groupCount = 1;
    while (packets.slice(groupsStart + groupLength * (groupCount - 1), groupsStart + groupLength * groupCount)[0] === '1') {
      groupCount++;
    }
    packetLength += groupLength * groupCount;
  }

  if (parseInt(type, 2) !== literalValueTypeId) {
    // Operator packet
    const lengthType = parseInt(packets[readPos], 2);
    packetLength += 1;
    readPos += 1;

    if (lengthType === 0) { //subpackets total length
      const subpacketsLengthsValue = parseInt(packets.slice(readPos, readPos + 15), 2);
      packetLength += 15;
      readPos += 15;
      let currentSubpacketPos = readPos;
      while (currentSubpacketPos < readPos + subpacketsLengthsValue) {
        currentSubpacketPos += decode(currentSubpacketPos);
      }
      packetLength += subpacketsLengthsValue;
    }
    if (lengthType === 1) { //subpackets count
      const subpacketsCount = parseInt(packets.slice(readPos, readPos + 11), 2);
      packetLength += 11;
      readPos += 11;
      const subpacketsLengths: number[] = [];
      for (let i = 0; i < subpacketsCount; i++) {
        subpacketsLengths.push(decode(readPos + subpacketsLengths.reduce((a, b) => a + b, 0)));
      }
      packetLength += subpacketsLengths.reduce((a, b) => a + b, 0);
    }
  }
  return packetLength;
}

