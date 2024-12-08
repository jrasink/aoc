export default (input) => {
  const C = {
    free: '.',
    obstacle: '#',
    start: '^'
  };

  const matrix = input.split('\n').map((s) => s.split(''));
  const rows = matrix.length;
  const cols = matrix[0].length;

  const offset = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const dirs = offset.length;

  const bmap = matrix.map((cs) => cs.map((c) => c === C.obstacle));

  const start = (() => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (matrix[y][x] === C.start) {
          return { x, y, d: 0 };
        }
      }
    }
  })();

  const move = ({ x, y, d }) => ({ x: x + offset[d][0], y: y + offset[d][1], d });
  const rot = ({ x, y, d }) => ({ x, y, d: (d + 1) % dirs });

  const walk = (start, bmap, dmap) => {
    const path = [];

    let current = start;

    while (true) {
      path.push(current);

      const { x, y, d } = move(current);

      if (y < 0 || y >= rows || x < 0 || x >= cols) {
        return { path, loop: false };
      }

      if (dmap[y][x][d]) {
        return { path, loop: true };
      }

      dmap[y][x][d] = true;

      if (bmap[y][x]) {
        current = rot(current);
      } else {
        current = { x, y, d };
      }
    }
  };

  const dmap = [...Array(rows)].map(() => [...Array(cols)].map(() => [...Array(dirs)]));
  const getDmapCopy = () => dmap.map((xs) => xs.map((xs) => [...xs]));

  const { path } = walk(start, bmap, getDmapCopy());

  let results = 0;

  const tmap = [...Array(rows)].map(() => [...Array(cols)]);

  let lpos = path.shift();

  for (const { x, y, d } of path) {
    if (!tmap[y][x]) {
      const testBmap = bmap.map((bs, by) => bs.map((b, bx) => by === y && bx === x ? true : b));
      const { loop } = walk(lpos, testBmap, getDmapCopy());
      if (loop) {
        results += 1;
      }
      tmap[y][x] = true;
    }
    dmap[y][x][d] = true;
    lpos = { x, y, d };
  }

  return results;
};
