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

  let ns = input.split(' ').map((s) => parseInt(s, 10));

  for (let i = 0; i < 25; i++) {
    const rs = [];
    for (const n of ns) {
      rs.push(...step(n));
    }
    ns = rs;
  }

  return ns.length;
}
