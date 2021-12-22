const readline = require('readline');

class Dice {
  constructor() {
    this.last = 0;
    this._count = 0;
  }

  get count() {
    return this._count;
  }

  roll() {
    this._count++;
    const current = this.last;
    this.last = (this.last + 1) % 100;
    return current + 1;
  }
}

const playRound = (players, die, winningScore) => {
  for (const p of players) {
    const move = die.roll() + die.roll() + die.roll();
    p.position = (p.position + move) % 10;
    p.score += p.position + 1;

    if (p.score >= winningScore) return true;
  }

  return false;
};

let players = [];

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const [, p] = l.split(': ');
  players.push({
    score: 0,
    position: Number(p) - 1,
  });
});

rl.on('close', () => {
  const die = new Dice();
  const winningScore = 1000;

  while (!playRound(players, die, winningScore)) {}

  const loser = players.find(p => p.score < winningScore);

  console.log(loser.score, die.count, loser.score * die.count);
});
