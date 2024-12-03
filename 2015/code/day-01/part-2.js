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

// Running year 2015, day 1, part 2 with real input (size 7000)
// ---
// Elapsed: 0.314ms
// Result: 1795
