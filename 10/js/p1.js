const readline = require('readline');

const open = '([{<';
const close = ')]}>';
let corrupted = [];

let scores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  let stack = [];

  for (let i = l.length - 1; i >= 0; i--) {
    const c = l[i];

    if (close.includes(c)) {
      stack.push(c);
    } else if (stack.length > 0) {
      const id = open.indexOf(c);

      if (stack[stack.length - 1] === close[id]) {
        stack.pop();
      } else {
        corrupted.push(stack[stack.length - 1]);
        break;
      }
    }
  }
});

rl.on('close', () => {
  console.log(corrupted.map(c => scores[c]).reduce((p, c) => p + c, 0));
});
