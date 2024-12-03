module.exports = (input) => {
  const parseInput = (s) => s.split('\n').reduce(
    ([xs, ys], s) => {
      const [x, y] = s.split('   ');
      return [[...xs, x], [...ys, y]];
    },
    [[], []]
  );

  const [xs, ys] = parseInput(input);

  const count = (ys, x) => ys.map((y) => y === x).filter((b) => b).length;

  const ss = xs.map((x) => x * count(ys, x));

  const n = ss.reduce((n, s) => n + s, 0);

  return n;
}

// Running year 2024, day 1, part 2 with real input (size 13999)
// ---
// Elapsed: 43.084ms, result: 25358365
