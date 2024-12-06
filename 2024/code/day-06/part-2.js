export default (input) => {
  const C = {
    free: '.',
    obstacle: '#'
  };

  const D = {
    n: '^',
    s: 'v',
    e: '>',
    w: '<'
  };

  const matrix = input.split('\n').map((s) => s.split(''));
  const rows = matrix.length;
  const cols = matrix[0].length;

  const isValid = ({ x, y }) => y >= 0 && y < rows && x >= 0 && x < cols;
  const index = ({ x, y }) => rows * y + x;
  const coords = (k) => ({ x: k % rows, y: Math.floor(k / rows) });

  const blocks = [];
  let start;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < rows; x++) {
      if (matrix[y][x] === C.obstacle) {
        blocks.push(index({ x, y }));
      }
      if (matrix[y][x] === D.n) {
        start = { k: index({ x, y }), d: D.n };
      }
    }
  }

  const move = ({ k, d }) => {
    const ret = (p) => isValid(p) ? { d, k: index(p) } : null;

    const { x, y } = coords(k);

    switch (d) {
      case D.n:
        return ret({ x, y: y - 1 });
      case D.s:
        return ret({ x, y: y + 1 });
      case D.e:
        return ret({ x: x + 1, y });
      case D.w:
        return ret({ x: x - 1, y });
    }
  };

  const rot = ({ k, d }) => {
    switch (d) {
      case D.n:
        return { k, d: D.e };
      case D.s:
        return { k, d: D.w };
      case D.e:
        return { k, d: D.s };
      case D.w:
        return { k, d: D.n };
    }
  };

  const visited = (path, p) => {
    for (const { k, d } of path) {
      if (k === p.k && d === p.d) {
        return true;
      }
    }
    return false;
  };

  const walk = (blocks, start) => {
    const path = [];

    const visit = (p) => {
      path.push({ k: p.k, d: p.d });
    }

    let current = start;

    while (true) {
      visit(current);

      const next = move(current);

      if (!next) {
        return { path, loop: false };
      }

      if (visited(path, next)) {
        return { path, loop: true };
      }

      if (blocks.includes(next.k)) {
        current = rot(current);
      } else {
        current = next;
      }
    }
  };

  const { path } = walk(blocks, start);

  const uniqueCandidates = path.map(({ k }) => k).reduce((cs, k) => cs.includes(k) ? cs : [...cs, k], []);

  const test = (k) => {
    const testBlocks = [...blocks, k];
    const { loop } = walk(testBlocks, start);
    return loop;
  };

  const n = uniqueCandidates.map(test).filter((b) => b).length;

  return n;
};
