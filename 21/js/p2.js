const readline = require('readline');

// STATE
// name: String
// currentPlayerIndex: Number
// diceResult: Number
// rollCount: Number

let universes = new Set();
let winCount = [0, 0];
let initialPositions = [];
let initialScores = [0, 0];

class Game {
  constructor(winningScore, positions, scores, state) {
    this.winningScore = winningScore;
    this.positions = positions;
    this.scores = scores;
    this.state = state;
  }

  resolveRoll(nextStateName) {
    // Roll again (and split into 3 new universes)
    universes.add(new Game(
        this.winningScore,
        [...this.positions],
        [...this.scores],
        {
          name: nextStateName,
          currentPlayerIndex: this.state.currentPlayerIndex,
          diceResult: 1,
          rollCount: this.state.rollCount + 1
        }));
    universes.add(new Game(
        this.winningScore,
        [...this.positions],
        [...this.scores],
        {
          name: nextStateName,
          currentPlayerIndex: this.state.currentPlayerIndex,
          diceResult: 2,
          rollCount: this.state.rollCount + 1
        }));
    universes.add(new Game(
        this.winningScore,
        [...this.positions],
        [...this.scores],
        {
          name: nextStateName,
          currentPlayerIndex: this.state.currentPlayerIndex,
          diceResult: 3,
          rollCount: this.state.rollCount + 1
        }));

    // Remove the current universe from the set
    universes.delete(this);
  }

  resolveState() {
    // console.log(this);

    if (this.state.name === '1_ROLL') {
      this.resolveRoll('AFTER_ROLL:1');
    } else if (this.state.name === '2_ROLL') {
      this.resolveRoll('AFTER_ROLL:2');
    } else if (this.state.name === '3_ROLL') {
      this.resolveRoll('AFTER_ROLL:3');
    } else if (this.state.name.includes('AFTER_ROLL')) {
      const which = Number(this.state.name.split(':')[1]);

      this.positions[this.state.currentPlayerIndex] +=
        this.state.diceResult;

      if (which < 3) {
        this.state.name = `${which + 1}_ROLL`;
      } else {
        this.positions[this.state.currentPlayerIndex] =
          this.positions[this.state.currentPlayerIndex] % 10;
        this.scores[this.state.currentPlayerIndex] +=
          this.positions[this.state.currentPlayerIndex] + 1;

        if (this.scores[this.state.currentPlayerIndex] >=
            this.winningScore) {
          universes.delete(this);
          winCount[this.state.currentPlayerIndex]++;
          console.log(winCount);
          return;
        } else {
          this.state.currentPlayerIndex =
            (this.state.currentPlayerIndex + 1) % 2;
          this.state.name = '1_ROLL';
        }
      }
    } else {
      throw `Unknown state name: ${this.state.name}`;
    }
  }
}

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const [, p] = l.split(': ');
  initialPositions.push(Number(p) - 1);
});

rl.on('close', () => {
  const winningScore = 21;

  universes.add(new Game(
        winningScore,
        [...initialPositions],
        [...initialScores],
        {
          name: '1_ROLL',
          currentPlayerIndex: 0,
          rollCount: 0,
        }));

  while(universes.size > 0) {
    for (const u of universes) {
      u.resolveState();
    }
    // console.log('===');
  }

  console.log(Math.max(...winCount));
});
