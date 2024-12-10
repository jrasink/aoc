export default (input) => {
  const repeat = (v, n) => [...Array(n)].map(() => v);

  const blocks = input.split('').reduce((blocks, s, n) => [...blocks, { f: (n & 1) ? 0 : 1, v: (n >> 1), l: parseInt(s, 10) }], []);

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
