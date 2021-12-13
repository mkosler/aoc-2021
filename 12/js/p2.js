const readline = require('readline');

let caves = new Map();
let paths = new Set();

const isSmall = c => c === c.toLowerCase();

// A modified depth-first search that collects the nodes we've traversed
//
// map: the overall cave system
// node: the initial cave we are starting on
// extraSmall: the special small cave that we can visit twice
// path: the current path we are building
//
// Note: we need to create copies of the path each time we
// recur into this function, which is why we are using
// [...path, e] (...path takes all the elements in path and returns
// them as individual return values) to append the next node to our
// path. If we used path.push() we would be passing around the same
// reference to all our recursions, and not get the correct answer
const createPaths = (map, node, extraSmall, path) => {
  // Get all the edges for node
  for (const e of map.get(node)) {
    if (e === 'end') {
      // We have to convert the path to a string before we attempt
      // to add it to the Set data structure; otherwise, when JS
      // does Array === Array testing, it is only checking if the
      // reference IDs are equal, which we explicitly wanted them
      // not to be. Converting it to a primitive type like a
      // string first allows String === String to be used for
      // comparison, and correctly throws out the duplicates
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

// We are going to use a graph data structure
// where the nodes are the keys of a hash/map
// and the values are an array of edges
rl.on('line', (l) => {
  const [, left, right] = l.match(/(\w+)\-(\w+)/);

  if (!caves.has(left)) caves.set(left, []);
  if (!caves.has(right)) caves.set(right, []);

  // The edges are bidirectional in this problem, so be sure to
  // add them to both
  caves.get(left).push(right);
  caves.get(right).push(left);
});

rl.on('close', () => {
  // For part 2, we need a list of all small nodes that are
  // not the start or end node
  const eligible = Array.from(caves.keys()).filter(x => {
    return isSmall(x) && !['start', 'end'].includes(x);
  });

  // Then we loop through the eligible small caves and pass them
  // as the special 'extraSmall' cave. This will, however, cause
  // some duplication of paths for the paths that do not pass
  // through the eligible small cave, so for part 2, we use
  // a Set data structure to collect the completed paths to
  // easily handle the duplication
  for (const n of eligible) {
    createPaths(caves, 'start', n, ['start']);
  }

  console.log(paths.size);
});
