const readline = require('readline');

const depths = [];
let count = 0;

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  depths.push(parseInt(l));
});

rl.on('close', () => {
  for (let i = 0; i < depths.length - 3; i++) {
    const a = depths[i] + depths[i + 1] + depths[i + 2];
    const b = depths[i + 1] + depths[i + 2] + depths[i + 3];

    if (b - a > 0) {
      count++;
    }
  }

  console.log(`Number of increases: ${count}`);
});
