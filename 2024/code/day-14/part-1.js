export default (input) => {
  const parseLine = (s) => {
    const [pString, vString] = s.split(' ');
    const [p, v] = [pString, vString].map((s) => {
      const [x, y] = s.slice(2).split(',').map((s) => parseInt(s, 10));
      return { x, y };
    });
    return { p, v };
  };

  const robots = input.split('\n').map(parseLine);

  const { width, height } = robots.length === 12 ? { width: 11, height: 7 } : { width: 101, height: 103 }

  const time = 100;

  const pmod = (n, m) => (n % m + m) % m;

  const getPosition = ({ p, v }, t) => ({ x: pmod(p.x + v.x * t, width), y: pmod(p.y + v.y * t, height) });

  const map = [...Array(width * height)].map(() => 0);

  for (const robot of robots) {
    const { x, y } = getPosition(robot, time);
    map[width * y + x] += 1;
  }

  const qw = (width - 1) / 2;
  const qh = (height - 1) / 2;

  const qs = [
    { x: 0, y: 0 },
    { x: qw + 1, y: 0 },
    { x: 0, y: qh + 1 },
    { x: qw + 1, y: qh + 1 }
  ];

  const rs = qs.map((q) => {
    let count = 0;
    for (let x = q.x, l = q.x + qw; x < l; x++) {
      for (let y = q.y, m = q.y + qh; y < m; y++) {
        count += map[width * y + x];
      }
    }
    return count;
  });

  return rs.reduce((n, r) => n * r, 1);
}
