const readline = require('readline');
const Vector = require('../../lib/vector');

const axes = [
  new Vector(0, 1, 0),  // +y
  new Vector(0, -1, 0), // -y
  new Vector(1, 0, 0),  // +x
  new Vector(-1, 0, 0), // -x
  new Vector(0, 0, 1),  // +z
  new Vector(0, 0, -1), // -z
];

let scanners = new Map();
let count = 0;

const intersection = (a, b) => {
  // console.log(a, b);
  // console.log('===');
  let result = [];
  for (const x of b) {
    if (a.find(y => y.equals(x))) result.push(x);
  }
  return result;
}

const transform = (v, up, rot) => {
  let result = null;

  if (up.equals(axes[0])) result = v;
  else if (up.equals(axes[1])) result = new Vector(v.x, -v.y, -v.z);
  else if (up.equals(axes[2])) result = new Vector(v.y, v.x, -v.z);
  else if (up.equals(axes[3])) result = new Vector(v.y, -v.x, v.z);
  else if (up.equals(axes[4])) result = new Vector(v.y, v.z, v.x);
  else if (up.equals(axes[5])) result = new Vector(v.y, -v.z, -v.x);
  else throw 'Unknown up vector';

  if (rot === 0) return result;
  else if (rot === 90) return new Vector(result.z, result.y, -result.x);
  else if (rot === 180) return new Vector(-result.x, result.y, -result.z);
  else if (rot === 270) return new Vector(-result.z, result.y, result.x);
  else throw 'Unknown rotation';
};

const align = (b1, b2) => {
  for (const axis of axes) {
    for (let rot = 0; rot < 360; rot += 90) {
      const modified = b2.map(b => transform(b, axis, rot));
      // console.log(modified);

      for (const x of b1) {
        for (const y of modified) {
          const diff = x.subtract(y);
          const translatedModified = modified.map(b => b.add(diff));

          const i = intersection(translatedModified, b1);
          if (i.length >= 12) {
            return translatedModified;
          }
        }
      }
    }
  }

  return null;
}

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  if (l.includes('---')) {
    scanners.set(count, []);
  } else if (l !== '') {
    const [x, y, z] = l.split(',').map(n => Number(n));
    scanners.get(count).push(new Vector(x, y, z));
  } else {
    count++;
  }
});

rl.on('close', () => {
  // console.log(scanners);
  let merged = new Set();

  for (let i = 0; i < scanners.size; i++) {
    for (let j = 0; j < scanners.size; j++) {
      if (i !== j) {
        const alignment = align(scanners.get(i), scanners.get(j));
        if (alignment !== null) {
          for (const b of alignment) {
            if (new Vector(-336, 658, 858).equals(b)) {
              console.log('why?', alignment);
            }
            merged.add(b.toString());
          }

          // console.log('found alignment', j, diff, axis, rot);

          // for (const b of beacons) {
          //   merged.add(transform(b, axis, rot).add(diff).toString());
          // }
        }
      }
    }
  }

  console.log(merged, merged.size);
});
