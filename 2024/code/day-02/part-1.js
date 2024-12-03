export default (input) => {
  const parseInput = (s) => s.split('\n').map((s) => s.split(' ').map((s) => parseInt(s, 10)));

  const sig = (x) => x < 0 ? -1 : (x > 0 ? 1 : 0);
  const abs = (x) => x * sig(x);

  const min = 1;
  const max = 3;

  const safe = (xs) => {
    let l;

    for (let i = 1; i < xs.length; i++) {
      const d = xs[i] - xs[i - 1];
      const s = sig(d);
      const a = abs(d);

      if (s === 0) {
        return false;
      }

      if (i > 1 && s !== l) {
        return false;
      }

      if (a < min) {
        return false;
      }

      if (a > max) {
        return false;
      }

      l = s;
    }

    return true;
  };

  const xss = parseInput(input);

  const ss = xss.map(safe).filter((b) => b);

  return ss.length;
}

// Running year 2024, day 2, part 1 with real input (size 19341)
// ---
// Elapsed: 2.115ms, result: 549
