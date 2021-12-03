const readline = require('readline');

let position = {
  horizontal: 0,
  vertical: 0
}

const movements = {
  forward: {
    mod: 1,
    pos: 'horizontal'
  },
  down: {
    mod: 1,
    pos: 'vertical'
  },
  up: {
    mod: -1,
    pos: 'vertical'
  }
}

const regexp = /(forward|up|down)\s+(\d+)/;

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const [, direction, power] = l.match(regexp);

  const move = movements[direction];

  position[move.pos] += move.mod * power;
});

rl.on('close', () => {
  console.log(`(${position.horizontal}, ${position.vertical}) ${position.horizontal * position.vertical}`);
});
