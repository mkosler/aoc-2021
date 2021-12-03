const readline = require('readline');

let counts = null;

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  if (counts === null) counts = new Array(l.length).fill(0);

  for (let i = 0; i < l.length; i++) {
    const n = l[i];

    if (n === '1') counts[i]++;
    else if (n === '0') counts[i]--;
    else throw `Unknown character (${n})`;
  }
});

rl.on('close', () => {
  let gamma = '';
  let epsilon = '';

  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0) {
      gamma += '1';
      epsilon += '0';
    } else {
      gamma += '0';
      epsilon += '1';
    }
  }

  let gn = parseInt(gamma, 2);
  let en = parseInt(epsilon, 2);

  console.log(`Gamma: ${gamma} ${gn}`);
  console.log(`Gamma: ${epsilon} ${en}`);
  console.log(`${gn * en}`);
});
