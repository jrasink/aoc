const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const DIRECTIONS = {
  N: 'N',
  E: 'E',
  S: 'S',
  W: 'W'
};

const OPPOSITE = {
  N: 'S',
  E: 'W',
  S: 'N',
  W: 'E',
};

const VISUALIZE = {
  N: '^',
  E: '>',
  S: 'v',
  W: '<'
};

const speedLimit = 3;

const range = (n) => [...Array(n)].map((_, i) => i);

const dump = ({ x, y, d, v }) => `(${x}, ${y}, ${d}, ${v})`;
const dumps = (xs) => xs.map(dump).join(', ');

const parseInput = (input) => {
  const map = input.split('\n').map((s) => s.split('').map((s) => parseInt(s, 10)));
  const height = map.length;
  const width = map[0].length;
  const start = { x: 0, y: 0 };
  const finish = { x: width - 1, y: height - 1 };

  const eq = (a, b) => a.x == b.x && a.y == b.y;

  return {
    // map,
    draw: () => map.map((s) => s.join('')).join('\n'),
    loss: ({ x, y }) => map[y][x],
    height,
    width,
    start: (p) => eq(start, p),
    factory: (p) => eq(finish, p)
  };
};

const map = parseInput(input);

const posFromDirection = ({ x, y }, d) => {
  switch (d) {
    case DIRECTIONS.S:
      return { x, y: y - 1 };
    case DIRECTIONS.W:
      return { x: x + 1, y };
    case DIRECTIONS.N:
      return { x, y: y + 1 };
    case DIRECTIONS.E:
      return { x: x - 1, y };
  }
};

const neighbours = ({ x, y, d, v }) => Object.values(DIRECTIONS)
  .filter((k) => k != OPPOSITE[d])
  .reduce((xs, k) => {
    const p = posFromDirection({ x, y }, k);

    if (v > 1 && k === d) {
      xs.push({ x: p.x, y: p.y, d: k, v: v - 1 });
    }

    if (v == 1 && k !== d) {
      for (let i = 1; i <= speedLimit; i++) {
        xs.push({ x: p.x, y: p.y, d: k, v: i });
      }
    }

    return xs;
  }, [])
  .filter(({ x, y }) => x >= 0 && x < map.width && y >= 0 && y < map.height);

const finishPositions = (() => {
  const ps = [];
  for (const d of [DIRECTIONS.S, DIRECTIONS.E]) {
    for (const v of range(speedLimit).map((n) => n + 1)) {
      ps.push({ x: map.width - 1, y: map.height - 1, v, d });
    }
  }
  return ps;
})();

const optimals = (() => {
  const o = {};
  const key = (p) => dump(p);
  return {
    o,
    has: (p) => key(p) in o,
    get: (p) => o[key(p)],
    set: (p, v) => { o[key(p)] = v }
  };
})();

const processPosition = (p) => {
  const loss = optimals.get(p) + map.loss(p);
  const ns = neighbours(p);
  const changed = [];

  // console.log(`at ${dump(p)}, min path ${loss} for neighbours ${dumps(ns)}`);

  for (const n of ns) {
    if (!optimals.has(n) || optimals.get(n) > loss) {
      optimals.set(n, loss);
      changed.push(n);
    }
  }

  return changed;
};

for (const p of finishPositions) {
  optimals.set(p, 0);
}

let ps = finishPositions;

let step = 0;

while(true) {
  step += 1;
  const changed = ps.map(processPosition).reduce((xs, ys) => [...xs, ...ys]);
  console.log(`processing step ${step}, changes ${changed.length}`);
  if (!changed.length) {
    break;
  }
  ps = changed;
}

console.log(`done mapping, took ${step} steps`);

// console.log(optimals.o)

const a = { x: 1, y: 0, d: DIRECTIONS.E, v: 1 };
const b = { x: 0, y: 1, d: DIRECTIONS.S, v: 1 };

const m = [a, b].map((p) => optimals.get(p) + map.loss(p)).reduce((a, b) => a < b ? a : b);

console.log(m);

// 847
