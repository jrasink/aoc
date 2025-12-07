export default (input) => {
  const rows = input.split('\n').map((s) => s.split(''));

  const first = rows.shift();
  let beams = [{ pos: first.indexOf('S'), count: 1 }];

  const splitters = rows.map((ss) => ss.reduce((splitters, s, i) => (s === '^') ? [...splitters, i] : [...splitters], []));

  const split = (pos, row) => (row.indexOf(pos) !== -1) ? [pos - 1, pos + 1] : [pos];

  for (let i = 0, m = splitters.length; i < m; i++) {
    const row = splitters[i];

    let next = {};

    for (const { pos, count } of beams) {
      for (const k of split(pos, row)) {
        if (!(next[k])) {
          next[k] = { pos: k, count: 0 }
        }
        next[k].count += count;
      }
    }
    beams = Object.values(next);
  }

  return beams.reduce((z, { count }) => z + count, 0);
}
