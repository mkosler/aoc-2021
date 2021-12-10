const readline = require('readline');

let heatmap = [];
let width = 0;
let height = 0;

const printHeatmap = map => {
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const n = j * width + i;

      process.stdout.write(`${map[n]}`);
    }

    process.stdout.write('\n');
  }
};

const allNeighborsHigher = (map, n, w, h) => {
  let tests = [];

  if (n > w - 1) {
    // console.log(n - w, map[n - w], n, map[n]);
    tests.push(map[n - w] > map[n]);
  }

  if (n % w > 0) {
    // console.log(n - 1, map[n - 1], n, map[n]);
    tests.push(map[n - 1] > map[n]);
  }

  if (n % w < w - 1) {
    // console.log(n + 1, map[n + 1], n, map[n]);
    tests.push(map[n + 1] > map[n]);
  }

  if (n < w * (h - 1)) {
    // console.log(n + w, map[n + w], n, map[n]);
    tests.push(map[n + w] > map[n]);
  }

  // if (tests.every(t => t)) console.log('low point', n, map[n]);

  return tests.every(t => t);
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  width = l.length;
  height++;
  heatmap = heatmap.concat(l.split('').map(n => Number(n)));
});

rl.on('close', () => {
  let lows = [];

  for (const [i, n] of heatmap.entries()) {
    if (allNeighborsHigher(heatmap, i, width, height)) {
      lows.push(n);
    }
  }

  console.log(lows, lows.reduce((p, c) => p + (c + 1), 0));
});
