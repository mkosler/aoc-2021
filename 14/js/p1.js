const readline = require('readline');

let template = '';
let rules = new Map();

const step = polymer => {
  let next = [];

  for (let i = 0; i < polymer.length - 1; i++) {
    const rule = polymer.substring(i, i + 2);
    if (i === polymer.length - 2) {
      next.push(rules.get(rule));
    } else {
      next.push(rules.get(rule).substring(0, 2));
    }
  }

  return next.join('');
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  if (l.includes('->')) {
    const [left, right] = l.split(' -> ');
    const ll = left.split('');
    rules.set(left, [ll[0], right, ll[1]].join(''));
  } else if (l !== '') {
    template = l;
  }
});

rl.on('close', () => {
  if (process.argv.length < 3) throw 'Missing step count';

  const steps = process.argv[2];

  // console.log('Initial', template);
  for (let i = 0; i < steps; i++) {
    template = step(template);
    // console.log(i + 1, template);
  }

  console.log(template);

  const uniques = Array.from(new Set(template.split('')).values());

  let counts = [];
  for (const c of uniques) {
    counts.push((template.match(new RegExp(c, 'g')) || []).length);
  }

  const max = Math.max(...counts);
  const min = Math.min(...counts);

  console.log(max, min, max - min);
});
