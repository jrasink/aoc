module.exports = (input) => {
  const parseInput = (s) => s.split('\n').reduce(
    ([xs, ys], s) => {
      const [x, y] = s.split('   ');
      return [[...xs, x], [...ys, y]];
    },
    [[], []]
  );

  const [xs, ys] = parseInput(input);

  const xs1 = xs.sort((a, b) => a - b);
  const ys1 = ys.sort((a, b) => a - b);

  const ps = [];

  while (xs1.length > 0) {
    const x = xs1.shift();
    const y = ys1.shift();
    ps.push([x, y].sort((a, b) => a - b));
  }

  const ds = ps.map(([x, y]) => y - x);
  const n = ds.reduce((n, d) => n + d, 0);

  return n;
}

// Running year 2024, day 1, part 1 with real input (size 13999)
// ---
// Elapsed: 7.817ms, result: 2580760
