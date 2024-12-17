export default (input) => {
  const Symbol = {
    wall: '#',
    free: '.',
    start: 'S',
    end: 'E'
  };

  const Direction = {
    north: 0,
    east: 1,
    south: 2,
    west: 3
  };

  const directions = 4;
  const rotations = [[1, 3], [0, 2], [1, 3], [0, 2]];

  const cells = input.split('\n').map((s) => s.split(''));

  const width = cells[0].length;
  const height = cells.length;

  const move = [-width, 1, width, -1];

  const range = (n) => [...Array(n)].map((_, i) => i);

  const walls = range(width * height).map(() => false);

  let start;
  let end;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const symbol = cells[y][x];

      const index = width * y + x;

      if (symbol === Symbol.wall) {
        walls[index] = true;
      }

      if (symbol === Symbol.start) {
        start = index;
      }

      if (symbol === Symbol.end) {
        end = index;
      }
    }
  }

  const neighbours = (i) => {
    const dir = i % directions;
    const pos = Math.floor(i / directions);

    const ns = rotations[dir].map((d) => ({ index: pos * directions + d, score: 1000 }));

    const m = pos - move[dir];

    if (!walls[m]) {
      ns.push({ index: m * directions + dir, score: 1 });
    }

    return ns;
  };

  const scores = range(width * height * directions).map(() => null);

  const scan = () => {
    let ms = range(directions).map((d) => end * directions + d);

    for (const m of ms) {
      scores[m] = 0;
    }

    while (ms.length > 0) {
      const ns = [];

      for (const m of ms) {
        const b = scores[m];

        for (const { index, score } of neighbours(m)) {
          const s = b + score;

          if (scores[index] === null || scores[index] > s) {
            scores[index] = s;
            ns.push(index);
          }
        }
      }

      ms = ns;
    }
  };

  scan();

  return scores[start * directions + Direction.east];
}
