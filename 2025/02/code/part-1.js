export default (input) => {
  const rs = input.split(',').map((s) => s.split('-').map((w) => parseInt(w, 10)));

  const invalid = (n) => {
    const s = `${n}`;

    if (s.length % 2) {
      return false;
    }

    return s.slice(0, s.length / 2) === s.slice(s.length / 2);
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
