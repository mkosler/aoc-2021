const readline = require('readline');

let position = {
  horizontal: 0,
  depth: 0,
  aim: 0
}

const regexp = /(forward|up|down)\s+(\d+)/;

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  let [, direction, power] = l.match(regexp);
  power = parseInt(power);

  if (direction === 'forward') {
    position.horizontal += power;
    position.depth += (position.aim * power)
  } else if (direction === 'up') {
    position.aim -= power;
  } else if (direction === 'down') {
    position.aim += power;
  } else {
    throw `Unknown direction ${direction}`
  }
});

rl.on('close', () => {
  console.log(`(${position.horizontal}, ${position.depth}) ${position.horizontal * position.depth}`);
});
