export default (input) => {
  const sig = (a) => a < 0 ? -1 : (a > 0 ? 1 : 0);
  const abs = (a) => a * sig(a);
  const gcd = (a, b) => b ? gcd(b, a % b) : abs(a);

  class Fractional {
    constructor (n, d) {
      const g = gcd(n, d);
      const s = sig(d);
      this.numerator = s * n / g;
      this.denominator = s * d / g;
    }

    get n () {
      return this.numerator;
    }

    get d () {
      return this.denominator;
    }

    toString () {
      return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`;
    }
  };

  const fractional = (n, d) => new Fractional(n, d);

  const neg = (a) => fractional(-a.n, a.d);
  const inv = (a) => fractional(a.d, a.n);

  const mul = (a, b) => fractional(a.n * b.n, a.d * b.d);
  const div = (a, b) => mul(a, inv(b));

  const add = (a, b) => fractional(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => add(a, neg(b));

  const claws = input.split('\n\n').map((s) => {
    const [a, b, p] = s.split('\n').map((s) => {
      const [coordinateString] = s.split(': ').slice(1);
      const [x, y] = coordinateString.split(', ').map(s => parseInt(s.slice(2), 10)).map((n) => fractional(n, 1));
      return { x, y };
    });
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

    if (na.d !== 1 || nb.d !== 1) {
      return 0;
    }

    return 3 * na.n + nb.n;
  }

  return claws.map(solve).reduce((t, n) => t + n, 0);
}
