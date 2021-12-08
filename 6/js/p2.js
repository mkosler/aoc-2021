const readline = require('readline');

let fish = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  for (const f of l.split(',').map(f => Number(f))) {
    fish[f]++;
  }
});

rl.on('close', () => {
  if (process.argv.length < 3) throw 'Missing lastDay argument';

  const lastDay = Number(process.argv[2]);

  for (let day = 0; day < lastDay; day++) {
    let nextFish = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = fish.length - 1; i >= 0; i--) {
      if (i === 0) {
        nextFish[6] += fish[i];
        nextFish[8] = fish[i];
      } else {
        nextFish[i - 1] = fish[i];
      }
    }

    fish = nextFish;
  }

  console.log(fish.reduce((p, c) => p + c, 0));
});
