export default (input) => {
  const digits = (n) => `${n}`.split('').map((s) => parseInt(s, 10));
  const number = (ds) => ds.reduce((n, d) => 10 * n + d, 0);

  const step = (n) => {
    if (n === 0) {
      return [[1]];
    }

    const ds = digits(n);

    if ((ds.length % 2) === 0) {
      const l = ds.length / 2;
      const ls = ds.slice(0, l);
      const rs = ds.slice(l);
      return [number(ls), number(rs)];
    }

    return [2024 * n];
  }

  const wrap = (xs) => {
    const cs = Array();
    const us = [];
    for (const { number, count } of xs) {
      if (!(number in cs)) {
        cs[number] = 0;
        us.push(number);
      }
      cs[number] += count;
    }
    return us.map((u) => ({ number: u, count: cs[u] }));
  };

  let xs = wrap(input.split(' ').map((s) => parseInt(s, 10)).map((n) => ({ number: n, count: 1 })));

  for (let i = 0; i < 75; i++) {
    const ys = [];

    for (const { number, count } of xs) {
      for (const n of step(number)) {
        ys.push({ number: n, count });
      }
    }

    xs = wrap(ys);
  }

  return xs.reduce((n, { count }) => n + count, 0);
}
