const readline = require('readline');

let drawnNumbers = null;
let boards = [];
let b = [];

const markBoard = (board, n) => {
  for (const sq of board) {
    if (sq.n === n) {
      sq.marked = true;
    }
  }
};

const hasBingo = (board) => {
  // Row check
  for (let i = 0; i < board.length; i += 5) {
    let isBingo = true;

    for (let j = i; j < i + 5; j++) {
      if (!board[j].marked) {
        isBingo = false;
        break;
      }
    }

    if (isBingo) return true;
  }

  // Column check
  for (let i = 0; i < 5; i++) {
    let isBingo = true;

    for (let j = i; j < board.length; j += 5) {
      if (!board[j].marked) {
        isBingo = false;
        break;
      }
    }

    if (isBingo) return true;
  }

  return false;
};

const calcScore = (board, ln) => {
  const sum = board
    .filter(x => !x.marked)
    .reduce((p, c) => p + c.n, 0);

  return sum * ln;
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  if (drawnNumbers === null) {
    drawnNumbers = l.split(',').map(n => parseInt(n));
  } else if (l.trim().length) { // Line is not just whitespace
    const nl = l
      .split(' ')
      .filter(x => x !== '')
      .map(x => {
        return { n: parseInt(x), marked: false };
      });

    b = b.concat(nl);

    if (b.length === 25) {
      boards.push(b);
      b = [];
    }
  }
});

rl.on('close', () => {
  while (drawnNumbers.length > 0) {
    const n = drawnNumbers.shift();

    for (const board of boards) {
      markBoard(board, n);

      if (hasBingo(board)) {
        const score = calcScore(board, n);

        console.log(`Winning score: ${score}`);
        return;
      }
    }
  }

  throw 'No board has a bingo';
});
