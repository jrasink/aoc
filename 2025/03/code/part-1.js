export default (input) => {
  const bs = input.split('\n').map((s) => s.split('').map((s) => parseInt(s, 10)));

  const jolt = (ns) => {
    const t = Math.max(...ns.slice(0, -1));
    const i = ns.indexOf(t);
    const d = Math.max(...ns.slice(i + 1));
    return 10 * t + d;
  }

  return bs.map(jolt).reduce((n, m) => n + m, 0);
}
