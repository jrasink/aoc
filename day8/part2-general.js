const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const parseNode = (s) => {
  const { id, L, R } = s.match(/^(?<id>\w+) = \((?<L>\w+), (?<R>\w+)\)$/).groups;
  return { id, L, R };
};

const parseInput = (s) => {
  const [seqString, _empty, ...nodeStrings] = s.split('\n');
  const seq = seqString.split('');
  const map = nodeStrings.map(parseNode).reduce((map, { id, L, R }) => ({ ...map, [id]: { L, R } }), {});
  return { seq, map };
}

const findLoops = (node, map, seq) => {
  const path = [];
  let pos = node;
  let p;

  while (true) {
    const i = path.length % seq.length;
    const d = seq[i];

    p = pos + `00${i}`.slice(-3);

    if (path.includes(p)) {
      break;
    }

    path.push(p);

    pos = map[pos][d];
  }

  const offset = path.indexOf(p);
  const length = path.length - offset;

  // i 0, 1, 2, 3, 4, 5
  // z x, 0, 1, 0, 1, 0 / go 1: offset 1, length 5
  //   0, 1, 0, 1, 0
  //   0, 1, 0, 1, 0
  //   0, 1, 0, 1, 0
  //   ...
  // eq
  //   x, x, x, x, x
  //   x, 0, 1, 0, 1
  //   0, 0, 1, 0, 1
  //   0, 0, 1, 0, 1
  //   ...
  //   zs: [2, 4], length: 5

  // i 0, 1, 2, 3, 4, 5, 6
  // z x, x, x, 1, 0, 0, 1 / go 3: offset 3, length 4
  //   1, 0, 0, 1
  //   1, 0, 0, 1
  //   1, 0, 0, 1
  //   ...
  // eq
  //   x, x, x, x
  //   x, x, x, 1
  //   0, 0, 1, 1
  //   0, 0, 1, 1
  //   ...
  //   zs: [2, 3], length: 4

  // i 0, 1, 2
  // z x, 0, 1 / go 1: offset 1, length 2
  //   0, 1,
  //   0, 1,
  //   ...
  // eq
  //   x, x
  //   x, 0
  //   1, 0
  //   1, 0
  //   ...
  //   zs: [0], length: 2

  // so we can define the pattern by a list of z positions and a length
  // the pattern will be wrong only for the first (offset + length) positions, which can be covered by simpler methods and therefore ignored

  const zs = path.filter((s) => s[2] === 'Z').map((s) => path.indexOf(s) % length).sort((a, b) => a - b);

  // console.log(path.join(' -> '), offset, length);
  // console.log({ zs, length });

  return { zs, length };
};

const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => (a * b) / gcd(a, b);

const generate = ({ length, zs }) => {
  let i = 0;
  let j = 0;

  return () => {
    const res = j * length + zs[i];
    i += 1;
    if (i >= zs.length) {
      i = 0;
      j += 1;
    }
    return res;
  }
};

const combineLoops = (a, b) => {
  const m = lcm(a.length, b.length);

  const ag = generate(a);
  const bg = generate(b);

  const zs = [];
  let az = ag();
  let bz = bg();

  do {
    if (az == bz) {
      zs.push(az);
    }

    if (az > bz) {
      bz = bg();
    } else {
      az = ag();
    }
  } while (az < m && bz < m);

  console.log({ zs, length: m });

  return { zs, length: m };
};

const { seq, map } = parseInput(input);

const inits = Object.keys(map).filter((s) => s[2] === 'A');

const loops = inits.map((node) => findLoops(node, map, seq));

const loop = loops.reduce(combineLoops);

console.log(`loop z positions: ${loop.zs.join('; ')}`);
console.log(`loop repeats every: ${loop.length}`);

console.log('-> we found just one z position in the combined loop, and it is zero.');
console.log('-> we know from walking that the first 30k or so iterations do not result in a match, and anyway we did not start at a z position.');
console.log('-> this means that the answer is the first z position after one loop length:');

const n = loop.zs[0] + loop.length;

console.log(n);

// 18215611419223
