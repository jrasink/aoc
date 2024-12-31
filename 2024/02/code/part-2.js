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

  const options = (xs) => xs.map((_, i) => [...xs.slice(0, i), ...xs.slice(i+1)]);
  const anySafe = (xs) => options(xs).reduce((b, ys) => b || safe(ys), false);

  const xss = parseInput(input);

  const ss = xss.map(anySafe).filter((b) => b);

  return ss.length;
}
