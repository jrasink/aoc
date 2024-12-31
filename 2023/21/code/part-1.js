export default (input) => {
  const parseCell = (s) => ({
    // isStartingPosition: ['S'].includes(s),
    isRock: ['#'].includes(s),
    reach: ['S'].includes(s) ? true : false
  });

  const parseInput = (input) => {
    const map = input.split('\n').map((s) => s.split('').map(parseCell));
    const height = map.length;
    const width = map[0].length;
    // const start = map.reduce((o, xs, y) => {
    //   const x = xs.reduce((p, { isStartingPosition }, x) => isStartingPosition ? x : p, null);
    //   return x !== null ? { x, y } : null;
    // }, null);

    return { map, height, width };
  };

  const drawCell = ({
    isRock,
    reach
  }) => {
    if (isRock) {
      return '#';
    }

    if (reach) {
      return 'O';
    }

    return `.`;
  };

  const drawMap = (map) => map.map((s) => s.map(drawCell).join('')).join('\n');

  // const neighbours = ({ x, y }, { height, width }) => {
  //   const ps = [];

  //   for (let i = -1; i < 2; i++) {
  //     const x1 = x + i;

  //     if (x1 < 0 || x1 >= width) {
  //       continue;
  //     }

  //     for (let k = -1; k < 2; k++) {
  //       const y1 = y + k;

  //       if (y1 < 0 || y1 >= height) {
  //         continue;
  //       }

  //       if (x1 === x && y1 === y) {
  //         continue;
  //       }

  //       ps.push({ x: x1, y: y1 });
  //     }
  //   }

  //   return ps;
  // };

  const neighbours = ({ x, y }, { height, width }) => {
    const ps = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 }
    ];

    return ps.filter(({ x, y }) => x >= 0 && y >= 0 && x < width && y < height);
  };

  const manyNeighbours = (qs, { height, width }) => {
    const ps = [];

    for (const q of qs) {
      const ws = neighbours(q, { height, width });
      for (const w of ws) {
        if (!ps.includes(w)) {
          ps.push(w);
        }
      }
    }

    return ps;
  };

  const findReachable = ({ map, height, width }) => {
    const ps = [];

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (map[y][x].reach) {
          ps.push({ x, y });
        }
      }
    }

    return ps;
  };

  const step = ({ map, height, width }) => {
    const ps = findReachable({ map, height, width });
    const ns = manyNeighbours(ps, { height, width });

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        map[y][x].reach = false;
      }
    }

    for (const { x, y } of ns) {
      if (!map[y][x].isRock) {
        map[y][x].reach = true;
      }
    }
  };

  // (() => {
  //   const { map, width, height } = parseInput(input);

  //   const steps = 6;

  //   for (let i = 1; i <= steps; i++) {
  //     step({ map, width, height });
  //     console.log(`\nstep ${i}`);
  //     console.log(drawMap(map));
  //   }

  //   const rs = findReachable({ map, width, height });
  //   const n = rs.length;

  //   console.log(n);
  // })();

  const { map, width, height } = parseInput(input);

  const steps = 64;

  for (let i = 1; i <= steps; i++) {
    step({ map, width, height });
    // console.log(`\nstep ${i}`);
    // console.log(drawMap(map));
  }

  const rs = findReachable({ map, width, height });
  const n = rs.length;

  console.log(n);

  // 3729

  return n;
}
