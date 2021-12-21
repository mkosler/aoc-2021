const readline = require('readline');
const { grid2str } = require('../../lib/helpers');

const conversion = ['.', '#'];

let enhancement = null;
let input = [];
let width = 0;
let height = 0;

const pad = (a, ch) => {
  let temp = [];

  for (let i = 0; i < width * height; i += width) {
    temp.push([ch, ...a.slice(i, i + width), ch]);
  }

  temp = [
    Array(width + 2).fill(ch),
    ...temp,
    Array(width + 2).fill(ch)
  ];

  width += 2;
  height += 2;

  return temp.reduce((p, c) => p.concat(c), []);
};

const getNeighbors = (a, i, ch) => {
  return [
    i % width === 0 || i < width ? ch : a[i - width - 1], // LT
    i < width ? ch : a[i - width], // T
    i % width === width - 1 || i < width ? ch : a[i - width + 1], // RT
    i % width === 0 ? ch : a[i - 1], // L
    a[i], // M
    i % width === width - 1 ? ch : a[i + 1], // R
    i % width === 0 || i >= width * (height - 1) ? ch : a[i + width - 1], // LB
    i >= width * (height - 1) ? ch : a[i + width], // B
    i % width === width - 1 || i >= width * (height - 1) ? ch : a[i + width + 1], // RB
  ];
};

const step = (start, ch) => {
  let next = [...start];

  for (let i = 0; i < width * height; i++) {
    const n = parseInt(getNeighbors(start, i, ch).join(''), 2);
    const e = enhancement[n];
    next[i] = e;
  }

  return next;
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  if (enhancement === null) {
    enhancement = l.split('')
      .map(x => conversion.indexOf(x).toString())
      .join('');
  } else if (l !== '') {
    width = l.length;
    height++;
    input = input.concat(l.split('')
      .map(x => conversion.indexOf(x).toString()));
  }
});

rl.on('close', () => {
  let defaults = [enhancement[0]];

  // We are guaranteed to have the infinite expanse start
  // as 0's, so if enhancement[0] is also 0, then all pixels
  // with 000000000 = 0 will stay as 0's. Otherwise, we need
  // to see what 111111111 = 511 is, and alternate between
  // the two
  if (enhancement[0] === '0')
    defaults.push(enhancement[0])
  else
    defaults.push(enhancement[511]);

  let d = '0';
  input = pad(input, d);

  for (let i = 0; i < 50; i++) {
    input = step(input, d);
    d = defaults[i % 2];
    input = pad(input, d);
  }

  console.log(input.reduce((p, c) => p + Number(c), 0));
});
