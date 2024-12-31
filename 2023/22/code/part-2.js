export default (input) => {
  const direction = {
    x: 'x',
    y: 'y',
    z: 'z'
  };

  const parseCoordinate = (s) => {
    const [x, y, z] = s.split(',');
    return { x, y, z };
  };

  const parseBrickString = (s) => {
    const [left, right] = s.split('~').map(parseCoordinate);
    const { d, l } = Object.values(direction).map((d) => ({ d, l: Math.abs(left[d] - right[d]) })).reduce((a, b) => a.l > b.l ? a : b);

    const x = Math.min(left.x, right.x);
    const y = Math.min(left.y, right.y);
    const z = Math.min(left.z, right.z);

    return {
      left: {
        x,
        y,
        z
      },
      right: {
        x: d === direction.x ? x + l : x,
        y: d === direction.y ? y + l : y,
        z: d === direction.z ? z + l : z,
      }
    };
  };

  const parseInput = (input) => input.split('\n').map(parseBrickString);

  const intersect = ([lf, lt], [rf, rt]) => {
    const lo = Math.max(lf, rf);
    const hi = Math.min(lt, rt);
    return hi >= lo;
  };

  const areaIntersections = (b, bricks) => bricks.filter((a) => a !== b).filter((a) => intersect([a.left.x, a.right.x], [b.left.x, b.right.x])).filter((a) => intersect([a.left.y, a.right.y], [b.left.y, b.right.y]));

  const drop = (brick) => {
    let i;

    for (i = 0; i < brick.left.z; i++) {
      const ss = brick.xyi.filter((b) => intersect([b.left.z, b.right.z], [brick.left.z - i - 1, brick.right.z - i - 1]));
      if (ss.length > 0) {
        break;
      }
    }

    brick.left.z -= i;
    brick.right.z -= i;

    return i;
  };

  const step = (bricks) => {
    for (const brick of bricks) {
      const height = drop(brick);
      if (height > 0) {
        return height;
      }
    }
    return 0;
  };

  const settle = (bricks) => {
    while(step(bricks) !== 0) {
      ;
    }
  };

  const bricks = parseInput(input).sort((a, b) => a.left.z - b.left.z);

  for (const brick of bricks) {
    brick.xyi = areaIntersections(brick, bricks);
  }

  settle(bricks);

  for (const brick of bricks) {
    brick.supporting = brick.xyi.filter((b) => intersect([b.left.z - 1, b.right.z - 1], [brick.left.z, brick.right.z]));
    brick.supportedBy = brick.xyi.filter((b) => intersect([b.left.z + 1, b.right.z + 1], [brick.left.z, brick.right.z]));
  }

  const falling = (brick) => {
    const fs = [brick];

    while(true) {
      const cs = [];

      for (const f of fs) {
        for (const s of f.supporting) {
          if (!cs.includes(s) && !fs.includes(s)) {
            cs.push(s);
          }
        }
      }

      const ns = cs.filter((c) => c.left.z > 0 && c.supportedBy.filter((t) => !fs.includes(t)).length == 0);

      fs.push(...ns);

      if (ns.length === 0) {
        return fs.length - 1;
      }
    }
  }

  const n = bricks.map(falling).reduce((a, b) => a + b);

  console.log(n);

  // 96356

  return n;
}
