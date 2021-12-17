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
const type2operands = {
  '0': 'add',
  '1': 'mul',
  '2': 'min',
  '3': 'max',
  '5': 'gt',
  '6': 'lt',
  '7': 'eq'
}
const literalValueTypeId = 4;

const hierarchy = {};

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
    console.log(evaluate());
    console.timeEnd("decode");

  });

function decode(beginIndex = 0): number {
  let readPos = beginIndex;
  let packetLength = 0;
  hierarchy[beginIndex] = {};

  const [_version, type] = [
    packets.slice(readPos, readPos + 3),
    packets.slice(readPos + 3, readPos + 6)
  ];

  packetLength += 6;
  readPos += 6;
  const packetTypeId = parseInt(type, 2);

  if (packetTypeId === literalValueTypeId) {
    const groupsStart = readPos;
    const groupLength = 5;
    let takeNext = true;
    const groups: string[] = [];
    while (takeNext) {
      const group = packets.slice(groupsStart + groupLength * groups.length, groupsStart + groupLength * (groups.length + 1));
      groups.push(group);
      takeNext = groups[groups.length - 1][0] !== '0';
    }
    hierarchy[beginIndex] = Number.parseInt(groups.map(x => x.slice(1, groupLength)).join(''), 2).toString();
    packetLength += groupLength * groups.length;
  }

  if (packetTypeId !== literalValueTypeId) {
    hierarchy[beginIndex].operand = type2operands[packetTypeId];
    const lengthType = parseInt(packets[readPos], 2);
    packetLength += 1;
    readPos += 1;

    if (lengthType === 0) { //subpackets total length
      const subpacketsLengthsValue = parseInt(packets.slice(readPos, readPos + 15), 2);
      packetLength += 15;
      readPos += 15;
      let currentSubpacketPos = readPos;
      while (currentSubpacketPos < readPos + subpacketsLengthsValue) {
        if (!Array.isArray(hierarchy[beginIndex].children)) { hierarchy[beginIndex].children = []; }
        hierarchy[beginIndex].children.push(currentSubpacketPos);
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
        const subpacketPos = readPos + subpacketsLengths.reduce((a, b) => a + b, 0)
        if (!Array.isArray(hierarchy[beginIndex].children)) { hierarchy[beginIndex].children = []; }
        hierarchy[beginIndex].children.push(subpacketPos);
        subpacketsLengths.push(decode(subpacketPos));
      }
      packetLength += subpacketsLengths.reduce((a, b) => a + b, 0);
    }

  }

  return packetLength;
}

function evaluate(hierarchyIndex = 0): number {
  const expr = hierarchy[hierarchyIndex];
  if (Number.isInteger(+expr)) { return +expr; }
  let value = 0;
  expr.children = expr.children.map(childIndex => evaluate(childIndex));

  switch (expr.operand) {
    case 'add':
      value = expr.children.reduce((a, b) => a + b, 0);
      break;

    case 'mul':
      value = expr.children.reduce((a, b) => a * b, 1);
      break;

    case 'min':
      value = Math.min(...expr.children);
      break;

    case 'max':
      value = Math.max(...expr.children);
      break;

    case 'gt':
      value = +(expr.children[0] > expr.children[1]);
      break;

    case 'lt':
      value = +(expr.children[0] < expr.children[1]);
      break;

    case 'eq':
      value = +(expr.children[0] == expr.children[1]);
      break;
  }

  return value;
}
