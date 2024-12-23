export default (input) => {
  const kPad = (() => {
    const symbols = {
      empty: 0,
      activate: 1,
      zero: 2,
      one: 3,
      two: 4,
      three: 5,
      four: 6,
      five: 7,
      six: 8,
      seven: 9,
      eight: 10,
      nine: 11,
    };

    const width = 3;
    const height = 4;

    const map = [
      symbols.seven, symbols.eight, symbols.nine,
      symbols.four, symbols.five, symbols.six,
      symbols.one, symbols.two, symbols.three,
      symbols.empty, symbols.zero, symbols.activate
    ];

    const lookup = Array(map.length);

    for (let i = 0; i < map.length; i++) {
      lookup[map[i]] = i;
    }

    const keys = Object.entries(symbols).reduce((keys, [key, value]) => ({ ...keys, [value]: key }), {});

    return {
      symbols,
      width,
      height,
      map,
      lookup,
      keys
    }
  })();

  const dPad = (() => {
    const symbols = {
      empty: 0,
      activate: 1,
      up: 2,
      down: 3,
      left: 4,
      right: 5
    };

    const width = 3;
    const height = 2;

    const map = [
      symbols.empty, symbols.up, symbols.activate,
      symbols.left, symbols.down, symbols.right
    ];

    const lookup = Array(map.length);

    for (let i = 0; i < map.length; i++) {
      lookup[map[i]] = i;
    }

    const keys = Object.entries(symbols).reduce((keys, [key, value]) => ({ ...keys, [value]: key }), {});

    return {
      symbols,
      width,
      height,
      map,
      lookup,
      keys
    }
  })();

  const sig = (a) => a < 0 ? -1 : (a > 0 ? 1 : 0);
  const abs = (a) => a * sig(a);

  const combinations = (nx, xSym, ny, ySym) => {
    if (nx === 0) {
      return [[...Array(ny)].map(() => ySym)];
    }

    if (ny === 0) {
      return [[...Array(nx)].map(() => xSym)];
    }

    const cs = [];

    for (const ds of combinations(nx - 1, xSym, ny, ySym)) {
      cs.push([xSym, ...ds]);
    }

    for (const ds of combinations(nx, xSym, ny - 1, ySym)) {
      cs.push([ySym, ...ds]);
    }

    return cs;
  }

  const findPaths = (pad, startSymbol, endSymbol) => {
    const start = pad.lookup[startSymbol];
    const end = pad.lookup[endSymbol];

    const dy = Math.floor(end / pad.width) - Math.floor(start / pad.width);
    const dx = (end % pad.width) - (start % pad.width);

    const ySym = sig(dy) === -1 ? dPad.symbols.up : dPad.symbols.down;
    const xSym = sig(dx) === -1 ? dPad.symbols.left : dPad.symbols.right;

    const cs = combinations(abs(dx), xSym, abs(dy), ySym);

    const fs = cs.filter((ds) => {
      let i = start;

      for (const d of ds) {
        switch (d) {
          case dPad.symbols.up:
            i -= pad.width;
            break;
          case dPad.symbols.down:
            i += pad.width;
            break;
          case dPad.symbols.left:
            i -= 1;
            break;
          case dPad.symbols.right:
            i += 1;
            break;
        }

        if (pad.map[i] === pad.symbols.empty) {
          return false;
        }
      }

      return true;
    });

    return fs.map((ps) => [...ps, dPad.symbols.activate]);
  }

  const dscore = (seq, depth) => {
    if (depth === 0) {
      return seq.length;
    }

    let s = 0;

    let current = dPad.symbols.activate;

    for (const next of seq) {
      const pss = findPaths(dPad, current, next);

      s += pss.reduce((min, ps) => min === null ? dscore(ps, depth - 1) : Math.min(min, dscore(ps, depth - 1)), null);

      current = next;
    }

    return s;
  }

  const kscore = (seq) => {
    let s = 0;

    let current = kPad.symbols.activate;

    for (const next of seq) {
      const pss = findPaths(kPad, current, next);
      s += pss.reduce((min, ps) => min === null ? dscore(ps, 2) : Math.min(min, dscore(ps, 2)), null);
      current = next;
    }

    return s;
  }

  const value = (seq) => seq.slice(0, 3).reduce((v, n) => 10 * v + (n - 2), 0);

  const complexity = (seq) => kscore(seq) * value(seq)

  const sequences = input.split('\n').map((s) => s.split('').map((c) => c === 'A' ? kPad.symbols.activate : parseInt(c, 10) + 2));

  let t = 0;

  for (const seq of sequences) {
    t += complexity(seq);
  }

  return t;
}
