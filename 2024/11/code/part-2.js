export default (input) => {
  const digits = (n) => `${n}`.split('').map((s) => parseInt(s, 10));
  const number = (ds) => ds.reduce((n, d) => 10 * n + d, 0);

  const step = (n) => {
    if (n === 0) {
      return [1];
    }

    const ds = digits(n);

    if (ds.length % 2) {
      return [2024 * n];
    }

    const l = ds.length / 2;
    const ls = ds.slice(0, l);
    const rs = ds.slice(l);

    return [number(ls), number(rs)];
  }

  let xs = input.split(' ').map((s) => parseInt(s, 10)).map((n) => ({ number: n, count: 1 }));

  for (let i = 0; i < 75; i++) {
    const cs = Array();
    const us = [];

    for (const { number, count } of xs) {
      for (const n of step(number)) {
        if (!(n in cs)) {
          cs[n] = 0;
          us.push(n);
        }
        cs[n] += count;
      }
    }

    xs = us.map((u) => ({ number: u, count: cs[u] }));
  }

  return xs.reduce((n, { count }) => n + count, 0);
}
