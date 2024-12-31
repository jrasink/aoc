export default (input) => {
  const blocks = input.split('').reduce((blocks, s, i) => [...blocks, { f: (i & 1) ? 0 : 1, v: (i >> 1), l: parseInt(s, 10) }], []);

  const repeat = (x, n) => [...Array(n)].map(() => x);
  const ps = blocks.reduce((vs, { f, v, l }) => [...vs, ...repeat({ f, v }, l)], []);

  let i = 0, j = ps.length - 1;

  while (i < j) {
    if (ps[i].f) {
      i += 1;
    } else if (!ps[j].f) {
      j -= 1;
    } else {
      let p = { ...ps[i] };
      ps[i] = { ...ps[j] };
      ps[j] = p;
    }
  }

  return ps.reduce((r, { f, v }, i) => r + (i * f * v), 0);
}
