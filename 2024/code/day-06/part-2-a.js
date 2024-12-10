export default (input) => {
  const C = {
    free: '.',
    obstacle: '#',
    start: '^'
  };

  const D = {
    n: 0,
    e: 1,
    s: 2,
    w: 3
  };

  const matrix = input.split('\n').map((s) => s.split(''));
  const xbound = matrix[0].length - 1;
  const ybound = matrix.length - 1;

  const copy = (xs) => xs.map((x) => x);

  const bmap = Array(1 << 16);
  let start;

  for (let y = 0; y <= ybound; y++) {
    for (let x = 0; x <= xbound; x++) {
      if (matrix[y][x] === C.obstacle) {
        bmap[(y << 8) + x] = true;
      }
      if (matrix[y][x] === C.start) {
        start = (y << 10) + (x << 2);
      }
    }
  }

  const move = (i) => {
    switch (i & 3) {
      case D.n:
        return ((i >> 10) === 0) ? null : i - 1024;
      case D.s:
        return ((i >> 10) === ybound) ? null : i + 1024;
      case D.w:
        return (((i >> 2) & 255) === 0) ? null : i - 4;
      case D.e:
        return (((i >> 2) & 255) === xbound) ? null : i + 4;
    }
  }

  const rot = (i) => (((i & 3) === D.w) ? i - 3 : i + 1);

  const walk = (start, bmap, odmap) => {
    const dmap = copy(odmap);
    const path = [];

    let current = start;

    while (true) {
      path.push(current);

      const next = move(current);

      if (next === null) {
        return { path, loop: false };
      }

      if (dmap[next]) {
        return { path, loop: true };
      }

      dmap[next] = true;

      if (bmap[next >> 2]) {
        current = rot(current);
      } else {
        current = next;
      }
    }
  };

  const dmap = Array(1 << 18);

  const { path } = walk(start, bmap, dmap);

  let results = 0;

  const tmap = Array(1 << 16);

  let lpos = path.shift();

  for (const i of path) {
    const j = i >> 2;
    if (!tmap[j]) {
      tmap[j] = true;
      bmap[j] = true;
      const { loop } = walk(lpos, bmap, dmap);
      if (loop) {
        results += 1;
      }
      delete bmap[j];
    }
    dmap[i] = true;
    lpos = i;
  }

  return results;
};
