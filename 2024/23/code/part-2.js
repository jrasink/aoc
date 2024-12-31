export default (input) => {
  const edges = input.split('\n').map((s) => s.split('-'));

  const nodes = []
  const lookup = {};

  for (const ns of edges) {
    for (const n of ns) {
      if (!nodes.includes(n)) {
        lookup[n] = nodes.push(n) - 1;
      }
    }
  }

  const matrix = [...Array(nodes.length ** 2)].map(() => false);

  for (const [a, b] of edges) {
    const n = lookup[a];
    const m = lookup[b];

    matrix[n * nodes.length + m] = true;
    matrix[n + m * nodes.length] = true;
  }

  const connected = (n, m) => matrix[n * nodes.length + m];

  const counts = nodes.map(() => 0);

  for (let n = 0; n < nodes.length; n++) {
    for (let m = n + 1; m < nodes.length; m++) {
      for (let k = m + 1; k < nodes.length; k++) {
        if (connected(n, m) && connected(n, k) && connected(m, k)) {
          counts[n] += 1;
        }
      }
    }
  }

  const n = counts.indexOf(Math.max(...counts));

  const ms = [n];

  for (let m = n + 1; m < nodes.length; m++) {
    for (let k = n + 1; k < nodes.length; k++) {
      if (connected(n, m) && connected(n, k) && connected(m, k)) {
        ms.push(m);
        break;
      }
    }
  }

  return ms.map((m) => nodes[m]).sort((a, b) => a > b ? 1 : -1).join(',');
}
