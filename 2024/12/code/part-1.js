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
  const perimeter = (region) => region.reduce((perimeter, { x, y }) => {
    const r = map[y][x];
    const borders = [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].filter(({ x, y }) => !inside({ x, y }) || map[y][x] !== r);
    return perimeter + borders.length;
  }, 0);

  let total = 0;

  for (const region of regions) {
    const a = area(region);
    const p = perimeter(region);
    total += a * p;
  }

  return total;
}