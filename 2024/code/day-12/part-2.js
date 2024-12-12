export default (input) => {
  const parseInput = (input) => {
    const plots = input.split('\n').map((s) => s.split(''));
    const width = plots[0].length;
    const height = plots.length;
    return { plots, width, height };
  }

  const { plots, width, height } = parseInput(input);

  const inside = ({ x, y }) => y >= 0 && y < height && x >= 0 && x < width;
  const neighbours = ({ x, y }) => [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].filter(inside);

  const regions = [];
  const map = [...Array(height)].map(() => [...Array(width)].map(() => null));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (map[y][x] !== null) {
        continue;
      }

      const plant = plots[y][x];

      const region = [];
      const id = regions.push(region) - 1;

      map[y][x] = id;

      let scan = [{ x, y }];

      while (scan.length > 0) {
        region.push(...scan);

        const ms = [];

        for (const p of scan) {
          for (const { x, y } of neighbours(p)) {
            if (map[y][x] === null && plots[y][x] === plant) {
              map[y][x] = id;
              ms.push({ x, y });
            }
          }
        }

        scan = ms;
      };
    }
  }

  const area = (region) => region.length;

  const D = {
    n: 0,
    e: 1,
    s: 2,
    w: 3
  };

  const offset = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  const orthogonals = (d) => [(d + 1) % 4, (d + 3) % 4];

  const index = (x, y, d) => 4 * (width * y + x) + d;

  const borders = ({ x, y }) => [D.n, D.e, D.s, D.w].map((d) => ({ x, y, d })).filter(({ x, y, d }) => {
    const bx = x + offset[d][0];
    const by = y + offset[d][1];
    return !inside({ x: bx, y: by }) || map[by][bx] !== map[y][x];
  });

  const perimeter = (region) => {
    const bs = [].concat(...region.map(borders));

    const exists = Array(width * height * 4);

    for (const { x, y, d } of bs) {
      exists[index(x, y, d)] = true;
    }

    const edges = [];

    const scanned = Array(width * height * 4);

    for (const { x, y, d } of bs) {
      if (scanned[index(x, y, d)]) {
        continue;
      }

      scanned[index(x, y, d)] = true;

      const edge = [{ x, y, d }];

      for (const k of orthogonals(d)) {
        let i = 0;

        while (true) {
          i += 1;

          const tx = x + i * offset[k][0];
          const ty = y + i * offset[k][1];

          if (!inside({ x: tx, y: ty })) {
            break;
          }

          if (!exists[index(tx, ty, d)]) {
            break;
          }

          scanned[index(tx, ty, d)] = true;

          edge.push({ x: tx, y: ty, d });
        }
      };

      edges.push(edge);
    }

    return edges.length;
  }

  let total = 0;

  for (const region of regions) {
    const a = area(region);
    const p = perimeter(region);
    total += a * p;
  }

  return total;
}