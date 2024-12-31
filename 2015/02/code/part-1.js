export default (input) => {
  const parseLine = (s) => s.split('x').map((s) => parseInt(s, 10));

  const parseInput = (s) => s.split('\n').map(parseLine);

  const dss = parseInput(input);

  const area = ([l, w, h]) => {
    const sides = [l * w, w * h, h * l];
    const slack = Math.min(...sides);
    return slack + 2 * sides.reduce((a, b) => a + b, 0);
  };

  const as = dss.map(area);

  const total = as.reduce((a, b) => a + b, 0);

  return total;
}

