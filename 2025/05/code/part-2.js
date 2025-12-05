export default (input) => {
  const [rangeInput] = input.split('\n\n');

  const ranges = rangeInput.split('\n').map((s) => s.split('-').map((s) => parseInt(s, 10)));

  const filter = (xs, i) => [...xs.slice(0, i), ...xs.slice(i + 1)];

  const overlaps = ([amin], [bmin, bmax]) => amin >= bmin && amin <= bmax;

  const merge = ([amin, amax], [bmin, bmax]) => [Math.min(amin, bmin), Math.max(amax, bmax)];

  const step = (ranges) => {
    for (let i = 0; i < ranges.length; i++) {
      const others = filter(ranges, i);
      for (let j = 0; j < others.length; j++) {
        if (overlaps(ranges[i], others[j])) {
          return [...filter(others, j), merge(ranges[i], others[j])];
        }
      }
    }
    return ranges;
  }

  const fold = (ranges) => {
    let rs = ranges;
    while (true) {
      const ns = step(rs);
      if (ns.length === rs.length) {
        return ns;
      }
      rs = ns;
    };
  }

  return fold(ranges).reduce((z, [min, max]) => z + max - min + 1, 0);
}
