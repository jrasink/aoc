export default (input) => {
  const [gatesString] = input.split('\n\n').slice(1);

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

  let matrix;
  let outputLookup;

  const index = () => {
    matrix = [...Array(wires.length * gates.length)].map(() => false);
    outputLookup = [...Array(wires.length)].map(() => null);

    for (let i = 0; i < gates.length; i++) {
      const { out, left, right } = gates[i];
      matrix[left * gates.length + i] = true;
      matrix[right * gates.length + i] = true;
      outputLookup[out] = i;
    }
  };

  index();

  const set = ((state, wire, value) => {
    state[wire] = value;

    for (let i = 0; i < gates.length; i++) {
      if (matrix[wire * gates.length + i]) {
        const { op, left, right, out } = gates[i];
        const [so, sl, sr] = [out, left, right].map((wire) => state[wire]);

        if (so === null && sl !== null && sr !== null) {
          set(state, out, ops[op](sl, sr));
        }
      }
    }
  });

  const inbits = 45;
  const outbits = 46;

  const bitWireMap = {
    x: Array(inbits),
    y: Array(inbits),
    z: Array(outbits)
  };

  for (let i = 0; i < inbits; i++) {
    bitWireMap.x[i] = wireLookup[`x${`0${i}`.slice(-2)}`];
    bitWireMap.y[i] = wireLookup[`y${`0${i}`.slice(-2)}`];
  }

  for (let i = 0; i < outbits; i++) {
    bitWireMap.z[i] = wireLookup[`z${`0${i}`.slice(-2)}`];
  }

  const swaps = [];

  const swap = (a, b) => {
    const out = gates[a].out;
    gates[a].out = gates[b].out;
    gates[b].out = out;
    swaps.push(wires[gates[a].out], wires[gates[b].out]);

    index();
  };

  const setX = (state, n) => {
    for (let i = 0; i < inbits; i++) {
      set(state, bitWireMap.x[i], n & 1n);
      n >>= 1n;
    }
  };

  const setY = (state, n) => {
    for (let i = 0; i < inbits; i++) {
      set(state, bitWireMap.y[i], n & 1n);
      n >>= 1n;
    }
  };

  const getZ = (state) => {
    let n = 0n;

    for (let i = outbits - 1; i >= 0; i--) {
      n <<= 1n;
      n += state[bitWireMap.z[i]] ? 1n : 0n;
    }

    return n;
  };

  const test = (b = inbits) => {
    const m = 2 ** b;

    for (let k = 0; k < 1000; k++) {
      const state = wires.map(() => null);

      const x = BigInt(Math.floor(m * Math.random()));
      const y = BigInt(Math.floor(m * Math.random()));

      setX(state, x);
      setY(state, y);

      const z = getZ(state);
      const r = x + y;

      if (z !== r) {
        console.log(`test: ${x} + ${y} = ${r}; adder gave ${z}`);
        return false;
      }
    }

    return true;
  };

  const scanTree = (w) => {
    const i = outputLookup[w];

    if (i === null) {
      return { wire: wires[w] };
    }

    const { op, left, right } = gates[i];

    return {
      gate: {
        op,
        left: scanTree(left),
        right: scanTree(right)
      }
    }
  };

  const dumpTree = (t, indent = 0) => {
    const m = [...Array(indent)].map(() => ' ').join('');

    if (t.wire) {
      return `${m}${t.wire}`;
    }

    const { op, left, right } = t.gate;

    if (left.wire) {
      return `${m}${op}(${left.wire}, ${right.wire})`;
    }

    let first, second;

    if (left.gate.left.wire) {
      first = left;
      second = right;
    } else {
      first = right;
      second = left;
    }

    return `${m}${op}(\n${dumpTree(first, indent + 2)},\n${dumpTree(second, indent + 2)}\n${m})`;
  }

  const findGateByOpInput = (op, wire) => {
    for (let i = 0; i < gates.length; i++) {
      const gate = gates[i];
      const ins = [gate.left, gate.right];
      if (gate.op === op && ins.includes(wire)) {
        return i;
      }
    }

    return null;
  }

  const findGateByOutput = (wire) => outputLookup[wire];

  const dump = (i) => dumpTree(scanTree(i));

  const check = (k) => {
    for (let i = 1; i < k; i++) {
      console.log(`\n------\nbit ${i}\n------\n`);

      const rootXor = findGateByOpInput('xor', bitWireMap.x[i]);

      const gateConnectedToZ = findGateByOutput(bitWireMap.z[i]);
      const gateProducingResult = findGateByOpInput('xor', gates[rootXor].out);

      if (gateConnectedToZ === gateProducingResult) {
        console.log(`Output connection check: OK`);
      } else {
        console.log(`Output connection check: NOK`, gateConnectedToZ, gateProducingResult);

        if (gateConnectedToZ !== null) {
          console.log(`dumping gate connected to Z (${gateConnectedToZ})`);
          console.log(dump(gates[gateConnectedToZ].out));
        }

        if (gateProducingResult !== null) {
          console.log(`dumping gate producing result (${gateProducingResult})`);
          console.log(dump(gates[gateProducingResult].out));
        }

        if (gateProducingResult === null) {
          // root xor is not connected to an xor gate
          // root xor output should be swapped with one of the inputs of gateConnectedToZ

          // check what gate root xor is connected to
          for (const op of ['xor', 'or', 'and']) {
            const outGate = findGateByOpInput(op, gates[rootXor].out);
            if (outGate !== null) {
              console.log('rootXor target', op, outGate);
              console.log(dump(gates[outGate].out));
            }
          }

          // rootXor and rootAnd appear to be switched, these need to be swapped
          const rootAnd = findGateByOpInput('and', bitWireMap.x[i]);
          console.log(dump(gates[rootAnd].out));
          console.log(rootAnd, rootXor);

        }

        break;
      }

      if (test(i)) {
        console.log('Addition check: OK')
      } else {
        console.log('Addition check: NOK')
        break;
      }
    }
  }

  swap(143, 0);
  swap(111, 76);
  swap(7, 18);
  swap(52, 97);

  check(inbits);

  return swaps.sort((a, b) => a > b ? 1 : -1).join(',');
}
