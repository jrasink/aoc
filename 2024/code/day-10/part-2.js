export default (input) => {
  const map = input.split('\n').map((s) => s.split('').map((s) => parseInt(s, 10)));
  const height = map.length;
  const width = map[0].length;

  const inside = ({ y, x }) => y >= 0 && y < height && x >= 0 && x < width;

  const neighbours = ({ x, y }) => [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].filter(inside);

  const next = (p) => neighbours(p).filter((n) => (map[n.y][n.x] - map[p.y][p.x]) === 1);

  const hs = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (map[y][x] === 0) {
        hs.push({ x, y });
      }
    }
  }

  const scan = (start) => {
    let ps = [start];

    for (let k = 0; k < 9; k++) {
      ps = [].concat(...ps.map(next));
    }

    return ps.length;
  };

  const r = hs.map(scan).reduce((r, n) => r + n, 0);

  return r;
}
