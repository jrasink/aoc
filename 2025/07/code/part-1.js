export default (input) => {
  const rows = input.split('\n').map((s) => s.split(''));

  const first = rows.shift();
  let beams = [first.indexOf('S')];

  const splitters = rows.map((ss) => ss.reduce((splitters, s, i) => (s === '^') ? [...splitters, i] : [...splitters], []));

  let z = 0;

  for (let i = 0, m = splitters.length; i < m; i++) {
    const row = splitters[i];

    let next = [];

    for (const beam of beams) {
      if (row.indexOf(beam) !== -1) {
        z += 1;
        for (const k of [beam - 1, beam + 1]) {
          if (!(next.includes(k))) {
            next.push(k);
          }
        }
      } else {
        if (!(next.includes(beam))) {
          next.push(beam);
        }
      }
    }

    beams = next;
  }

  return z;
}
