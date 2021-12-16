const readline = require('readline');

let grid = [];
let width = 0;
let height = 0;

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

  for (let i = 0; i < grid.length; i++) {
    q.set(i, {
      dist: Number.MAX_VALUE,
      prev: null,
      visited: false
    });
  }

  q.get(source).dist = 0;

  let u = null;

  while (q.size > 0) {
    // Get the minimum distince vertex remaining in q
    u = Array.from(q.entries())
      .filter(x => !x[1].visited)
      .reduce((p, c) => p[1].dist < c[1].dist ? p : c)[0];

    q.get(u).visited = true;

    if (u === target) break;

    const neighbors = getNeighbors(u);

    for (const n of neighbors.filter(x => q.has(x))) {
      const dist = q.get(u).dist + g[n];

      if (dist < q.get(n).dist) {
        q.get(n).dist = dist;
        q.get(n).prev = u;
      }
    }
  }

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
  grid = grid.concat(l.split('').map(n => Number(n)));
  width = l.length;
  height++;
});

rl.on('close', () => {
  const path = dijkstra(grid, 0, width * height - 1);

  console.log(path.map(p => grid[p]).reduce((p, c) => p + c, 0));
});
