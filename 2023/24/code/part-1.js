export default (input) => {
  const lower = 200000000000000;
  const upper = 400000000000000;

  const parseVectorString = (s) => {
    const [x, y, z] = s.split(', ').map((s) => parseInt(s, 10));
    return { x, y, z };
  }

  const parseLine = (s) => {
    const [ps, vs] = s.split(' @ ');
    const p = parseVectorString(ps);
    const v = parseVectorString(vs);

    // x = px + t * vx
    // t = (x - px) / vx

    // y = py + t * vy
    // t = (y - py) / vy

    // (y - py) / vy = (x - px) / vx
    // y = py + (x - px) (vy / vx)

    // y = (vy / vx) x + py - (px * vy / vx)

    // y = a * x + b
    // a = (vy / vx)
    // b = py - (px * vy / vx) = py - a * px

    const a = (v.y / v.x);
    const b = p.y - a * p.x;
    const l = { a, b };

    // if (a * p.x + b !== p.y) {
    //   console.log(p, v, a, b)
    //   throw 'wa';
    // }

    return { p, v, l };
  };

  const parseInput = (s) => s.split('\n').map(parseLine);

  const getPairs = (xs) => {
    const ys = [];
    for (let i = 0, m = xs.length; i < m; i++) {
      for (let k = i + 1; k < m; k++) {
        ys.push([xs[i], xs[k]]);
      }
    }
    return ys;
  };

  const testPair = ([p, q]) => {
    // console.log('testing', p, q)

    // find x, y of intersection

    // a1 x + b1 = a2 x + b2
    // x = (b2 - b1) / (a1 - a2)

    if (p.l.a - q.l.a === 0) {
      // console.log('parallel');
      return false;
    }

    const x = (q.l.b - p.l.b) / (p.l.a - q.l.a);

    // console.log('x', x);

    if (!(x >= lower && x <= upper)) {
      // console.log('outside area for x');
      return false;
    }

    const y = p.l.a * x + p.l.b;

    // console.log('y', y);

    if (!(y >= lower && y <= upper)) {
      // console.log('outside area for y');
      return false;
    }

    // find t of intersection for each
    // t = (x - px) / vx

    if (p.v.x === 0) {
      // stone does not move in this direction - can still be valid if x is within area!
      // should probably check y instead; todo
    }

    const pt = (x - p.p.x) / p.v.x;

    // console.log('t left', pt);

    if (pt < 0) {
      // console.log('in the past for left');
      return false;
    }

    const qt = (x - q.p.x) / q.v.x;

    // console.log('t right', pt);

    if (qt < 0) {
      // console.log('in the past for right');
      return false;
    }

    // console.log('winner');
    return true;
  };

  const stones = parseInput(input);

  // console.log(stones);

  const pairs = getPairs(stones);

  let n = 0;

  for (const pair of pairs) {
    const b = testPair(pair);

    if (b) {
      n++;
    }
  }

  console.log(n);

  // 25433

  return n;
}
