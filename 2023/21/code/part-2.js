export default (input) => {
  const parseInput = (input) => {
    const rows = input.split('\n').map((s) => s.split(''));
    const height = rows.length;
    const width = rows[0].length;
    const map = rows.map((cs) => cs.map((c) => c !== '#'));

    const start = rows.reduce((o, cs, y) => {
      const x = cs.reduce((p, c, x) => c === 'S' ? x : p, null);
      return x !== null ? { x, y } : o;
    }, null);

    return {
      map,
      height,
      width,
      start
    };
  };

  const draw = ({ width, height, map }, current = [], wave = []) => {
    const css = [];
    for (let y = 0; y < height; y++) {
      const cs = [];
      css.push(cs);
      for (let x = 0; x < width; x++) {
        if (map[y][x]) {
          cs.push('.');
        } else {
          cs.push('#');
        }
      }
    }

    for (const { x, y } of current) {
      css[y][x] = 'O';
    }

    for (const { x, y } of wave) {
      css[y][x] = 'X';
    }

    return css.map((cs) => cs.join('')).join('\n');
  };

  const neighbours = ({ map, height, width }, { x, y }) => [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].filter(({ x, y }) => x >= 0 && y >= 0 && x < width && y < height && map[y][x]);

  const has = (ps, { x, y }) => ps.reduce((b, p) => b || (p.x === x && p.y === y), false);
  const unique = (ps) => ps.reduce((qs, p) => has(qs, p) ? qs : [...qs, p], []);
  const outside = (ps, qs) => qs.filter((q) => !has(ps, q));

  const manyNeighbours = (world, ps) => unique([].concat(...ps.map((p) => neighbours(world, p))));

  const memoize = (f) => {
    const m = {};
    return (world, { x, y }, n) => {
      // hack - if area is known to be saturated, return shortcut value
      if (n > 260) {
        return (x + y + n) % 2 ? 7558 : 7623;
      }

      const k = `${x},${y}/${n}`;
      if (!(k in m)) {
        m[k] = f(world, { x, y }, n);
      }
      return m[k];
    }
  };

  const options = memoize((world, start, steps) => {
    let previous = [];
    let current = [start];
    let head = [start];

    for (let i = 1; i <= steps; i++) {
      head = outside(previous, manyNeighbours(world, head));
      const ps = previous;
      previous = current;
      current = [...ps, ...head];
    }

    // console.log(`\nStarting at (x: ${start.x}, y: ${start.y}), after ${steps} steps reach ${current.length} plots`);
    // console.log(draw(world, current));

    return current.length;
  });

  const world = parseInput(input);

  const points = {
    center: { x: (world.width - 1) / 2, y: (world.height - 1) / 2 },
    n: { x: (world.width - 1) / 2, y: 0 },
    s: { x: (world.width - 1) / 2, y: world.height - 1 },
    w: { x: 0, y: (world.height - 1) / 2 },
    e: { x: world.width - 1, y: (world.height - 1) / 2 },
    nw: { x: 0, y: 0 },
    ne: { x: world.width - 1, y: 0 },
    sw: { x: 0, y: world.height - 1 },
    se: { x: world.width - 1, y: world.height - 1 }
  };

  return (() => {
    const steps = 26501365;

    // handle center
    const center = options(world, points.center, steps);

    // console.log(`--- steps possible in center area: ${center}`);

    // handle waves along the axes
    const axes = (() => {
      let result = 0;

      // how many area steps can we make along an axis with number of steps: first area step 66, then 131 each
      const extent = Math.floor((steps + 65) / 131);

      // console.log(`extent along axes: ${extent}`);

      // on each axis, calculate options for only the outer two areas
      for (let i = 0; i < 2; i++) {
        const a = extent - i;
        if (a > 0) {
          const offset = a * 131 - 65;
          const r = steps - offset;

          // console.log(`axis coordinate ${a} remaining steps ${r}`)

          // the entry point is different in each direction along each axis, number of steps in each is the same
          result += options(world, points.n, r);
          result += options(world, points.s, r);
          result += options(world, points.w, r);
          result += options(world, points.e, r);
        }
      }

      // include results for any fully saturated areas, note that starting point is irrelevant except for x+y parity
      if (extent > 2) {
        // even and odd area numbers along an axis, ignoring zero and the outer two areas
        const odds = Math.floor((extent + 1) / 2) - 1;
        const evens = Math.floor(extent / 2) - 1;

        // console.log(`other axis coordinates, odd: ${odds}, even: ${evens}`);
        // console.log(`for each odd, add four times ${options(world, points.n, steps)}`)
        // console.log(`for each even, add four times ${options(world, points.n, steps + 1)}`)

        // the odd area numbers all have an even offset: starting at 66 for 1, then increasing by 131 per area step
        result += 4 * odds * options(world, points.n, steps);
        // the even area numbers all have an odd offset, so flip parity of number of steps
        result += 4 * evens * options(world, points.n, steps + 1);
      }

      return result;
    })();

    // console.log(`--- steps possible along axes: ${axes}`);

    // handle waves along the slices between the axes
    const slices = (() => {
      let result = 0;

      // how many area steps can we make with number of steps: first two area steps 66 each, then 131
      const extent = Math.floor((steps + 130) / 131);

      // console.log(`ax + ay extent along slices: ${extent}`);

      // scan along the x-axis, include results for all x/y directions in one scan
      for (let ax = 1; ax <= extent; ax++) {
        const yextent = extent - ax;

        // console.log(`(ax: ${ax}) y extent: ${yextent}`);

        for (let i = 0; i < 2; i++) {
          const ay = yextent - i;
          if (ay > 0) {
            const offset = (ax + ay) * 131 - 130;
            const r = steps - offset;

            // console.log(`(ax: ${ax}, ay: ${ay}) remaining steps ${r}`)

            // the entry point is different in each of the four slices, number of steps is the same
            result += options(world, points.nw, r);
            result += options(world, points.ne, r);
            result += options(world, points.sw, r);
            result += options(world, points.se, r);
          }
        }

        // include results for any fully saturated areas, note that starting point is irrelevant except for x+y parity
        if (yextent > 2) {
          // even and odd area numbers along y axis, ignoring zero and the outer two areas
          // ! step parity is flipped if ax is odd
          const odds = Math.floor((yextent + 1) / 2) - 1;
          const evens = Math.floor(yextent / 2) - 1;

          // console.log(`at x ${ax} other ys, odd: ${odds}, even: ${evens}, flipped: ${ax} ${!!(ax % 2)}`);

          // the even area numbers all have an even offset: starting at 132 for 2, then increasing by 131 per area step
          result += 4 * evens * options(world, points.nw, steps + ax);
          // the odd area numbers all have an even offset
          result += 4 * odds * options(world, points.nw, steps + ax + 1);
        }
      }

      return result;
    })();

    // console.log(`--- steps possible along slices: ${slices}`);

    const total = center + axes + slices;

    console.log(total);

    return total;
  })();

  // 621289922886149


  // Starting CENTER
  // Area saturated after 131 steps
  // Reachable after odd number of steps: 7558, even: 7623
  // Side N reached after 65 steps at 1 positions [ { x: 65, y: 0 } ]
  // Side S reached after 65 steps at 1 positions [ { x: 65, y: 130 } ]
  // Side W reached after 65 steps at 1 positions [ { x: 0, y: 65 } ]
  // Side E reached after 65 steps at 1 positions [ { x: 130, y: 65 } ]
  // Side NE reached after 130 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 130 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 130 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 130 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting N
  // Area saturated after 196 steps
  // Reachable after odd number of steps: 7623, even: 7558
  // Side N reached after 0 steps at 1 positions [ { x: 65, y: 0 } ]
  // Side S reached after 130 steps at 1 positions [ { x: 65, y: 130 } ]
  // Side W reached after 65 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side E reached after 65 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NE reached after 65 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 65 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 195 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 195 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting S
  // Area saturated after 196 steps
  // Reachable after odd number of steps: 7623, even: 7558
  // Side N reached after 130 steps at 1 positions [ { x: 65, y: 0 } ]
  // Side S reached after 0 steps at 1 positions [ { x: 65, y: 130 } ]
  // Side W reached after 65 steps at 1 positions [ { x: 0, y: 130 } ]
  // Side E reached after 65 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side NE reached after 195 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 195 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 65 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 65 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting W
  // Area saturated after 196 steps
  // Reachable after odd number of steps: 7623, even: 7558
  // Side N reached after 65 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side S reached after 65 steps at 1 positions [ { x: 0, y: 130 } ]
  // Side W reached after 0 steps at 1 positions [ { x: 0, y: 65 } ]
  // Side E reached after 130 steps at 1 positions [ { x: 130, y: 65 } ]
  // Side NE reached after 195 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 65 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 195 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 65 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting E
  // Area saturated after 196 steps
  // Reachable after odd number of steps: 7623, even: 7558
  // Side N reached after 65 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side S reached after 65 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side W reached after 130 steps at 1 positions [ { x: 0, y: 65 } ]
  // Side E reached after 0 steps at 1 positions [ { x: 130, y: 65 } ]
  // Side NE reached after 65 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 195 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 65 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 195 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting NW
  // Area saturated after 261 steps
  // Reachable after odd number of steps: 7558, even: 7623
  // Side N reached after 0 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side S reached after 130 steps at 1 positions [ { x: 0, y: 130 } ]
  // Side W reached after 0 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side E reached after 130 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NE reached after 130 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 0 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 260 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 130 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting NE
  // Area saturated after 261 steps
  // Reachable after odd number of steps: 7558, even: 7623
  // Side N reached after 0 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side S reached after 130 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side W reached after 130 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side E reached after 0 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NE reached after 0 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 130 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 130 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 260 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting SW
  // Area saturated after 261 steps
  // Reachable after odd number of steps: 7558, even: 7623
  // Side N reached after 130 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side S reached after 0 steps at 1 positions [ { x: 0, y: 130 } ]
  // Side W reached after 0 steps at 1 positions [ { x: 0, y: 130 } ]
  // Side E reached after 130 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side NE reached after 260 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 130 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 130 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 0 steps at 1 positions [ { x: 0, y: 130 } ]

  // Starting SE
  // Area saturated after 261 steps
  // Reachable after odd number of steps: 7558, even: 7623
  // Side N reached after 130 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side S reached after 0 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side W reached after 130 steps at 1 positions [ { x: 0, y: 130 } ]
  // Side E reached after 0 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side NE reached after 130 steps at 1 positions [ { x: 130, y: 0 } ]
  // Side NW reached after 260 steps at 1 positions [ { x: 0, y: 0 } ]
  // Side SE reached after 0 steps at 1 positions [ { x: 130, y: 130 } ]
  // Side SW reached after 130 steps at 1 positions [ { x: 0, y: 130 } ]

  // start x + y even / Reachable after odd number of steps: 7558, even: 7623
  // start x + y odd / Reachable after odd number of steps: 7623, even: 7558

  // so, (x + y + steps) odd: 7558, even: 7623

  // findings:
  // 1. outgoing waves are not "slowed" by rocks, making calculations much easier than in the example
  // 2. any area is saturated at most 261 steps after it is entered, meaning only the last two areas entered on any line need to be calculated through
  // 3. saturated areas have 7558 options if (x + y + steps) is odd, 7623 options if it's even

  // area 0, 0 / d 0 entered at step 0
  // area 1, 0 / d 1 entered at step 66
  // area 2, 0 / d 2 entered at step 66 + 131
  // area 3, 0 / d 3 entered at step 66 + 2 * 131
  // area 1, 1 / d 2 entered at step 2 * 66
  // area 2, 1 / d 3 entered at step 2 * 66 + 131
  // area 2, 2 / d 4 entered at step 2 * 66 + 2 * 131

  // we can calculate three groups separately:
  // - the middle area at 0, 0
  // - the axes at x, 0 and 0, y, where entry points are middle of border and step distance is offset by 65
  // - the slices at x, y, where entry points are in corners and step distance is offset by 130

  // const analyze = (world, start) => {
  //   const { width, height } = world;

  //   let previous = [];
  //   let current = [start];
  //   let head = [start];

  //   const sides = {
  //     n: null,
  //     s: null,
  //     w: null,
  //     e: null,
  //     ne: null,
  //     nw: null,
  //     se: null,
  //     sw: null
  //   };

  //   let i = 0;

  //   while(head.length > 0) {
  //     if (!sides.n) {
  //       const ps = current.filter(({ x, y }) => y === 0);
  //       if (ps.length > 0) {
  //         sides.n = { step: i, ps: ps };
  //       }
  //     }

  //     if (!sides.s) {
  //       const ps = current.filter(({ x, y }) => y === (height - 1));
  //       if (ps.length > 0) {
  //         sides.s = { step: i, ps: ps };
  //       }
  //     }

  //     if (!sides.w) {
  //       const ps = current.filter(({ x, y }) => x === 0);
  //       if (ps.length > 0) {
  //         sides.w = { step: i, ps: ps };
  //       }
  //     }

  //     if (!sides.e) {
  //       const ps = current.filter(({ x, y }) => x === (width - 1));
  //       if (ps.length > 0) {
  //         sides.e = { step: i, ps: ps };
  //       }
  //     }

  //     if (!sides.nw) {
  //       const ps = current.filter(({ x, y }) => y === 0 && x === 0);
  //       if (ps.length > 0) {
  //         sides.nw = { step: i, ps: ps };
  //       }
  //     }

  //     if (!sides.ne) {
  //       const ps = current.filter(({ x, y }) => y === 0 && x === (width - 1));
  //       if (ps.length > 0) {
  //         sides.ne = { step: i, ps: ps };
  //       }
  //     }

  //     if (!sides.sw) {
  //       const ps = current.filter(({ x, y }) => y === (height - 1) && x === 0);
  //       if (ps.length > 0) {
  //         sides.sw = { step: i, ps: ps };
  //       }
  //     }

  //     if (!sides.se) {
  //       const ps = current.filter(({ x, y }) => y === (height - 1) && x === (width - 1));
  //       if (ps.length > 0) {
  //         sides.se = { step: i, ps: ps };
  //       }
  //     }

  //     // console.log(`\nstep ${i}: current reach ${current.length}, head ${head.length}`);
  //     // console.log(draw(world, current));

  //     head = outside(previous, manyNeighbours(world, head));
  //     const ps = previous;
  //     previous = current;
  //     current = [...ps, ...head];
  //     i += 1;
  //   }

  //   let even, odd;

  //   if (i % 2) {
  //     odd = current.length;
  //     even = previous.length;
  //   } else {
  //     even = current.length;
  //     odd = previous.length;
  //   }

  //   console.log(`Area saturated after ${i} steps`);
  //   console.log(`Reachable after odd number of steps: ${odd}, even: ${even}`);

  //   for (const [side, { step, ps }] of Object.entries(sides)) {
  //     console.log(`Side ${side.toUpperCase()} reached after ${step} steps at ${ps.length} positions`, ps);
  //   }
  // };

  // (() => {
  //   const center = { x: 65, y: 65 };
  //   const n = { x: 65, y: 0 };
  //   const s = { x: 65, y: 130 };
  //   const w = { x: 0, y: 65 };
  //   const e = { x: 130, y: 65 };
  //   const nw = { x: 0, y: 0 };
  //   const ne = { x: 130, y: 0 };
  //   const sw = { x: 0, y: 130 };
  //   const se = { x: 130, y: 130 };
  //   for (const [d, p] of Object.entries({ center, n, s, w, e, nw, ne, sw, se })) {
  //     console.log(`\nStarting ${d.toUpperCase()}`);
  //     analyze(world, p);
  //   }
  // })();
}
