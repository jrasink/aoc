export default (input) => {
  const DIRECTIONS = {
    R: 'R',
    L: 'L',
    U: 'U',
    D: 'D'
  };

  const parseLine = (s) => {
    const [dir, lenString] = s.split(' ');
    const len = parseInt(lenString, 10);
    return { dir, len };
  }

  const parseInput = (s) => s.split('\n').map(parseLine);

  const draw = (path, fill = []) => {
    const mx = path.map(({ x }) => x).reduce((a, b) => a > b ? a : b);
    const my = path.map(({ y }) => y).reduce((a, b) => a > b ? a : b);

    const map = [];
    for (let y = 0; y <= my; y++) {
      map[y] = [];
      for (let x = 0; x <= mx; x++) {
        map[y][x] = ' ';
      }
    }

    for (const { x, y } of path) {
      map[y][x] = '#';
    }

    for (const { x, y } of fill) {
      map[y][x] = '.';
    }

    return map.map((s) => s.join('')).join('\n');
  };

  const rebase = (path) => {
    const mx = path.map(({ x }) => x).reduce((a, b) => a < b ? a : b);
    const my = path.map(({ y }) => y).reduce((a, b) => a < b ? a : b);
    return path.map(({ x, y, d }) => ({ x: x - mx, y: y - my, d }));
  }

  const next = ({ x, y }, d) => {
    switch(d) {
      case DIRECTIONS.R:
        return { x: x + 1, y, d };
      case DIRECTIONS.L:
        return { x: x - 1, y, d };
      case DIRECTIONS.U:
        return { x, y: y - 1, d };
      case DIRECTIONS.D:
        return { x, y: y + 1, d };
    }
  };

  const right = ({ x, y, d }) => {
    switch(d) {
      case DIRECTIONS.R:
        return { x, y: y + 1 };
      case DIRECTIONS.L:
        return { x, y: y - 1 };
      case DIRECTIONS.U:
        return { x: x + 1, y };
      case DIRECTIONS.D:
        return { x: x - 1, y };
    }
  };

  const walk = (pos, instructions) => {
    const path = [];
    let p = pos;
    for (const { dir, len } of instructions) {
      for (let i = 0; i < len; i++) {
        p = next(p, dir);
        path.push(p);
      }
    }
    return rebase(path);
  };

  const neighbours = ({ x, y }) => {
    const rs = [];
    for (let i = -1; i <= 1; i++) {
      for (let k = -1; k <= 1; k++) {
        rs.push({ x: x + i, y: y + k });
      }
    }
    return rs.filter((p) => !(p.x === x && p.y === y));
  }

  const inSet = ({ x, y }, ps) => ps.reduce((b, p) => b || (p.x === x && p.y === y), false);

  const expand = (ps, path) => {
    let ns, ts = [...ps], ls = [...ps];
    do {
      ns = [];
      for (const l of ls) {
        for (const p of neighbours(l)) {
          if (!inSet(p, path) && !inSet(p, ts) && !inSet(p, ns)) {
            ns.push(p);
          }
        }
      }
      ts.push(...ns);
      ls = ns;
    } while (ns.length > 0);

    return ts;
  }

  const instructions = parseInput(input);

  console.log(instructions);

  const path = walk({ x: 0, y: 0 }, instructions);

  const rights = (() => {
    const ps = [];
    for (const p of path.map(right)) {
      if (!inSet(p, ps) && !inSet(p, path)) {
        ps.push(p);
      }
    }
    return ps;
  })();


  const fill = expand(rights, path);

  console.log(draw(path, fill));

  const volume = path.length + fill.length;

  console.log(volume);

  // 36679

  return volume;
}
