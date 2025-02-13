export default (input) => {
  const lines = input.split('\n');

  const [line] = lines;

  const val = (c) => {
    switch (c) {
      case '(':
        return 1;
      case ')':
        return -1;
      default:
        throw new Error(`waa: '${c}'`);
    }
  }

  const cs = line.split('');

  const find = (cs) => {
    let f = 0;
    let i = 0;

    for (const c of cs) {
      i += 1;
      f += val(c);
      if (f < 0) {
        return i;
      }
    }

    return null;
  }

  const p = find(cs);

  return p;
}
