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

  const inside = ({ x, y }) => y >= 0 && y < height && x >= 0 && x < width;
  const neighbours = ({ x, y }) => [
    { x: x - 1, y: y - 1 },
    { x: x - 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y },
    { x: x + 1, y: y + 1 }
  ].filter(inside);

  const pmod = (n, m) => (n % m + m) % m;

  const getPosition = ({ p, v }, t) => ({ x: pmod(p.x + v.x * t, width), y: pmod(p.y + v.y * t, height) });

  const getPattern = (robot) => {
    const ps = [];

    const map = Array(width * height);

    let t = 0;

    while (true) {
      const { x, y } = getPosition(robot, t);
      const i = width * y + x;
      if (map[i]) {
        return ps;
      }
      map[i] = true;
      ps.push({ x, y });
      t += 1;
    }
  }

  const patterns = robots.map(getPattern);

  const getMap = (t) => {
    const map = [...Array(height)].map(() => [...Array(width)].map(() => 0));

    for (const ps of patterns) {
      const { x, y } = ps[t];
      map[y][x] += 1;
    }

    return map;
  }

  const getConnectedScore = (t) => {
    const map = getMap(t);

    const scanned = [...Array(height)].map(() => [...Array(width)].map(() => false));
    const groups = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (map[y][x] > 0 && !scanned[y][x]) {
          scanned[y][x] = true;

          const group = [];

          let tiles = [{ x, y }];

          while (tiles.length > 0) {
            group.push(...tiles);

            const next = [];

            for (const tile of tiles) {
              for (const { x, y } of neighbours(tile)) {
                if ((map[y][x] > 0) && !scanned[y][x]) {
                  scanned[y][x] = true;
                  next.push({ x, y });
                }
              }
            }

            tiles = next;
          }

          groups.push(group.length);
        };

        scanned[y][x] = true;
      }
    }

    return Math.max(...groups);
  };

  let score = 0;
  let time = 0;

  for (let t = 0; t < 10403; t++) {
    const s = getConnectedScore(t);
    if (s > score) {
      score = s;
      time = t;
    }
  }

  const map = getMap(time);

  const print = (map) => console.log(map.map((ns) => ns.map((n) => n > 0 ? `${n}` : '.').join('')).join('\n'));

  print(map);

  return time;
}
