export default (input) => {
  const rs = input.split(',').map((s) => s.split('-').map((w) => parseInt(w, 10)));

  const isPattern = (s, n) => {
    if (s.length % n) {
      return false;
    }

    const w = s.slice(0, n);

    for (let i = n; i < s.length; i += n) {
      if (s.slice(i, i + n) !== w) {
        return false;
      }
    }

    return true;
  }

  const invalid = (n) => {
    const s = `${n}`;

    for (let i = 1, l = Math.floor(s.length / 2); i <= l; i++) {
      if (isPattern(s, i)) {
        return true;
      }
    }

    return false;
  };

  let z = 0;

  for (const [n, m] of rs) {
    for (let i = n; i <= m; i++) {
      if (invalid(i)) {
        z += i;
      }
    }
  }

  return z;
}
