export default (input) => {
  const is = input.match(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g);

  const [fs] = is.reduce(([fs, b], i) => {
    switch (i) {
      case 'do()':
        return [fs, true];
      case 'don\'t()':
        return [fs, false];
      default:
        return b ? [[...fs, i], b] : [fs, b];
    }
  }, [[], true]);

  const ms = fs.map((i) => i.match(/(\d+)/g).map((s) => parseInt(s, 10)));

  const rs = ms.map((xs) => xs.reduce((n, a) => n * a, 1));

  const result = rs.reduce((n, a) => n + a, 0);

  return result;
}
