export default (input) => {
  const lines = input.split('\n');

  const map = {};

  for (const line of lines) {
    const [from, toss] = line.split(': ');
    const tos = toss.length ? toss.split(' ') : [];
    map[from] = tos;
  }

  const reverse = {};

  for (const [from, tos] of Object.entries(map)) {
    for (const to of tos) {
      if (!(to in reverse)) {
        reverse[to] = [];
      }
      reverse[to].push(from);
    }
  }

  const trace = {};

  let o = { out: 1 };

  while (true) {
    const p = {};

    for (const [k, n] of Object.entries(o)) {
      if (!(k in trace)) {
        trace[k] = 0;
      }

      trace[k] += n;

      if (k in reverse) {
        for (const i of reverse[k]) {
          if (!(i in p)) {
            p[i] = 0;
          }
          p[i] += n;
        }
      }
    }

    o = p;

    if (!Object.keys(p).length) {
      return trace.you;
    }
  }
}
