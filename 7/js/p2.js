const readline = require('readline');

let positions = null;

const fuelCost = steps => {
  if (steps === 0) return 0;
  return steps + fuelCost(steps - 1);
};

const totalCost = (p, i) => {
  let total = 0;

  for (const [k, v] of p.entries()) {
    total += fuelCost(Math.abs(k - i)) * v;
  }

  return total;
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const pos = l.split(',').map(x => Number(x));
  const length = Math.max(...pos) + 1;

  positions = new Array(length).fill(0);

  for (const n of pos) {
    positions[n]++;
  }
});

rl.on('close', () => {
  let costs = [];

  for (let i = 0; i < positions.length; i++) {
    costs[i] = totalCost(positions, i);
  }

  console.log(`Position ${costs.indexOf(Math.min(...costs))} costs ${Math.min(...costs)}`);
});
