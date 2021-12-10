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
    tests.push(map[n - w] > map[n]);
  }

  if (n % w > 0) {
    tests.push(map[n - 1] > map[n]);
  }

  if (n % w < w - 1) {
    tests.push(map[n + 1] > map[n]);
  }

  if (n < w * (h - 1)) {
    tests.push(map[n + w] > map[n]);
  }

  return tests.every(t => t);
};

const floodFill = (map, n, w, h, inside = []) => {
  if (inside.includes(n) || map[n] === 9) return inside;

  inside.push(n);

  if (n > w - 1 && map[n - w] > map[n]) {
    inside = floodFill(map, n - w, w, h, inside);
  }

  if (n % w > 0 && map[n - 1] > map[n]) {
    inside = floodFill(map, n - 1, w, h, inside)
  }

  if (n % w < w - 1 && map[n + 1] > map[n]) {
    inside = floodFill(map, n + 1, w, h, inside);
  }

  if (n < w * (h - 1) && map[n + w] > map[n]) {
    inside = floodFill(map, n + w, w, h, inside);
  }

  // ???
  return inside;
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
      lows.push(i);
    }
  }

  let basins = lows.map(l => floodFill(heatmap, l, width, height).length);

  console.log(
    basins.sort((a, b) => a - b)
      .slice(-3)
      .reduce((p, c) => p * c, 1)
  );
});
