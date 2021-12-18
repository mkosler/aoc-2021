const readline = require('readline');

class Pair {
  constructor(x, y, depth = 0) {
    this.x = x;
    this.y = y;
    this.parent = null;
    this.depth = depth;

    if (typeof this.x !== 'number') this.x.parent = this;
    if (typeof this.y !== 'number') this.y.parent = this;
  }

  toString() {
    return `[${this.x.toString()},${this.y.toString()}]`;
  }
}

let list = [];

const adjustDepth = (node, newDepth) => {
  node.depth = newDepth;

  if (typeof node.x !== 'number') adjustDepth(node.x, newDepth + 1);
  if (typeof node.y !== 'number') adjustDepth(node.y, newDepth + 1);
};

const add = (a, b) => {
  adjustDepth(a, a.depth + 1);
  adjustDepth(b, b.depth + 1);

  return new Pair(a, b);
};

const findExplodable = node => {
  let stack = [node];

  while (stack.length > 0) {
    const current = stack.pop();

    if (current.depth === 4) return current;

    if (typeof current.y !== 'number') stack.push(current.y);
    if (typeof current.x !== 'number') stack.push(current.x);
  }

  return null;
};

const explode = node => {
  const left = node.x;
  const right = node.y;

  // find first left
  let current = node;
  while (current.parent !== null) {
    if (current.parent.y === current) {
      if (typeof current.parent.x === 'number') {
        current.parent.x += left;
        break;
      } else {
        // climb back up
        current = current.parent.x;

        while (typeof current.y !== 'number') {
          current = current.y;
        }

        current.y += left;
        break;
      }
    }

    current = current.parent;
  }

  // find first right
  current = node;
  while (current.parent !== null) {
    if (current.parent.x === current) {
      if (typeof current.parent.y === 'number') {
        current.parent.y += right;
        break;
      } else {
        current = current.parent.y;

        while (typeof current.x !== 'number') {
          current = current.x;
        }

        current.x += right;
        break;
      }
    }

    current = current.parent;
  }

  // replace it in parent with 0, and remove its parent reference
  if (node.parent.x === node) node.parent.x = 0;
  else if (node.parent.y === node) node.parent.y = 0;

  node.parent = null;
};

const findSplit = current => {
  if (typeof current.x === 'number' && current.x > 9) {
    return [current, 'x'];
  }

  if (typeof current.x !== 'number') {
    let ret = findSplit(current.x);
    if (ret != null) return ret;
  }

  if (typeof current.y !== 'number') {
    let ret = findSplit(current.y);
    if (ret != null) return ret;
  }

  if (typeof current.y === 'number' && current.y > 9) {
    return [current, 'y'];
  }

  return null;
};

const split = (node, side) => {
  const n = node[side];
  let pair = new Pair(
    Math.floor(n / 2),
    Math.ceil(n / 2),
    node.depth + 1
  );
  node[side] = pair;
  pair.parent = node;
};

const parse = l => {
  const recur = a => {
    if (!isNaN(a[0]) && !isNaN(a[1])) {
      return new Pair(Number(a[0]), Number(a[1]));
    } else if (!isNaN(a[0])) {
      return new Pair(Number(a[0]), recur(a[1]));
    } else if (!isNaN(a[1])) {
      return new Pair(recur(a[0]), Number(a[1]));
    } else {
      return new Pair(recur(a[0]), recur(a[1]));
    }
  };

  // i can cheat here since it uses the same syntax as JS arrays
  return recur(eval(l));
};

const magnitude = node => {
  if (typeof node.x === 'number' && typeof node.y === 'number') {
    return (3 * node.x) + (2 * node.y);
  } else if (typeof node.x === 'number') {
    return (3 * node.x) + (2 * magnitude(node.y));
  } else if (typeof node.y === 'number') {
    return (3 * magnitude(node.x)) + (2 * node.y);
  } else {
    return (3 * magnitude(node.x)) + (2 * magnitude(node.y));
  }
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const [,x, y] = l.match(/\[(\d+),(\d+)\]/);

  list.push(parse(l));

  // console.log(list[list.length - 1].toString());
});

rl.on('close', () => {
  let result = list[0];

  for (let i = 1; i < list.length; i++) {
    result = add(result, list[i]);
    // console.log('after addition', result.toString());

    let again = true;
    while (again) {
      again = false;

      let ret = findExplodable(result);
      if (ret !== null) {
        again = true;
        explode(ret);
        // console.log('after explode', result.toString());
      } else {
        ret = findSplit(result);
        if (ret !== null) {
          again = true;
          split(ret[0], ret[1]);
          // console.log('after split', result.toString());
        }
      }
    }

    // console.log(result.toString());
    // console.log('===');
  }

  console.log(result.toString(), magnitude(result));
});
