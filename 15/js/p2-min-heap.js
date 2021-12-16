const readline = require('readline');
const MinHeap = require('../../lib/min-heap');

let grid = [];
let width = 0;
let height = 0;

const gridToString = g => {
  let s = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;

      s += g[i];
    }

    s += '\n';
  }

  return s;
};

const getNeighbors = i => {
  let n = [];

  if (i > width - 1) n.push(i - width);
  if (i % width > 0) n.push(i - 1);
  if (i % width < width - 1) n.push(i + 1);
  if (i < width * (height - 1)) n.push(i + width);

  return n;
};

const dijkstra = (g, source, target) => {
  let q = new Map();
  let unvisited = new Set();
  // let sorted = []
  let sorted = new MinHeap(x => x[1]);

  for (let i = 0; i < grid.length; i++) {
    unvisited.add(i);
    q.set(i, {
      dist: Number.MAX_VALUE,
      prev: null,
    });
  }

  q.get(source).dist = 0;
  // sorted.push([source, 0]);
  sorted.insert([source, 0]);

  let u = null;

  while (unvisited.size > 0) {
    // u = sorted.shift()[0];
    u = sorted.remove()[0];
    unvisited.delete(u);

    if (u === target) break;

    const neighbors = getNeighbors(u);

    for (const n of neighbors.filter(x => unvisited.has(x))) {
      const dist = q.get(u).dist + g[n];

      if (dist < q.get(n).dist) {
        q.get(n).dist = dist;
        q.get(n).prev = u;
        // sorted.push([n, dist]);
        sorted.insert([n, dist]);
      }
    }

    // sorted.sort((a, b) => a[1] - b[1]);
  }

  if (u !== target) throw 'Did not find target';

  let path = [];

  while (u !== source) {
    path.push(u);
    u = q.get(u).prev;
  }

  return path;
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const initial = l.split('').map(n => Number(n));

  // increase the width by 5
  for (let i = 0; i < 5; i++) {
    grid = grid.concat(initial.map(n => n + i <= 9 ? n + i : n + i - 9))
  }

  width = l.length * 5;
  height++;
});

rl.on('close', () => {
  const initial = [...grid];

  for (let i = 1; i < 5; i++) {
    grid = grid.concat(initial.map(n => n + i <= 9 ? n + i : n + i - 9));
  }

  height *= 5;

  const path = dijkstra(grid, 0, width * height - 1);

  console.log(path.map(p => grid[p]).reduce((p, c) => p + c, 0));
});
