const readline = require('readline');

let caves = new Map();
let paths = new Set();

const isSmall = c => c === c.toLowerCase();

const createPaths = (map, node, extraSmall, path) => {
  for (const e of map.get(node)) {
    if (e === 'end') {
      paths.add([...path, e].join(',')); // hacky use of global
    } else if (!isSmall(e)
        || (e === extraSmall && path.filter(p => e === p).length <= 1)
        || !path.includes(e)) {
      createPaths(map, e, extraSmall, [...path, e]);
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
  const eligible = Array.from(caves.keys()).filter(x => {
    return isSmall(x) && !['start', 'end'].includes(x);
  });

  for (const n of eligible) {
    createPaths(caves, 'start', n, ['start']);
  }

  console.log(paths.size);
});
