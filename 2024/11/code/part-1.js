export default (input) => {
  const step = (n) => {
    if (n === 0) {
      return [1];
    }

    const d = Math.floor(Math.log10(n)) + 1;

    if (d % 2) {
      return [2024 * n];
    }

    const h = 10 ** (d / 2);

    return [Math.floor(n / h), n % h];
  }

  let ns = input.split(' ').map((s) => parseInt(s, 10));

  for (let i = 0; i < 25; i++) {
    const rs = [];
    for (const n of ns) {
      rs.push(...step(n));
    }
    ns = rs;
  }

  return ns.length;
}
