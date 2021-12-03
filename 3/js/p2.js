const readline = require('readline');

let binaries = [];

const rl = readline.createInterface({
  input: process.stdin
});

const prune = (bins, pos, tb) => {
  let count = 0;
  let ch = '';

  for (let i = 0; i < bins.length; i++) {
    const n = bins[i];

    if (n[pos] === '1') count++;
    else count--;
  }

  if (tb === 1) {
    if (count >= 0) ch = '1';
    else ch = '0';
  } else {
    if (count >= 0) ch = '0';
    else ch = '1';
  }

  const filtered = bins.filter(n => n[pos] === ch);

  if (filtered.length === 1) return filtered[0];
  else return prune(filtered, pos + 1, tb);
}

rl.on('line', (l) => {
  binaries.push(l);
});

rl.on('close', () => {
  const oxygen = prune(binaries, 0, 1);
  const co2 = prune(binaries, 0, 0);

  const on = parseInt(oxygen, 2);
  const cn = parseInt(co2, 2);

  console.log(`Oxygen: ${oxygen}, ${on}`);
  console.log(`CO2: ${co2}, ${cn}`);
  console.log(`${on * cn}`);
});
