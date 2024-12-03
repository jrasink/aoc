export default (input) => {
  const parseLine = (s) => s.split('x').map((s) => parseInt(s, 10));

  const parseInput = (s) => s.split('\n').map(parseLine);

  const dss = parseInput(input);

  const length = ([l, w, h]) => {
    const [a, b] = [l, w, h].sort((a, b) => a - b);

    const sides = 2 * (a + b);
    const bow = l * w * h;

    const total = sides + bow;

    return total;
  };

  const ls = dss.map(length);

  const total = ls.reduce((a, b) => a + b, 0);

  return total;
}

// Running year 2015, day 2, part 2 with real input (size 8111)
// ---
// Elapsed: 3.321ms
// Result: 3783758
