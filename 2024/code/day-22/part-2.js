export default (input) => {
  const seeds = input.split('\n').map((s) => parseInt(s, 10));

  const next = (n) => {
    n = (n ^ (n << 6)) & 16777215;
    n = (n ^ (n >> 5)) & 16777215;
    n = (n ^ (n << 11)) & 16777215;
    return n;
  }

  const s2i = (ds) => ds.reduce((s, d) => 19 * s + (d + 9), 0);
  const i2s = (i) => [3, 2, 1, 0].map((n) => (Math.floor(i / (19 ** n)) % 19) - 9, []);

  const profile = (n) => {
    const map = [...Array(19 ** 4)].map(() => 0);
    const set = [...Array(19 ** 4)].map(() => false);

    const ds = [];
    let p = n % 10;

    for (let i = 0; i < 2000; i++) {
      let m = next(n);

      const q = m % 10;
      const d = p - q;

      ds.push(d);

      if (i > 2) {
        const k = s2i(ds);

        if (!set[k]) {
          map[k] = q;
          set[k] = true;
        }

        ds.shift();
      }

      n = m;
      p = q;
    }

    return map;
  }

  const profiles = seeds.map(profile);

  let max = 0;

  for (let i = 0, m = 19 ** 4; i < m; i++) {
    let sum = 0;

    for (const map of profiles) {
      sum += map[i];
    }

    if (sum > max) {
      max = sum;
    }
  }

  return max;
}
