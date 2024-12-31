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

  const scan = ({ x, y }) => {
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

  const instructions = input.split('');

  let p = { x: 0, y: 0 }
  let r = { x: 0, y: 0 }

  for (let i = 0; i < instructions.length; i++) {
    if (i % 2) {
      r = next(r, instructions[i]);
      scan(r);
    } else {
      p = next(p, instructions[i]);
      scan(p);
    }
  }

  const grid = [...Array(maxy - miny + 1)].map(() => [...Array(maxx - minx + 1)].map(() => 0));

  const visit = ({ x, y }) => {
    grid[y - miny][x - minx] += 1;
  }

  p = { x: 0, y: 0 };
  r = { x: 0, y: 0 };

  visit(p);

  for (let i = 0; i < instructions.length; i++) {
    if (i % 2) {
      r = next(r, instructions[i]);
      visit(r);
    } else {
      p = next(p, instructions[i]);
      visit(p);
    }
  }

  return grid.reduce((n, xs) => xs.reduce((n, x) => x > 0 ? n + 1 : n, n), 0);
}
