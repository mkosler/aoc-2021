const readline = require('readline');

let dots = new Set();
let instructions = [];

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
  const i = instructions[0];
  const allPoints = Array.from(dots.values())
    .map(n => n.split(',').map(x => Number(x)));

  const [outer, inner] = splitPoints(allPoints, i.axis, i.n);

  const folded = fold(outer, i.axis, i.n);

  dots = new Set([...inner, ...folded].map(n => `${n[0]},${n[1]}`));

  console.log(dots.size);
});
