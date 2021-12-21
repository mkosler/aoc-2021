const readline = require('readline');

let box = {
  l: 0,
  t: 0,
  r: 0,
  b: 0
};

const contains = (p, b) => {
  return b.l <= p[0] && p[0] <= b.r &&
    b.b <= p[1] && p[1] <= b.t;
}

const magnitude = v => Math.sqrt((v[0] * v[0]) + (v[1] * v[1]));

// const canStopChecking = (p, v, b) => {
//   return (p[0] > b.r) || (v[1] < 0 && p[1] < b.b);
// };

const step = (p, v, b, peakY) => {
  // const lastP = [...p];

  p[0] += v[0];
  p[1] += v[1];

  peakY = Math.max(p[1], peakY);

  if (contains(p, b)) {
    return [1, p, v, peakY];
  } else if (p[0] > b.r) {
    return [-1, p, v, peakY];
  } else if (v[1] < 0 && p[1] < b.b) {
    return [-2, p, v, peakY];
  }

  if (v[0] > 0) v[0]--;
  else if (v[0] < 0) v[0]++;

  v[1]--;

  return [0, p, v, peakY];
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', l => {
  const [, x1, x2, y1, y2] = l.match(/target area:\s+x=(\-?\d+)\.\.(\-?\d+),\s+y=(\-?\d+)\.\.(\-?\d+)/);

  box.l = Math.min(x1, x2);
  box.r = Math.max(x1, x2);
  box.t = Math.max(y1, y2);
  box.b = Math.min(y1, y2);
});

rl.on('close', () => {
  let peaks = [];

  console.log(box);

  for (let x = 0; x < box.r; x++) {
    let y = 0;
    let next = 0;
    let overshoots = 0;

    while (next !== -2) {
      let position = [0, 0];
      let velocity = [x, y];
      let peakY = Number.MIN_VALUE;
      next = 0;

      console.log('Initial', position, velocity, magnitude(velocity));

      while (next === 0) {
        [next, position, velocity, peakY] = step(position, velocity, box, peakY);

        if (next === 1) {
          console.log(`Landed with peak of ${peakY}`);
          peaks.push(peakY);
        } else if (next === -1) {
          overshoots++;
        }

        if (overshoots > 5) break;
      }

      console.log('===');

      if (overshoots > 5) break;

      y++;
    }
  }

  console.log(Math.max(...peaks));
});
