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

  const blockMap = matrix.map((cs) => cs.map((c) => c === C.obstacle));

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

  const walk = (blockMap, start) => {
    const isBlocked = ({ x, y }) => blockMap[y][x];
    const isInside = ({ x, y }) => y >= 0 && y < rows && x >= 0 && x < cols;

    const positionVisitMap = [...Array(rows)].map(() => [...Array(cols)]);
    const directionVisitMap = [...Array(rows)].map(() => [...Array(cols)].map(() => [...Array(dirs)]));

    const isVisited = ({ x, y }) => !!positionVisitMap[y][x];
    const isVisitedInDirection = ({ x, y, d }) => !!directionVisitMap[y][x][d];

    const path = [];

    const visit = ({ x, y, d }) => {
      if (!isVisited({ x, y })) {
        path.push({ x, y });
        positionVisitMap[y][x] = true;
      }
      directionVisitMap[y][x][d] = true;
    }

    let current = start;

    while (true) {
      visit(current);

      const next = move(current);

      if (!isInside(next)) {
        return { path, loop: false };
      }

      if (isVisitedInDirection(next)) {
        return { path, loop: true };
      }

      if (isBlocked(next)) {
        current = rot(current);
      } else {
        current = next;
      }
    }
  };

  const { path } = walk(blockMap, start);

  const test = (p) => {
    const testBlockMap = blockMap.map((bs, y) => bs.map((b, x) => p.y === y && p.x === x ? true : b));
    const { loop } = walk(testBlockMap, start);
    return loop;
  };

  const n = path.map(test).filter((b) => b).length;

  return n;
};
