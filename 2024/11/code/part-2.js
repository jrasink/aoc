export default (input) => {
  const step = (n) => {
    if (n === 0) {
      return [1];
    }

    const d = Math.floor(Math.log10(n)) + 1;

    if (d % 2) {
      return [2024 * n];
    }

    const h = 10 ** (d / 2);

    return [Math.floor(n / h), n % h];
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
