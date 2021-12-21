const grid2str = (grid, width, height, sep = '') => {
  let s = [];

  for (let y = 0; y < height; y++) {
    let r = [];

    for (let x = 0; x < width; x++) {
      const n = pt2n(x, y, width);

      r.push(grid[n]);
    }

    s.push(r.join(sep));
  }

  return s.join('\n');
};

const pt2n = (x, y, width) => y * width + x;

const n2pt = (n, width) => [n % width, Math.floor(n / width)];

module.exports = { grid2str, pt2n, n2pt };
