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

  const copy = (xs) => xs.map((x) => x);

  const pIndex = ({ x, y }) => x + y * cols;
  const dIndex = ({ x, y, d }) => d + dirs * pIndex({ x, y });

  const bmap = Array(rows * cols);
  let start;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (matrix[y][x] === C.obstacle) {
        const i = pIndex({ x, y });
        bmap[i] = true;
      }
      if (matrix[y][x] === C.start) {
        start = { x, y, d: 0 };
      }
    }
  }

  const move = ({ x, y, d }) => ({ x: x + offset[d][0], y: y + offset[d][1], d });
  const rot = ({ x, y, d }) => ({ x, y, d: (d + 1) % dirs });

  const walk = (start, bmap, odmap) => {
    const dmap = copy(odmap);
    const path = [];

    let current = start;

    while (true) {
      path.push(current);

      const { x, y, d } = move(current);

      if (y < 0 || y >= rows || x < 0 || x >= cols) {
        return { path, loop: false };
      }

      const j = dIndex({ x, y, d });

      if (dmap[j]) {
        return { path, loop: true };
      }

      dmap[j] = true;

      const i = pIndex({ x, y });

      if (bmap[i]) {
        current = rot(current);
      } else {
        current = { x, y, d };
      }
    }
  };

  const dmap = Array(rows * cols * dirs);

  const { path } = walk(start, bmap, dmap);

  let results = 0;

  const tmap = Array(rows * cols);

  for (const { x, y, d } of path) {
    const i = pIndex({ x, y });
    if (!tmap[i]) {
      tmap[i] = true;
      results += 1;
    }
  }

  return results;
};
