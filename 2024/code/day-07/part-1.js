export default (input) => {
  const parseLine = (s) => {
    const [resultString, paramsString] = s.split(': ');
    const result = parseInt(resultString, 10);
    const params = paramsString.split(' ').map((s) => parseInt(s, 10));
    return [result, params];
  }

  const calcs = input.split('\n').map(parseLine);

  const test = ([r, ps]) => {
    const xs = [...ps];
    const p = xs.pop();

    if (xs.length === 0) {
      return p === r;
    }

    if (((r % p) === 0) && test([r / p, xs])) {
      return true;
    }

    if (((r - p) > 0) && test([r - p, xs])) {
      return true;
    }

    return false;
  }

  const valid = calcs.filter(test);

  return valid.reduce((n, [r]) => n + r, 0);
};
