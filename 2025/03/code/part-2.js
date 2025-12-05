export default (input) => {
  const bs = input.split('\n').map((s) => s.split('').map((s) => parseInt(s, 10)));

  const jolt = (ns) => {
    let ms = [...ns];
    const js = [];

    for (let i = 11; i >= 0; i--) {
      const cs = ms.slice(0, ms.length - i);
      const j = Math.max(...cs);
      js.push(j);
      ms = ms.slice(ms.indexOf(j) + 1);
    }

    return js.reduce((n, j) => 10 * n + j, 0);
  }

  return bs.map(jolt).reduce((n, m) => n + m, 0);
}
