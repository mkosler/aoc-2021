const readline = require('readline');

let caves = new Map();
let paths = [];

const isSmall = c => c === c.toLowerCase();

const createPaths = (map, node, path) => {
  for (const e of map.get(node)) {
    if (e === 'end') {
      paths.push([...path, e]); // hacky use of global
    } else if (!isSmall(e) || !path.includes(e)) {
      createPaths(map, e, [...path, e]);
    }
  }
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const [, left, right] = l.match(/(\w+)\-(\w+)/);

  if (!caves.has(left)) caves.set(left, []);

  if (!caves.has(right)) caves.set(right, []);

  caves.get(left).push(right);
  caves.get(right).push(left);
});

rl.on('close', () => {
  createPaths(caves, 'start', ['start']);

  console.log(paths.length);
});
