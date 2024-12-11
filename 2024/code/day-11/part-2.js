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
      while (rs[0] === 0 && rs.length > 1) {
        rs.shift();
      }
      return [number(ls), number(rs)];
    }

    return [2024 * n];
  }

  const group = (ns) => {
    const cs = Array(Math.max(...ns) + 1);
    const us = [];
    for (const n of ns) {
      if (!(n in cs)) {
        cs[n] = 0;
        us.push(n);
      }
      cs[n] += 1;
    }
    return us.map((u) => ({ number: u, count: cs[u] }));
  };

  const ns = input.split(' ').map((s) => parseInt(s, 10));

  let gs = group(ns);

  for (let i = 0; i < 75; i++) {
    const cs = Array();
    const us = [];
    for (const { count, number } of gs) {
      for (const n of step(number)) {
        if (!(n in cs)) {
          cs[n] = 0;
          us.push(n);
        }
        cs[n] += count;
      }
    }
    gs = us.map((u) => ({ number: u, count: cs[u] }));
  }

  return gs.reduce((n, { count }) => n + count, 0);
}
