export default (input) => {
  const range = (n) => [...Array(n)].map((_, i) => i);

  const parseInput = (s) => {
    const rs = s.split('\n');
    const width = rs[0].length;
    const height = rs.length;
    const map = rs.join('');

    return {
      map,
      width,
      height
    };
  };

  const pos = (pattern, x, y) => x + pattern.width * y;
  const cell = (pattern, x, y) => pattern.map[pos(pattern, x, y)];
  const row = (pattern, y) => range(pattern.width).map((x) => cell(pattern, x, y)).join('');
  const col = (pattern, x) => range(pattern.height).map((y) => cell(pattern, x, y)).join('');

  const rows = (pattern) => range(pattern.height).map((y) => row(pattern, y));
  const cols = (pattern) => range(pattern.width).map((x) => col(pattern, x));

  const transpose = (pattern) => ({ ...pattern, map: cols(pattern).join('') });

  const draw = (pattern) => rows(pattern).join('\n');

  const pattern = parseInput(input);

  const load = (pattern) => rows(pattern).map((row, y) => row.split('').filter((c) => c === 'O').length * (pattern.height - y)).reduce((a, b) => a + b);

  const tiltSectionUp = (s) => {
    const n = s.split('').filter((c) => c === 'O').length;
    return ['O'.repeat(n), '.'.repeat(s.length - n)].join('');
  }

  const tiltSectionDown = (s) => {
    const n = s.split('').filter((c) => c === 'O').length;
    return ['.'.repeat(s.length - n), 'O'.repeat(n)].join('');
  }

  const tiltLineUp = (s) => s.split('#').map(tiltSectionUp).join('#');
  const tiltLineDown = (s) => s.split('#').map(tiltSectionDown).join('#');

  const tiltN = (pattern) => transpose({ ...pattern, map: cols(pattern).map(tiltLineUp).join('') });
  const tiltW = (pattern) => ({ ...pattern, map: rows(pattern).map(tiltLineUp).join('') });
  const tiltS = (pattern) => transpose({ ...pattern, map: cols(pattern).map(tiltLineDown).join('') });
  const tiltE = (pattern) => ({ ...pattern, map: rows(pattern).map(tiltLineDown).join('') });

  const cycle = (pattern) => [tiltN, tiltW, tiltS, tiltE].reduce((p, f) => f(p), pattern);
  const spin = (pattern, n) => range(n).reduce((p) => cycle(p), pattern);

  const findSpinPattern = (pattern) => {
    const m = {};

    let p = pattern;
    let i = 0;

    while (true) {
      const k = p.map;

      if (!(k in m)) {
        m[k] = [];
      }

      m[k].push(i);

      if (m[k].length > 1) {
        const [a, b] = m[k];
        return { offset: a, length: b - a, p };
      }

      p = cycle(p);
      i += 1;
    }
  };

  const { offset, length, p } = findSpinPattern(pattern);

  // const p1 = spin(pattern, offset);
  // const p2 = spin(pattern, offset + 40 * length);

  // console.log(draw(p1)); console.log(''); console.log(draw(p2));
  // console.log(p1.map === p2.map);

  const n = 1000000000;
  const m = (n - offset) % length;

  // console.log(`spin pattern of length ${length} found at ${offset} -- spinning an additional ${m} times after ${offset} is equivalent to ${n} spins from base`);

  const r = load(spin(p, m));

  console.log(r);

  // 90982

  return r;
}
