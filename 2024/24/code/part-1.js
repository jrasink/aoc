export default (input) => {
  const [initsString, gatesString] = input.split('\n\n');

  const ops = {
    and: (left, right) => left & right,
    or: (left, right) => left | right,
    xor: (left, right) => left ^ right
  };

  const wires = [];
  const wireLookup = {};

  for (const s of gatesString.split('\n')) {
    const [opString, out] = s.split(' -> ');
    const [left, _, right] = opString.split(' ');

    for (const name of [left, right, out]) {
      if (!(name in wireLookup)) {
        wireLookup[name] = wires.push(name) - 1;
      }
    }
  }

  const inits = initsString.split('\n').map((s) => {
    const [wire, valueString] = s.split(': ');

    return {
      wire: wireLookup[wire],
      value: parseInt(valueString, 2)
    };
  });

  const gates = gatesString.split('\n').map((s) => {
    const [opString, out] = s.split(' -> ');
    const [left, op, right] = opString.split(' ');

    return {
      op: op.toLowerCase(),
      left: wireLookup[left],
      right: wireLookup[right],
      out: wireLookup[out]
    };
  });

  const matrix = [...Array(wires.length * gates.length)].map(() => false);

  for (let i = 0; i < gates.length; i++) {
    const { left, right } = gates[i];
    matrix[left * gates.length + i] = true;
    matrix[right * gates.length + i] = true;
  }

  const state = wires.map(() => null);

  const set = ((wire, value) => {
    state[wire] = value;

    for (let i = 0; i < gates.length; i++) {
      if (matrix[wire * gates.length + i]) {
        const { op, left, right, out } = gates[i];
        const [so, sl, sr] = [out, left, right].map((wire) => state[wire]);

        if (so === null && sl !== null && sr !== null) {
          set(out, ops[op](sl, sr));
        }
      }
    }
  });

  for (const { wire, value } of inits) {
    set(wire, value);
  }

  const bs = Array();

  for (let i = 0; i < wires.length; i++) {
    const name = wires[i];
    const c = name.slice(0, 1);
    if (c === 'z') {
      const k = parseInt(name.slice(1), 10);
      bs[k] = state[i];
    }
  }

  return bs.reverse().reduce((n, b) => 2 * n + b, 0);
}
