const readline = require('readline');

class Node {
  constructor(data, parent = null) {
    this.data = data;
    this.children = [];
    this.parent = parent;

    if (this.parent !== null) {
      this.parent.addChild(this);
    }
  }

  addChild(node) {
    this.children.push(node);
  }

  static toArray(head) {
    let a = [];

    let queue = [head];

    while (queue.length > 0) {
      const current = queue.shift();

      a.push(current.data);

      for (const c of current.children) {
        queue.push(c);
      }
    }

    return a;
  }
}

let binary = '';

const parseBITS = (b, parent = null, depth = 0, count = 0) => {
  // console.log(b.join(''), parent != null ? parent.data : null, depth);

  let node = null;
  let p = {};

  p.version = parseInt(b.splice(0, 3).join(''), 2);
  p.packetType = parseInt(b.splice(0, 3).join(''), 2);
  count += 6;

  if (p.packetType === 4) {
    let n = '';

    while (true) {
      count += 5;
      const next = parseInt(b.splice(0, 1).join(''), 2);
      n += b.splice(0, 4).join('');

      if (!next) break;
    }

    p.literal = parseInt(n, 2);

    node = new Node(p, parent);
  } else {
    p.lengthType = parseInt(b.splice(0, 1).join(''), 2);
    count += 1;

    if (!p.lengthType) {
      p.length = parseInt(b.splice(0, 15).join(''), 2);
      count += 15;

      node = new Node(p, parent);

      let currentCount = count;
      while (count - currentCount < p.length) {
        [, b, count] = parseBITS(b, node, depth + 1, count);
      }
    } else {
      p.count = parseInt(b.splice(0, 11).join(''), 2);
      count += 11;

      node = new Node(p, parent);

      for (let i = 0; i < p.count; i++) {
        [, b, count] = parseBITS(b, node, depth + 1, count);
      }
    }
  }

  return [node, b, count];
};

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  binary = l.split('')
    .map(x => parseInt(x, 16).toString(2).padStart(4, '0'))
    .join('')
    .split('');
});

rl.on('close', () => {
  const [tree,,] = parseBITS(binary);
  // console.log('---parsed---');

  const a = Node.toArray(tree);

  // console.log(a);

  console.log(a.reduce((p, c) => p + c.version, 0));
});
