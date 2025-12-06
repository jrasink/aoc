export default (input) => {
  const rows = input.split('\n');

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

  const ops = rows.pop().match(/[+*]\s+/gi).map((s) => ({ op: s.trim(), len: s.length }));
  const sheet = transpose(rows.map((s) => s.split('')));

  let pos = 0;
  let z = 0;

  for (const { op, len } of ops) {
    const section = sheet.slice(pos, pos + len);
    const numbers = section.map((ss) => ss.join('').trim()).filter((s) => s.length > 0).map((s) => parseInt(s, 10));
    z += numbers.reduce(op === '+' ? sum : mul);
    pos += len;
  }

  return z;
}
