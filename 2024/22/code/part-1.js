export default (input) => {
  const seeds = input.split('\n').map((s) => parseInt(s, 10));

  const next = (n) => {
    n = (n ^ (n << 6)) & 16777215;
    n = (n ^ (n >> 5)) & 16777215;
    n = (n ^ (n << 11)) & 16777215;
    return n;
  }

  const find = (n, m) => {
    for (let i = 0; i < m; i++) {
      n = next(n);
    }
    return n;
  }

  let t = 0;

  for (const n of seeds) {
    t += find(n, 2000);
  }

  return t;
}
