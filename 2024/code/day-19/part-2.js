export default (input) => {
  const [towelsString, patternsString] = input.split('\n\n');
  const towels = towelsString.split(', ');
  const patterns = patternsString.split('\n');

  const memoize = (f) => {
    const m = {};
    return (...xs) => {
      const k = xs.join(',');
      if (!(k in m)) {
        m[k] = f(...xs);
      }
      return m[k];
    }
  }

  const test = memoize((pattern) => {
    if (pattern.length === 0) {
      return 1;
    }

    let n = 0;

    for (const towel of towels) {
      if (pattern.slice(0, towel.length) === towel) {
        n += test(pattern.slice(towel.length));
      }
    }

    return n;
  });

  return patterns.reduce((n, pattern) => n + test(pattern), 0);
}
