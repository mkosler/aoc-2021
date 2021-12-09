const readline = require('readline');

// let uniques = [];
// let digits = [];
let pairs = [];

const subset = (a, b) => b.every(x => a.includes(x));
const equals = (a, b) => {
  return a.length === b.length && a.every(x => b.includes(x))
};
const error = (n, a) => `Multiple ${i}s: ${a}`;

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (l) => {
  const [left, right] = l.split(' | ');

  pairs.push([
    Array.from(left.matchAll(/\w+/g), m => m[0].split('')),
    Array.from(right.matchAll(/\w+/g), m => m[0].split(''))
  ]);
});

rl.on('close', () => {
  let total = 0;

  for (const [unis, digits] of pairs) {
    let numerals = new Array(10);
    let segments = {
      t: [],
      tl: [],
      tr: [],
      m: [],
      bl: [],
      br: [],
      b: []
    };

    numerals[1] = unis.filter(n => n.length === 2);
    numerals[4] = unis.filter(n => n.length === 4);
    numerals[7] = unis.filter(n => n.length === 3);
    numerals[8] = unis.filter(n => n.length === 7);

    numerals[0] = unis.filter(n => n.length === 6);
    numerals[6] = unis.filter(n => n.length === 6);
    numerals[9] = unis.filter(n => n.length === 6);

    numerals[2] = unis.filter(n => n.length === 5);
    numerals[3] = unis.filter(n => n.length === 5);
    numerals[5] = unis.filter(n => n.length === 5);

    // We know segments tr and br are made from numeral 1
    if (numerals[1].length > 1) throw error(1, numerals[1]);
    segments.tr = numerals[1][0];
    segments.br = numerals[1][0];

    // For 3, it contains 1, so it must include both segments in 1
    numerals[3] = numerals[3].filter(n => subset(n, numerals[1][0]));
    numerals[2] = numerals[2].filter(n => !equals(n, numerals[3][0]));
    numerals[5] = numerals[5].filter(n => !equals(n, numerals[3][0]));

    // Now that we know numerals 3 and 1, segments t, m, and b
    // must be the segments in 3 but not in 1
    if (numerals[3].length > 1) throw error(3, numerals[3]);
    segments.t = numerals[3][0].filter(n => !numerals[1][0].includes(n));
    segments.m = numerals[3][0].filter(n => !numerals[1][0].includes(n));
    segments.b = numerals[3][0].filter(n => !numerals[1][0].includes(n));

    // For 9, it contains 3, so it must include all segments in 3
    // numerals[9] = numerals[9].filter(n => n.includes(numerals[3][0]));
    numerals[9] = numerals[9].filter(n => subset(n, numerals[3][0]));
    numerals[6] = numerals[6].filter(n => !equals(n, numerals[9][0]));
    numerals[0] = numerals[0].filter(n => !equals(n, numerals[9][0]));

    // Now that we know numerals 3 and 9, segment tl must be the segment
    // in 9 but not in 3
    if (numerals[9].length > 1) throw error(9, numerals[9]);
    segments.tl = numerals[9][0].filter(n => !numerals[3][0].includes(n));

    // For 0 and 6, only one of these contains the numeral 1. Therefore,
    // the unique that includes both segments of 1 is the numeral 0,
    // and the unique that only includes one is numeral 6
    numerals[0] = numerals[0].filter(n => subset(n, numerals[1][0]));
    if (numerals[0].length > 1) throw error(0, numerals[0]);
    numerals[6] = numerals[6].filter(n => !equals(n, numerals[0][0]));
    if (numerals[6].length > 1) throw error(6, numerals[6]);

    // Now that we know numerals 0 and 8, segment m must be the segment
    // in 8 but not in 0
    segments.m = numerals[8][0].filter(n => !numerals[0][0].includes(n));
    segments.t = segments.t.filter(n => n !== segments.m[0]);
    segments.b = segments.b.filter(n => n !== segments.m[0]);

    // Now that we know numerals 6 and 8, segment tr must be the segment
    // in 8 but not in 6
    segments.tr = numerals[8][0].filter(n => !numerals[6][0].includes(n));

    // Now that we know numerals 9 and 8, segment bl must be the segment
    // in 8 but not in 9
    segments.bl = numerals[8][0].filter(n => !numerals[9][0].includes(n));

    // Now that we know which segment is tr, segment br must be the other
    // segment in numeral 1
    segments.br = numerals[1][0].filter(n => n !== segments.tr[0]);

    // Now that we know numeral 7, segment t must be in numeral 7, and
    // segment b must not be in numeral 7
    segments.t = segments.t.filter(n => numerals[7][0].includes(n));
    segments.b = segments.b.filter(n => !numerals[7][0].includes(n));

    // For numeral 2, it should not contain the value in the tl segment
    numerals[2] = numerals[2].filter(n => !n.includes(segments.tl[0]));

    // For numeral 5, it should not contain the value in the tr segment
    numerals[5] = numerals[5].filter(n => !n.includes(segments.tr[0]));

    // console.log('Numerals', numerals);
    // console.log('Segments', segments);

    // We should have all the segments with only one option each by now
    if (Object.values(segments).some(s => s.length > 1)) throw 'Too many options in a segment';

    // We also should have all the numerals with only one option each by now
    if (numerals.some(n => n.length > 1)) throw 'Too many options in a numeral';

    // Finally, for each digit see which numeral it corresponds to
    let str = '';

    for (const d of digits) {
      for (const [i, n] of numerals.entries()) {
        if (equals(d, n[0])) str += i;
      }
    }

    total += Number(str);
  }

  console.log(total);
});
