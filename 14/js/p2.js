const readline = require('readline');

let template = '';
let counts = new Map();
let rules = new Map();
let letterCounts = new Map();

const step = cts => {
  let newCts = new Map();

  for (const [k, v] of cts.entries()) {
    const right = rules.get(k);

    const nc = right[0][1];
    if (!letterCounts.has(nc)) letterCounts.set(nc, 0);
    letterCounts.set(nc, letterCounts.get(nc) + v);

    for (const r of right) {
      if (!newCts.has(r)) newCts.set(r, 0);
      newCts.set(r, newCts.get(r) + v);
    }
  }

  return newCts;
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  if (l.includes('->')) {
    const [left, right] = l.split(' -> ');
    const ll = left.split('');
    rules.set(left, [`${ll[0]}${right}`, `${right}${ll[1]}`]);
  } else if (l !== '') {
    template = l;
  }
});

rl.on('close', () => {
  if (process.argv.length < 3) throw 'Missing step count';

  const steps = process.argv[2];

  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.substring(i, i + 2);

    if (!counts.has(pair)) counts.set(pair, 0);
    counts.set(pair, counts.get(pair) + 1);
  }

  for (const c of template) {
    if (!letterCounts.has(c)) letterCounts.set(c, 0);
    letterCounts.set(c, letterCounts.get(c) + 1);
  }

  for (let i = 0; i < steps; i++) {
    counts = step(counts);
  }

  const max = Math.max(...Array.from(letterCounts.values()));
  const min = Math.min(...Array.from(letterCounts.values()));

  console.log(letterCounts);
  console.log(max, min, max - min);
});
