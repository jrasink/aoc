export default (input) => {
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
