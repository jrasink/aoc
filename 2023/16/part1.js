const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const CELLS = {
  empty: '.',
  mirrorLeft: '/',
  mirrorRight: '\\',
  splitterVertical: '|',
  splitterHorizontal: '-'
};

const DIRECTIONS = {
  N: 'N',
  E: 'E',
  S: 'S',
  W: 'W'
};

const map = input.split('\n').map((s) => s.split(''));
const height = map.length;
const width = map[0].length;

const range = (n) => [...Array(n)].map((_, i) => i);

const passMap = range(height).map(() => range(width).map(() => {
  return Object.values(DIRECTIONS).reduce((o, k) => ({ ...o, [k]: false }), {});
}));


const draw = (map) => map.map((s) => s.join('')).join('\n');

const step = (pos, dir) => {
  const [x, y] = pos;

  if (dir === DIRECTIONS.N) {
    const w = y - 1;
    if (w < 0) {
      return null;
    }
    return [x, w];
  }

  if (dir === DIRECTIONS.S) {
    const w = y + 1;
    if (w >= height) {
      return null;
    }
    return [x, w];
  }

  if (dir === DIRECTIONS.E) {
    const v = x + 1;
    if (v >= width) {
      return null;
    }
    return [v, y];
  }

  if (dir === DIRECTIONS.W) {
    const v = x - 1;
    if (v < 0) {
      return null;
    }
    return [v, y];
  }

  throw `not a direction: '${dir}'`;
};

const next = (pos, dir) => {
  const [x, y] = pos;
  const cell = map[y][x];

  const ds = [];

  if (cell === CELLS.empty) {
    ds.push(dir);
  }

  if (cell === CELLS.mirrorLeft) {
    if (dir === DIRECTIONS.N) {
      ds.push(DIRECTIONS.E);
    }

    if (dir === DIRECTIONS.E) {
      ds.push(DIRECTIONS.N);
    }

    if (dir === DIRECTIONS.S) {
      ds.push(DIRECTIONS.W);
    }

    if (dir === DIRECTIONS.W) {
      ds.push(DIRECTIONS.S);
    }
  }

  if (cell === CELLS.mirrorRight) {
    if (dir === DIRECTIONS.N) {
      ds.push(DIRECTIONS.W);
    }

    if (dir === DIRECTIONS.W) {
      ds.push(DIRECTIONS.N);
    }

    if (dir === DIRECTIONS.S) {
      ds.push(DIRECTIONS.E);
    }

    if (dir === DIRECTIONS.E) {
      ds.push(DIRECTIONS.S);
    }
  }

  if (cell === CELLS.splitterVertical) {
    if ([DIRECTIONS.E, DIRECTIONS.W].includes(dir)) {
      ds.push(DIRECTIONS.N);
      ds.push(DIRECTIONS.S);
    } else {
      ds.push(dir);
    }
  }

  if (cell === CELLS.splitterHorizontal) {
    if ([DIRECTIONS.N, DIRECTIONS.S].includes(dir)) {
      ds.push(DIRECTIONS.E);
      ds.push(DIRECTIONS.W);
    } else {
      ds.push(dir);
    }
  }

  return ds.reduce((xs, d) => {
    const p = step(pos, d);
    console.log('step', p)
    if (p !== null) {
      return [...xs, { pos: p, dir: d }];
    }
    return xs;
  }, []).filter(({ pos: [x, y], dir }) => {
    return passMap[y][x][dir] === false
  });
}

const walk = (pos, dir) => {
  const [x, y] = pos;

  passMap[y][x][dir] = true;

  const ns = next(pos, dir);

  console.log(`pos: ${x}, ${y} dir: ${dir} next: ${JSON.stringify(ns)}`);

  for (const { pos, dir } of ns) {
    walk(pos, dir);
  }
}

console.log(draw(map));
console.log(passMap);

walk([0, 0], DIRECTIONS.E);

const passed = (o) => Object.values(DIRECTIONS).reduce((b, k) => b || o[k], false);
const energized = passMap.map((row) => row.map(passed));

console.log(draw(energized.map((row) => row.map((b) => b ? '#' : '.'))));

const count = energized.map((row) => row.reduce((n, b) => b ? n + 1 : n, 0)).reduce((a, b) => a + b);

console.log(count);

// 7884
