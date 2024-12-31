export default (input) => {
  const blocks = input.split('').reduce((blocks, s, i) => [...blocks, { f: (i & 1) ? 0 : 1, v: (i >> 1), l: parseInt(s, 10) }], []);

  let j = blocks.length - 1;

  while (j > 0) {
    if (blocks[j].f) {
      let i = 0;
      while (i < j) {
        if (!blocks[i].f && (blocks[i].l >= blocks[j].l)) {
          blocks.splice(i, 0, { ...blocks[j] });
          i += 1;
          j += 1;
          blocks[i].l -= blocks[j].l;
          blocks[j].f = 0;
          break;
        }
        i += 1;
      }
    }
    j -= 1;
  }

  let r = 0;
  let k = 0;

  for (let i = 0; i < blocks.length; i++) {
    const { f, v, l } = blocks[i];
    for (let m = k + l; k < m; k++) {
      r += f * v * k;
    }
  }

  return r;
}
