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

  const tiltSection = (s) => {
    const n = s.split('').filter((c) => c === 'O').length;
    return ['O'.repeat(n), '.'.repeat(s.length - n)].join('');
  }

  const tiltLine = (s) => s.split('#').map(tiltSection).join('#');

  const tilt = (pattern) => transpose({ ...pattern, map: cols(pattern).map(tiltLine).join('') });

  const load = (pattern) => rows(pattern).map((row, y) => row.split('').filter((c) => c === 'O').length * (pattern.height - y)).reduce((a, b) => a + b);

  // const tilted = tilt(pattern);

  const n = load(tilt(pattern));

  console.log(n);

  // 110274

  return n;
}
