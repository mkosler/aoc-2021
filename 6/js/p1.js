const readline = require('readline');

class Lanternfish {
  constructor(state = 8) {
    this.state = state;
  }

  next() {
    this.state--;

    if (this.state < 0) {
      this.state = 6;
      return true;
    }

    return false;
  }
}

let fish = [];

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  fish = l.split(',').map(f => new Lanternfish(Number(f)));
});

rl.on('close', () => {
  if (process.argv.length < 3) throw 'Missing lastDay argument';

  const lastDay = process.argv[2];

  for (let day = 0; day < lastDay; day++) {
    // console.log(`After ${day} day${day > 1 ? 's:' : ': '} ${fish.map(f => f.state).join(',')}`);

    let newFish = [];

    for (const f of fish) {
      if (f.next()) newFish.push(new Lanternfish());
    }

    fish = fish.concat(newFish);
  }

  console.log(fish.length);
});
