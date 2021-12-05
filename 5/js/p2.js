const readline = require('readline');

let grid = new Map();

const setGrid = (x, y) => {
  const s = `${x},${y}`;

  if (!grid.has(s)) grid.set(s, 1);
  else grid.set(s, grid.get(s) + 1);
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  let [, x1, y1, x2, y2] = l.match(/(\d+),(\d+) -> (\d+),(\d+)/);
  x1 = parseInt(x1);
  x2 = parseInt(x2);
  y1 = parseInt(y1);
  y2 = parseInt(y2);

  if (x2 - x1 === 0) { // Vertical
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      setGrid(x1, y);
  } else if (y2 - y1 === 0) { // Horizontal
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
      setGrid(x, y1);
  } else { // Diagonal
    let lx = 0;
    let ly = 0;
    let rx = 0;
    let ry = 0;

    if (x2 - x1 > 0) {
      lx = x1; ly = y1; rx = x2; ry = y2;
    } else {
      lx = x2; ly = y2; rx = x1; ry = y1;
    }

    const sy = (ry - ly) / Math.abs(ry - ly);

    for (let x = lx; x <= rx; x++) {
      setGrid(x, ly);
      ly += sy;
    }
  }
}); 

rl.on('close', () => {
  const count = Array.from(grid.values())
    .filter(x => x > 1).length;

  console.log(count);
});
