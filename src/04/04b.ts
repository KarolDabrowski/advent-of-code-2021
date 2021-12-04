import { join } from 'path';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

interface IBingoBoard {
  win: boolean;
  bingoNumbers: IBingoNumber[][];
}
interface IBingoNumber {
  value: number;
  isMarked: boolean;
}

const boardSize = 5;
let bingoNumbers: number[] = [];
const bingoBoards: IBingoBoard[] = [];

let totalBingoBoards = 0;
let bingoBoardsWonCount = 0;

let lastWinningBoard: IBingoBoard;
let lastWinningBingoNumber: number;

async function loadInputData(): Promise<void> {
  const fileStream = createReadStream(join('src', '04', 'input.txt'), { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let lineCount = 0;
  let bingoBoardsIndex = 0;

  for await (const line of rl) {
    // console.log(`bingo line ${lineCount}: `, line);

    if (lineCount === 0) {
      bingoNumbers = line.split(',').map(x => +x);
      // console.log(bingoNumbers);
      lineCount++;
      continue;
    }
    if (lineCount === 1) {
      lineCount++;
      continue;
    }

    if (line !== '') { //if line is not empty

      if (!bingoBoards[bingoBoardsIndex]) {
        bingoBoards[bingoBoardsIndex] = {
          win: false,
          bingoNumbers: []
        }
      }

      bingoBoards[bingoBoardsIndex].bingoNumbers
        .push(line.split(' ').filter(x => x !== '').map(x => { return { value: +x, isMarked: false } }))
    }

    if (line === '') { //if line is empty
      bingoBoardsIndex++;
    }

    lineCount++;
  }
}

loadInputData()
  .then(() => {

    totalBingoBoards = bingoBoards.length;

    for (let index = 0; index < bingoNumbers.length; index++) {
      const bingoNumber = bingoNumbers[index];
      calloutBingoNumber(bingoNumber);
      checkForBingo();
      if (lastWinningBoard) {
        lastWinningBingoNumber = bingoNumber;
        break;
      }
    }

    const scoreSum = sumWinningBoard();
    console.log('last winning board: ', lastWinningBoard.bingoNumbers);
    console.log('last winning bingo number: ', lastWinningBingoNumber);
    console.log('scoreSum: ', scoreSum);
    console.log('total score: ', scoreSum * lastWinningBingoNumber);
  });

function calloutBingoNumber(x: number) {
  bingoBoards.forEach(board => {
    markNumberOnBingoBoard(board, x);
  });
}

function markNumberOnBingoBoard(board: IBingoBoard, number: number) {
  board.bingoNumbers = board.bingoNumbers
    .map(x => x
      .map(y => { return { ...y, isMarked: y.isMarked ? true : y.value === number } }))
}

function checkForBingo() {
  for (let index = 0; index < bingoBoards.length; index++) {
    const board = bingoBoards[index];
    const rowsCount: number[] = new Array<number>(boardSize).fill(0);
    const columnsCount: number[] = new Array<number>(boardSize).fill(0);

    board.bingoNumbers.forEach((row, i) =>
      row.forEach((column, j) => {
        rowsCount[i] += column.isMarked ? 1 : 0;
        columnsCount[j] += column.isMarked ? 1 : 0;
      }))

    const rowBingo = rowsCount.filter(x => x === 5).length >= 1;
    const columnBingo = columnsCount.filter(x => x === 5).length >= 1;

    if (rowBingo || columnBingo) {
      if (!board.win) {

        if (bingoBoardsWonCount === totalBingoBoards - 1) {
          lastWinningBoard = board;
          break;
        }

        board.win = true;
        bingoBoardsWonCount++;
      }
    }
  }
}

function sumWinningBoard(): number {
  return lastWinningBoard.bingoNumbers.flat().map(x => x.isMarked ? 0 : x.value).reduce((a, b) => a + b);
}
