export default (input) => {
  const isTest = input.length > 99;
  const width =  isTest ? 71 : 7;
  const height = isTest ? 71 : 7;

  const start = 0;
  const end = width * height - 1;

  const ps = input.split('\n').map((s) => s.split(',').map((s) => parseInt(s, 10))).map((([x, y]) => width * y + x));

  const range = (n) => [...Array(n)].map((_, i) => i);

  const neighbours = (n) => {
    const x = n % width;
    const y = Math.floor(n / width);

    const ns = [];

    if (x !== 0) {
      ns.push(n - 1);
    }

    if (y !== 0) {
      ns.push(n - width);
    }

    if (x !== (width - 1)) {
      ns.push(n + 1);
    }

    if (y !== (height - 1)) {
      ns.push(n + width);
    }

    return ns;
  }

  const map = range(width * height).map(() => true);
  const dist = range(width * height).map(() => null);

  for (let i = 0; i < 1024; i++) {
    const p = ps[i];
    map[p] = false;
  }

  dist[start] = 0;
  let ns = [start];

  while (ns.length > 0) {
    const ms = [];

    for (const n of ns) {
      const d = dist[n];
      for (const m of neighbours(n)) {
        if (map[m] && dist[m] === null) {
          dist[m] = d + 1;
          ms.push(m);
        }
      }
    }

    ns = ms;
  }

  return dist[end];
}
