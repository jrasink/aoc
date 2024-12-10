export default (input) => {
  const repeat = (v, n) => [...Array(n)].map(() => v);

  const blocks = input.split('').reduce((blocks, s, n) => [...blocks, { f: (n & 1) ? 0 : 1, v: (n >> 1), l: parseInt(s, 10) }], []);

  let j = blocks.length;

  while ((j--) > 0) {
    if (blocks[j].f) {
      let i = -1;
      while ((i++) < j) {
        if (!blocks[i].f && (blocks[i].l >= blocks[j].l)) {
          blocks.splice(i, 0, { ...blocks[j] });
          i += 1;
          j += 1;
          blocks[i].l -= blocks[j].l;
          blocks[j].f = 0;
          break;
        }
      }
    }
  }

  const ps = blocks.reduce((ps, { f, v, l }) => [...ps, ...repeat({ f, v }, l)], []);

  const r = ps.reduce((r, { f, v }, i) => r + (i * f * v), 0);

  return r;
}
