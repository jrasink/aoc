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

    return ns;
  }

  const getDistances = () => {
    const distances = range(width * height).map(() => null);

    let ms = [end];

    distances[end] = 0;

    while (ms.length > 0) {
      const ns = [];

      for (const m of ms) {
        const d = distances[m] + 1;

        for (const n of neighbours(m).filter((i) => !walls[i])) {
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

  const distances = getDistances();

  const cutoff = input.length > 20000 ? 100 : 50;

  const getIndexCheats = (i) => {
    const scanned = range(width * height).map(() => null);
    const cheats = range(width * height).map(() => 0);

    let ms = [i];
    let depth = 0;

    while (ms.length > 0 && depth < 20) {
      depth += 1;

      const ns = [];

      for (const m of ms) {
        const ts = neighbours(m);

        for (const t of ts) {
          if (!scanned[t]) {
            scanned[t] = true;
            ns.push(t);
          }

          if (!walls[t]) {
            const score = (distances[t] - distances[i]) - depth;

            if (cheats[t] < score)  {
              cheats[t] = score;
            }
          }
        }
      }

      ms = ns;
    }

    return cheats.filter((score) => score >= cutoff).length;
  }

  const getCheats = () => {
    let cheats = 0;

    for (let i = 0; i < walls.length; i++) {
      if (!walls[i]) {
        cheats += getIndexCheats(i);
      }
    }

    return cheats;
  }

  return getCheats();
}
