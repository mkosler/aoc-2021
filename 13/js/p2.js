const readline = require('readline');

let dots = new Set();
let instructions = [];

const pointToStr = p => `${p[0]},${p[1]}`;
const strToPoint = s => s.split(',').map(n => Number(n));

const axisToIndex = axis => axis === 'x' ? 0 : 1;

const splitPoints = (pts, axis, n) => {
  const idx = axisToIndex(axis);

  return [
    pts.filter(p => p[idx] > n),
    pts.filter(p => p[idx] <= n)
  ];
};

const fold = (pts, axis, n) => {
  const idx = axisToIndex(axis);

  return pts.map(p => {
    p[idx] = p[idx] - (2 * (p[idx] - n));
    return p;
  });
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  if (l !== '') {
    if (!l.includes('fold')) {
      dots.add(l);
    } else {
      const [, axis, n] = l.match(/fold along ([xy])=(\d+)/);
      instructions.push({
        axis: axis,
        n: Number(n)
      });
    }
  }
});

rl.on('close', () => {
  for (const i of instructions) {
    const allPoints = Array.from(dots.values())
      .map(n => strToPoint(n));

    const [outer, inner] = splitPoints(allPoints, i.axis, i.n);

    const folded = fold(outer, i.axis, i.n);

    dots = new Set([...inner, ...folded].map(n => pointToStr(n)));
  }

  const allPoints = Array.from(dots.values()).map(n => strToPoint(n));
  const width = Math.max(...allPoints.map(p => p[0]));
  const height = Math.max(...allPoints.map(p => p[1]));

  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const pt = allPoints.find(p => p[0] === x && p[1] === y);
      process.stdout.write(pt != null ? '#' : '.');
    }
    process.stdout.write('\n');
  }
});
