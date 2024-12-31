export default (input) => {
  const unfoldTimes = 5;

  const parseRow = (s) => {
    const [row, profileString] = s.split(' ');
    const profile = profileString.split(',').map((s) => parseInt(s, 10));
    return { row, profile };
  }

  const unfold = ({ row, profile }) => {
    let rs = [];
    let ps = [];
    for (let i = 0; i < unfoldTimes; i++) {
      rs.push(row);
      ps.push(...profile);
    }
    return { row: rs.join('?'), profile: ps };
  }

  const segment = ({ row, profile }) => ({ row, segments: row.split('.').filter((s) => s.length > 0), profile });

  const parseInput = (s) => s.split('\n').map(parseRow).map(unfold).map(segment);

  const take = ([s, ...ss], n) => {
    if (n >= s.length) {
      return ss;
    }

    return [s.slice(n), ...ss];
  }

  const memoize = (f) => {
    const m = {};
    return ({ segments, profile }) => {
      const k = `${segments.join(',')}-${profile.join(',')}`;
      if (!(k in m)) {
        m[k] = f({ segments, profile });
      }
      return m[k];
    }
  };

  const count = memoize(({ segments, profile }) => {
    if (segments.reduce((n, a) => n + a.length, 0) < profile.reduce((a, b) => a + b, 0)) {
      // insufficient positions remain in segments, terminate
      return 0;
    }

    if (segments.length === 0 && profile.length === 0) {
      // segments and profile are both empty, complete
      return 1;
    }

    if (segments.length === 0) {
      // segments is empty but profile remains, terminate
      return 0;
    }

    if (profile.length === 0) {
      if (segments.reduce((s, a) => `${s}${a}`).split('').reduce((b, c) => b && c === '?', true)) {
        // remaining segments can and must be skipped, complete
        return 1;
      }
      // profile is empty but segments remain that cannot be skipped, terminate
      return 0;
    }

    const [p, ...ps] = profile;
    const [s, ...ss] = segments;

    if (s.length < p) {
      // segment is not sufficiently long to satisfy profile
      if (s.split('').reduce((b, c) => b && c === '?', true)) {
        // no # present in segment, so we may skip it
        return count({ segments: ss, profile });
      }
      // cannot skip segment, must terminate
      return 0;
    }

    if (s[0] == '#') {
      // must take length p
      if (s.length === p || s[p] == '?') {
        return count({ segments: take(segments, p + 1), profile: ps });
      }
      // next take is longer than p, must terminate
      return 0;
    }

    let res = 0;

    if (s.length === p || s[p] == '?') {
      // we may take p from segment; explore option and add results
      res += count({ segments: take(segments, p + 1), profile: ps });
    }

    // we may skip one position; explore option and add results
    res += count({ segments: take(segments, 1), profile });

    return res;
  });

  const data = parseInput(input);

  // console.log(data);

  const ns = data.map(({ segments, profile }, i) => {
    const n = count({ segments, profile });
    // console.log(`line ${i}: [${segments.join(', ')}] [${profile.join(', ')}]: count ${n}`);
    return n;
  });

  // console.log(ns);

  const n = ns.reduce((a, b) => a + b);

  console.log(n);

  // 83317216247365

  return n;
}
