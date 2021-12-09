const readline = require('readline');

let digits = [];

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  digits.push(
      Array.from(l.split(' | ')[1].matchAll(/\w+/g), m => m[0])
  );
});

rl.on('close', () => {
  let total = 0;

  for (const d of digits) {
    for (const s of d) {
      if ([2, 4, 3, 7].some(o => o === s.length)) total++;
    }
  }

  console.log(total);
});
