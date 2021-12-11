const readline = require('readline');

const open = '([{<';
const close = ')]}>';
let completions = [];

const calcScore = str => {
  let total = 0;

  for (const c of str) {
    total *= 5;
    total += close.indexOf(c) + 1;
  }

  return total;
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  let stack = [];
  let isCorrupted = false;
  let completion = '';

  for (let i = l.length - 1; i >= 0; i--) {
    const c = l[i];

    if (close.includes(c)) {
      stack.push(c);
    } else if (stack.length > 0) {
      const id = open.indexOf(c);

      if (stack[stack.length - 1] === close[id]) {
        stack.pop();
      } else {
        isCorrupted = true;
        break;
      }
    } else {
      completion += close[open.indexOf(c)];
    }
  }

  if (!isCorrupted) {
    completions.push(completion);
  }
});

rl.on('close', () => {

  let scores = completions.map(x => calcScore(x))
    .sort((a, b) => a - b);

  let mId = Math.floor(scores.length / 2);

  // console.log(completions, scores, mId, scores[mId]);

  console.log(scores[mId]);
});
