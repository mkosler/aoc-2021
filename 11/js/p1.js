const readline = require('readline');

let map = [];
const width = 10;
const height = 10;

const mapToStr = m => {
  let s = '';

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const n = m[j * width + i];

      s += n;
    }

    s += '\n';
  }

  return s;
};

const getNeighbors = i => {
  let n = [];

  if (i > width - 1 && i % width > 0) n.push(i - width - 1); // TL
  if (i > width - 1) n.push(i - width); // T
  if (i > width - 1 && i % width < width - 1) n.push(i - width + 1); // TR
  if (i % width > 0) n.push(i - 1); // L
  if (i % width < width - 1) n.push(i + 1); // R
  if (i < width * (height - 1) && i % width > 0) n.push(i + width - 1); // BL
  if (i < width * (height - 1)) n.push(i + width);
  if (i < width * (height - 1) && i % width < width - 1) n.push(i + width + 1); // BR

  return n;
};

const flash = (m, i) => {
  // Set yourself to -1 (to signal already flashed)
  m[i] = -1;

  // Check if any neighbors now need to flash themselves
  for (const j of getNeighbors(i)) {
    if (m[j] >= 0) {
      m[j]++;

      if (m[j] > 9) m = flash(m, j);
    }
  }

  return m;
};

const step = m => {
  // Increase all by 1
  m = m.map(n => n + 1);

  // Trigger any flashes
  for (const [i, n] of m.entries()) {
    if (n > 9) m = flash(m, i);
  }

  // Set all the flashed to 0
  const flashes = m.filter(n => n < 0).length;
  m = m.map(n => Math.max(n, 0));

  return [m, flashes];
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  map = map.concat(l.split('').map(n => Number(n)));
});

rl.on('close', () => {
  if (process.argv[2] == null) throw 'Missing step count';
  const count = Number(process.argv[2]);

  let total = 0;

  for (let i = 0; i < count; i++) {
    [map, f] = step(map);
    total += f;
  }

  console.log(total);
});
