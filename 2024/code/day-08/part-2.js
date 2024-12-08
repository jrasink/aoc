export default (input) => {
  const C = {
    empty: '.'
  };

  const matrix = input.split('\n').map((s) => s.split(''));
  const rows = matrix.length;
  const cols = matrix[0].length;

  const inside = ({ x, y }) => x >= 0 && x < cols && y >= 0 && y < rows;

  const has = (ps, q) => {
    for (const p of ps) {
      if (p.x === q.x && p.y === q.y) {
        return true;
      }
    }
    return false;
  }

  const unique = (ps) => {
    const rs = [];
    for (const p of ps) {
      if (!has(rs, p)) {
        rs.push(p);
      }
    }
    return rs;
  }

  const frequencies = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (matrix[y][x] !== C.empty && !frequencies.includes(matrix[y][x])) {
        frequencies.push(matrix[y][x]);
      }
    }
  }

  const groups = [];

  for (const f of frequencies) {
    const ps = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (matrix[y][x] === f) {
          ps.push({ x, y });
        }
      }
    }
    groups.push(ps);
  }

  const pairs = (ps) => {
    const rs = [];
    for (let a = 0; a < ps.length; a++) {
      for (let b = a + 1; b < ps.length; b++) {
        rs.push([ps[a], ps[b]]);
      }
    }
    return rs;
  }


  const nodes = ([p, q]) => {
    const dx = p.x - q.x;
    const dy = p.y - q.y;

    const rs = [];
    const n = Math.max(rows, cols);

    for (let i = -n; i <= n; i++) {
      rs.push({ x: p.x + dx * i, y: p.y + dy * i });
    }

    return rs.filter(inside);
  }

  const ns = [];

  for (const as of groups) {
    for (const pair of pairs(as)) {
      ns.push(...nodes(pair));
    }
  }

  const us = unique(ns);

  return us.length;
};
