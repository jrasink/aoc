export default (input) => {
  const rows = input.split('\n').map((s) => s.split('').map((s) => s === '@'));

  const height = rows.length;
  const width = rows[0].length;
  const fields = [].concat(...rows);

  const neighbours = (p) => {
    const x = p % width;
    const y = Math.floor(p / width);

    const candidates = [
      { x: x - 1, y: y - 1},
      { x: x - 1, y: y },
      { x: x - 1, y: y + 1},
      { x: x, y: y - 1},
      { x: x, y: y + 1},
      { x: x + 1, y: y - 1},
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1}
    ];

    const valid = candidates.filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height);

    return valid.map(({ x, y }) => y * width + x);
  }

  const ns = fields.map((_, i) => neighbours(i).reduce((n, p) => fields[p] ? n + 1 : n, 0));

  const rs = fields.map((b, i) => b && ns[i] < 4);

  return rs.reduce((z, r) => z + (r ? 1 : 0), 0);
}
