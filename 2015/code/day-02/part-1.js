module.exports = (input) => {
  const parseLine = (s) => s.split('x').map((s) => parseInt(s, 10));

  const parseInput = (s) => s.split('\n').map(parseLine);

  const dss = parseInput(input);

  // console.log(dss)

  const area = ([l, w, h]) => {
    const sides = [l * w, w * h, h * l];
    const slack = Math.min(...sides);
    return slack + 2 * sides.reduce((a, b) => a + b, 0);
  };

  const as = dss.map(area);

  // console.log(as);

  const total = as.reduce((a, b) => a + b, 0);

  return total;
}

// Running year 2015, day 2, part 1 with real input (size 8111)
// ---
// Elapsed: 1.672ms
// Result: 1588178
