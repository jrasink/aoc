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
      return true;
    }

    for (const towel of towels) {
      if (pattern.slice(0, towel.length) === towel && test(pattern.slice(towel.length))) {
        return true;
      }
    }

    return false;
  });

  return patterns.filter(test).length;
}
