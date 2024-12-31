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

  let count = 0;

  for (let n = 0; n < nodes.length; n++) {
    for (let m = n + 1; m < nodes.length; m++) {
      for (let k = m + 1; k < nodes.length; k++) {
        if (connected(n, m) && connected(n, k) && connected(m, k)) {
          if ([n, m, k].map((i) => nodes[i][0] === 't').reduce((r, b) => r || b, false)) {
            count += 1;
          }
        }
      }
    }
  }

  return count;
}
