export default (input) => {
  const D = {
    north: '^',
    south: 'v',
    east: '>',
    west: '<'
  };

  const next = ({ x, y }, d) => {
    switch (d) {
      case D.north:
        return { x, y: y - 1 };
      case D.south:
        return { x, y: y + 1 };
      case D.east:
        return { x: x + 1, y };
      case D.west:
        return { x: x - 1, y };
    }
  }

  let minx = 0;
  let maxx = 0;
  let miny = 0;
  let maxy = 0;

  const instructions = input.split('');

  let p = { x: 0, y: 0 }

  for (const i of instructions) {
    const { x, y } = p = next(p, i);

    if (x < minx) {
      minx = x;
    }

    if (x > maxx) {
      maxx = x;
    }

    if (y < miny) {
      miny = y;
    }

    if (y > maxy) {
      maxy = y;
    }
  }

  const grid = [...Array(maxy - miny + 1)].map(() => [...Array(maxx - minx + 1)].map(() => 0));

  const visit = ({ x, y }) => {
    grid[y - miny][x - minx] += 1;
  }

  p = { x: 0, y: 0 };

  visit(p);

  for (const i of instructions) {
    p = next(p, i);
    visit(p);
  }

  return grid.reduce((n, xs) => xs.reduce((n, x) => x > 0 ? n + 1 : n, n), 0);
}
