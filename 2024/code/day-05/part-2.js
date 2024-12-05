export default (input) => {
  const [orderingRulesString, updatesString] = input.split('\n\n');

  const orderingRules = orderingRulesString.split('\n').map((s) => s.split('|').map((s) => parseInt(s, 10)));
  const updates = updatesString.split('\n').map((s) => s.split(',').map((s) => parseInt(s, 10)));

  const forbidden = orderingRules.reduce((forbidden, [a, b]) => {
    if (!(b in forbidden)) {
      forbidden[b] = [];
    }
    forbidden[b].push(a);
    return forbidden;
  }, {});

  const isForbidden = (x, y) => (forbidden[x] || []).includes(y);
  const hasForbidden = (x, ys) => ys.map((z) => isForbidden(x, z)).filter((b) => b).length > 0;

  const isValid = (xs) => {
    const ys = [...xs];
    while (ys.length > 0) {
      const y = ys.shift();
      if (hasForbidden(y, ys)) {
        return false;
      }
    }
    return true;
  }

  const invalid = updates.filter((update) => !isValid(update));

  const sort = (xs) => {
    if (!xs.length) {
      return xs;
    }

    for (let i = 0; i < xs.length; i++) {
      const x = xs[i];
      const rs = [...xs.slice(0, i), ...xs.slice(i+1)];
      if (!hasForbidden(x, rs)) {
        return [x, ...sort(rs)];
      }
    }

    throw new Error(`Cannot sort [${xs.join(', ')}]`);
  }

  const valid = invalid.map(sort);

  const middle = (xs) => xs[Math.floor((xs.length - 1) / 2)];

  const ns = valid.map(middle);

  const n = ns.reduce((n, a) => n + a, 0);

  return n;
}
