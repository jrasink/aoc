export default (input) => {
  const sig = (a) => a < 0 ? -1 : (a > 0 ? 1 : 0);
  const abs = (a) => a * sig(a);
  const gcd = (a, b) => b ? gcd(b, a % b) : abs(a);

  const fraction = (n, d = 1) => {
    const g = gcd(n, d) * sig(d);
    return { n: n / g, d: d / g };
  };

  const unfraction = (f) => f.n / f.d;

  const neg = (a) => fraction(-a.n, a.d);
  const inv = (a) => fraction(a.d, a.n);

  const mul = (a, b) => fraction(a.n * b.n, a.d * b.d);
  const div = (a, b) => mul(a, inv(b));

  const add = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => add(a, neg(b));

  const fractionToString = ({ n, d }) => d === 1 ? `${n}`: `${n}/${d}`;
  const fractionsToString = (fs) => fs.map(fractionToString).join(', ');
  const equationToString = (eq) => `${fractionsToString(eq.slice(0, -1))} => ${fractionToString(eq.slice(-1).shift())}`;
  const equationsToString = (eqs) => eqs.map(equationToString).join('\n');

  const dump = (eqs) => console.log(equationsToString(eqs));

  const analyze = (buttons, target) => target.map((n, i) => buttons.map((bs) => {
    for (const b of bs) {
      if (b.n === i && b.d === 1) {
        return fraction(1);
      }
    }
    return fraction(0);
  }).concat([n]));

  const swapy = (xss, f, t) => {
    const m = xss[t];
    xss[t] = xss[f];
    xss[f] = m;
  }

  const swapx = (xss, f, t) => {
    for (let y = 0; y < xss.length; y++) {
      const m = xss[y][t];
      xss[y][t] = xss[y][f];
      xss[y][f] = m;
    }
  }

  const transpose = (xss) => xss.length ? xss[0].map((_, i) => xss.map((xs) => xs[i])) : [];

  const contract = (xss) => {
    const yss = xss.filter((es) => !es.reduce((b, { n }) => b && (n === 0), true));
    const tss = transpose(yss);
    const zss = tss.filter((es) => !es.reduce((b, { n }) => b && (n === 0), true));
    return transpose(zss);
  }

  const reduce = (eqs) => {
    for (let step = 0; step < eqs.length; step++) {
      let y = null;

      // find equation with significant value at step
      for (let x = step; y === null && x < (eqs[0].length - 1); x++) {
        if (x > step) {
          swapx(eqs, x, step);
        }

        for (let i = step; i < eqs.length; i++) {
          if (eqs[i][step].n !== 0) {
            y = i;
          }
        }
      }

      if (y === null) {
        continue;
      }

      // move equation to top of step
      swapy(eqs, y, step);

      // normalize equation
      const f = eqs[step][step];
      for (let x = 0, l = eqs[0].length; x < l; x++) {
        eqs[step][x] = div(eqs[step][x], f);
      }

      // clean significant value at step from all other equations
      for (let i = 0; i < eqs.length; i++) {
        if (i !== step) {
          const k = div(eqs[i][step], eqs[step][step]);
          for (let x = step, l = eqs[0].length; x < l; x++) {
            eqs[i][x] = sub(eqs[i][x], mul(eqs[step][x], k));
          }
        }
      }
    }

    // remove rows and columns with only zeroes
    return contract(eqs);
  }

  const solve = (buttons, target) => {
    if (!buttons.length) {
      // for the result to be valid, each target value must be integer and non negative
      if (target.reduce((valid, f) => valid && (f.n >= 0) && (f.d === 1), true)) {
        return unfraction(target.reduce(add));
      }
      return null;
    }

    const [ns, ...rest] = buttons;

    let min = 0;
    let max = 250;

    for (let i = 0, l = target.length; i < l; i++) {
      if (rest.reduce((b, ms) => b && (ms[i].n >= 0), true)) {
        if (target[i].n < 0) {
          if (ns[i].n >= 0) {
            max = -1;
          } else {
            min = Math.ceil(unfraction(div(target[i], ns[i])));
          }
        } else if (ns[i].n > 0) {
          max = Math.floor(unfraction(div(target[i], ns[i])));
        }
      }
    }

    let r = null;

    for (let i = min; i <= max; i++) {
      const t = [...target];

      for (let k = 0; k < ns.length; k++) {
        const effect = mul(ns[k], fraction(i));
        t[k] = sub(t[k], effect);
      }

      const n = solve(rest, t);

      if (n !== null) {
        const m = n + i;
        if (r === null || r > m) {
          r = m;
        }
      }
    }

    return r;
  }

  const squash = (eqs) => {
    const squashed = eqs.map((eq) => eq.slice(eqs.length));
    const buttons = transpose(squashed.map((es) => es.slice(0, -1)));
    const target = squashed.map((es) => es.slice(-1).shift());
    return { target, buttons };
  }

  let z = 0;

  const lines = input.split('\n');

  for (let i = 0; i < lines.length; i++) {
    console.log('analyzing machine', i)
    console.log(lines[i]);

    const sections = lines[i].split(' ').map((s) => s.slice(1, -1)).slice(1);
    const buttons = sections.map((s) => s.split(',').map((s) => parseInt(s, 10)).map((n) => fraction(n)));
    const target = buttons.pop();

    const equations = analyze(buttons, target);
    console.log('\nequations:')
    dump(equations);

    const reduced = reduce(equations);
    console.log('\nreduced:')
    dump(reduced);

    const squashed = squash(reduced);
    if (squashed.buttons.length) {
      console.log('\nto solve:');
      dump(squashed.target.map((t, i) => [...squashed.buttons.map((ns) => ns[i]), t]));
    }

    const r = solve(squashed.buttons, squashed.target);
    console.log('\nsolution:');
    console.log(r);

    z += r;

    console.log('\n')
  }

  return z;
}
