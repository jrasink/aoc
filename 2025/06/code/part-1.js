export default (input) => {
  const sheet = input.split('\n').map((s) => s.split(' ').map((s) => s.trim()).filter((s) => s.length > 0));

  const sum = (a, b) => (a + b);
  const mul = (a, b) => (a * b);

  const transpose = (xss) => {
    if (!xss.length) {
      return [];
    }

    const yss = [...Array(xss[0].length)].map(() => []);

    for (let i = 0, m = xss.length; i < m; i++) {
      for (let k = 0, n = xss[i].length; k < n; k++) {
        yss[k][i] = xss[i][k];
      }
    }

    return yss;
  }

  const zs = transpose(sheet).map((ss) => {
    const sym = ss.pop();
    const xs = ss.map((s) => parseInt(s, 10));
    const op = sym === '+' ? sum : mul;
    return xs.reduce(op);
  });

  return zs.reduce(sum);
}
