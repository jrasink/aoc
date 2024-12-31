export default (input) => {
  const PATH = '.';

  const FOREST = '#';

  const SLOPE = {
    N: '^',
    E: '>',
    S: 'v',
    W: '<'
  };

  const stepOptions = ({ x, y }, s) => {
    switch(s) {
      case '#':
        return [];
      case '.':
        return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
      case '^':
        return [{ x, y: y - 1 }];
      case '>':
        return [{ x: x + 1, y }];
      case 'v':
        return [{ x, y: y + 1 }];
      case '<':
        return [{ x: x - 1 }];
    }
  }

  const parseInput = (input) => {
    const cells = input.split('\n').map((s) => s.split(''));
    const map = [];

    const width = cells[0].length;
    const height = cells.length;

    const flatIndex = ({ x, y }) => (x + width * y);

    const start = flatIndex({ x: 1, y: 0 });
    const finish = flatIndex({ x: width - 2, y: height - 1 });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = cells[y][x];
        const i = flatIndex({ x, y });

        map[i] = {
          pos: { x, y },
          cell,
          isPath: cell === PATH,
          isForest: cell === FOREST,
          isSlope: Object.values(SLOPE).includes(cell),
          isStart: i === start,
          isFinish: i === finish,
          next: stepOptions({ x, y }, cell).filter(({ x: x1, y: y1 }) => x1 >= 0 && x1 < width && y1 >= 0 && y1 < height && cells[y1][x1] !== '#').map(flatIndex)
        };
      }
    }

    return { map, width, height, start, finish };
  };

  const draw = ({ map, width }, path = []) => {
    const rows = [];

    for (const [i, { pos: { x, y }, cell, isStart, isFinish }] of Object.entries(map)) {
      if (!rows[y]) {
        rows[y] = [];
      }

      if (isStart) {
        rows[y][x] = 'S';
      } else if (isFinish) {
        rows[y][x] = 'F';
      } else if (path.includes(y * width + x)) {
        rows[y][x] = 'O';
      } else {
        rows[y][x] = cell;
      }
    }

    return rows.map((row) => row.join('')).join('\n');
  }

  const world = parseInput(input);

  const memoize = (f) => {
    const m = {};
    return (world, ps) => {
      const k = ps.join(',');
      if (!(k in m)) {
        m[k] = f(world, ps);
      }
      return m[k];
    }
  };

  const walk = memoize(({ map, finish }, path) => {
    let pos = path[path.length - 1];

    if (pos === finish) {
      return path;
    }

    const ns = map[pos].next.filter((p) => !path.includes(p));

    if (ns.length === 0) {
      return null;
    }

    const paths = ns.map((n) => walk({ map, finish }, [...path, n])).filter((path) => path !== null);

    if (paths.length === 0) {
      return null;
    }

    return paths.reduce((a, b) => a.length > b.length ? a : b);
  });

  // console.log(draw(world));

  const path = walk(world, [world.start]);

  console.log(draw(world, path));

  console.log('');

  console.log(path.length - 1);

  // node --stack-size=16000 part1.js
  // 2414

  return path.length - 1;
}
