export default (input) => {
  const sig = (a) => a < 0n ? -1n : (a > 0n ? 1n : 0n);
  const abs = (a) => a * sig(a);
  const gcd = (a, b) => b ? gcd(b, a % b) : abs(a);

  const fractional = (n, d) => {
    const g = gcd(n, d) * sig(d);
    return { n: n / g, d: d / g }
  };

  const neg = (a) => fractional(-a.n, a.d);
  const inv = (a) => fractional(a.d, a.n);

  const mul = (a, b) => fractional(a.n * b.n, a.d * b.d);
  const div = (a, b) => mul(a, inv(b));

  const add = (a, b) => fractional(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => add(a, neg(b));

  const claws = input.split('\n\n').map((s) => {
    const [a, b, q] = s.split('\n').map((s) => {
      const [coordinateString] = s.split(': ').slice(1);
      const [x, y] = coordinateString.split(', ').map(s => parseInt(s.slice(2), 10)).map((n) => fractional(BigInt(n), 1n));
      return { x, y };
    });

    const f = fractional(10000000000000n, 1n);
    const p = { x: add(q.x, f), y: add(q.y, f) };

    return { a, b, p };
  });

  const solve = ({ a, b, p }) => {
    // a xa + b xb = xp
    // a = (xp - b xb) / xa
    // a = (xp / xa) - b (xb / xa); | must be integer

    // a ya + b yb = yp
    // a = (yp / ya) - b (yb / ya); | must be integer

    // (yp / ya) - b (yb / ya) = (xp / xa) - b (xb / xa)

    // b = ((xp / xa) - (yp / ya)) / ((xb / xa) - (yb / ya)) | must be integer

    const nb = div(sub(div(p.x, a.x), div(p.y, a.y)), sub(div(b.x, a.x), div(b.y, a.y)));
    const na = sub(div(p.x, a.x), mul(nb, div(b.x, a.x)));

    if (na.d !== 1n || nb.d !== 1n) {
      return 0n;
    }

    return 3n * na.n + nb.n;
  }

  return Number(claws.map(solve).reduce((t, n) => t + n, 0n));
}
