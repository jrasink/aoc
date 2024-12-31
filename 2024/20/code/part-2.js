export default (input) => {
  const Symbol = {
    wall: '#',
    free: '.',
    start: 'S',
    end: 'E'
  };

  const cells = input.split('\n').map((s) => s.split(''));

  const width = cells[0].length;
  const height = cells.length;

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
    const x = i % width;
    const y = Math.floor(i / width);

    const ns = [];

    if (x !== 0) {
      ns.push(i - 1);
    }

    if (y !== 0) {
      ns.push(i - width);
    }

    if (x !== (width - 1)) {
      ns.push(i + 1);
    }

    if (y !== (height - 1)) {
      ns.push(i + width);
    }

    return ns.filter((i) => !walls[i]);
  }

  const scan = () => {
    const distances = range(width * height).map(() => null);

    let ms = [end];

    distances[end] = 0;

    while (ms.length > 0) {
      const ns = [];

      for (const m of ms) {
        const d = distances[m] + 1;

        for (const n of neighbours(m)) {
          if (distances[n] === null || distances[n] > d) {
            distances[n] = d;
            ns.push(n);
          }
        }
      }

      ms = ns;
    }

    return distances;
  };

  const distances = scan();

  const cheat = () => {
    let cheats = 0;

    for (let p = 0; p < width * height; p++) {
      if (!walls[p]) {
        for (let q = 0; q < width * height; q++) {
          const d = Math.abs(Math.floor(p / width) - Math.floor(q / width)) + Math.abs((p % width) - (q % width));
          if (d < 21 && !walls[q]) {
            if (((distances[p] - distances[q]) - d) >= 100) {
              cheats += 1;
            }
          }
        }
      }
    }

    return cheats;
  }

  return cheat();
}
