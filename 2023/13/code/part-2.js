export default (input) => {
  const range = (n) => [...Array(n)].map((_, i) => i);

  const parsePatternString = (s) => {
    const rs = s.split('\n');
    const width = rs[0].length;
    const height = rs.length;
    const matrix = rs.join('');

    return {
      matrix,
      width,
      height
    };
  };

  const parseInput = (s) => s.split('\n\n').map(parsePatternString);

  const pos = (pattern, x, y) => x + pattern.width * y;
  const cell = (pattern, x, y) => pattern.matrix[pos(pattern, x, y)];
  const row = (pattern, y) => range(pattern.width).map((x) => cell(pattern, x, y)).join('');
  const col = (pattern, x) => range(pattern.height).map((y) => cell(pattern, x, y)).join('');

  const rows = (pattern) => range(pattern.height).map((y) => row(pattern, y));
  const cols = (pattern) => range(pattern.width).map((x) => col(pattern, x));

  const draw = (pattern) => rows(pattern).join('\n');
  const drawTransposed = (pattern) => cols(pattern).join('\n');

  const compare = (xs, i) => {
    for (let k = 0, w = Math.min(i, xs.length - i - 2) + 1; k < w; k++) {
      if (xs[i - k] != xs[i + k + 1]) {
        return false;
      }
    }
    return true;
  }

  const find = (xs) => {
    const ys = [];
    for (let i = 0, m = xs.length - 1; i < m; i++) {
      if (compare(xs, i)) {
        ys.push(i);
      }
    }
    return ys;
  };

  const reflect = (pattern) => {
    const xs = rows(pattern);
    const rs = find(xs);

    const ys = cols(pattern);
    const cs = find(ys);

    return [rs, cs];
  }

  const flip = (s) => s == '#' ? '.' : '#';

  const foul = (rs, i) => {
    const as = rs.slice(0, i);
    const bs = rs.slice(i + 1);
    const c = rs[i];
    return [as, flip(c), bs].join('');
  };

  const reflectSmudged = ({ matrix, width, height }) => {
    const [wrs, wcs] = reflect({ matrix, width, height });

    const rrs = [];
    const rcs = [];

    for (let i = 0, m = matrix.length; i < m; i++) {
      const [rs, cs] = reflect({ matrix: foul(matrix, i), width, height });
      rrs.push(...rs.filter((r) => !(wrs).includes(r) && !rrs.includes(r)));
      rcs.push(...cs.filter((c) => !(wcs).includes(c) && !rcs.includes(c)));
    }

    return [rrs, rcs];
  }

  const calculate = (pattern) => {
    const [rs, cs] = reflectSmudged(pattern);

    if ((rs.length + cs.length) !== 1) {
      throw `found too many results or none`;
    }

    if (rs.length > 0) {
      const [r] = rs;
      return 100 * (r + 1);
    }

    const [c] = cs;
    return c + 1;
  };

  const pattern = parseInput(input);

  const notes = pattern.map(calculate);

  const sum = notes.reduce((a, b) => a + b);

  console.log(sum);

  // 31836

  return sum;
}
