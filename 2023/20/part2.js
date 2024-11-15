const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const ModuleType = {
  FlipFlop: 'flip-flop',
  Conjunction: 'conjunction',
  Broadcast: 'broadcast'
};

const FlipFlopState = {
  On: 'on',
  Off: 'off'
};

const PulseType = {
  High: 'high',
  Low: 'low'
};

const parseModuleType = (t) => {
  switch(t) {
    case '%': return ModuleType.FlipFlop;
    case '&': return ModuleType.Conjunction;
    default: throw `unrecognized module type '${t}'`;
  }
};

const parseSourceString = (s) => {
  if (s === 'broadcaster') {
    return {
      name: s,
      type: ModuleType.Broadcast
    };
  }

  const t = s.slice(0, 1);
  const n = s.slice(1);

  return {
    name: n,
    type: parseModuleType(t)
  };
};

const parseLine = (s) => {
  const [sourceString, targetsString] = s.split(' -> ');
  const { name, type } = parseSourceString(sourceString);
  const targets = targetsString.split(', ');
  return { name, type, targets };
};

const parseInput = (s) => {
  const lines = s.split('\n').map(parseLine);
  const map = lines.reduce((map, { name, type, targets }) => ({ ...map, [name]: { type, targets} }), {});

  for (const { name, type } of lines) {
    if (type === ModuleType.FlipFlop) {
      map[name].state = FlipFlopState.Off;
    }

    if (type === ModuleType.Conjunction) {
      const sources = lines.reduce((sources, { name: source, targets }) => targets.includes(name) && !sources.includes(source) ? [...sources, source] : sources, []);
      map[name].state = sources.reduce((state, source) => ({ ...state, [source]: PulseType.Low }), {});
    }
  }

  return map;
};

const process = ({ source, target, type: pulseType }, map) => {
  if (!(target in map)) {
    return [];
  }

  const { state, type: moduleType, targets } = map[target];

  if (moduleType === ModuleType.FlipFlop) {
    if (pulseType === PulseType.High) {
      return [];
    } else {
      if (state === FlipFlopState.Off) {
        map[target].state = FlipFlopState.On;
        return targets.map((t) => ({ source: target, target: t, type: PulseType.High }));
      } else {
        map[target].state = FlipFlopState.Off;
        return targets.map((t) => ({ source: target, target: t, type: PulseType.Low }));
      }
    }
  }

  if (moduleType === ModuleType.Conjunction) {
    state[source] = pulseType;
    const high = Object.values(state).reduce((high, s) => high && s === PulseType.High, true);
    if (high) {
      return targets.map((t) => ({ source: target, target: t, type: PulseType.Low }));
    } else {
      return targets.map((t) => ({ source: target, target: t, type: PulseType.High }));
    }
  }

  if (moduleType === ModuleType.Broadcast) {
    return targets.map((t) => ({ source: target, target: t, type: pulseType }));
  }
};

const mash = (map) => {
  let signals = [{ source: 'button', target: 'broadcaster', type: PulseType.Low }];
  let rs = [...signals];
  while (signals.length > 0) {
    const ss = [];
    for (const signal of signals) {
      const ns = process(signal, map);
      ss.push(...ns);
    }
    rs.push(...ss);
    signals = ss;
  }
  return rs;
};

const map = parseInput(input);

const testPattern = (original, module, input) => {
  const map = JSON.parse(JSON.stringify(original));
  const { state: states } = map[module];

  const rs = [];

  let s = states[input];
  let n = 0;

  for (let i = 0; i < 100000; i++) {
    n += 1;
    mash(map);
    console.log(`module ${module} input ${input} state ${states[input]}`);
    if (s !== states[input]) {
      rs.push({ count: n, state: s });
      s = states[input];
      n = 0;
    }
  }

  return rs;
}

const counts = (xs) => {
  const o = {};
  for (const { count, state } of xs) {
    const k = `${state}x${count}`;
    if (!(k in o)) {
      o[k] = { count, state, repeat: 0 };
    }
    o[k].repeat += 1;
  }
  return Object.values(o);
}

const analyze1 = (map, module) => {
  for (const input of Object.keys(map[module].state)) {
    const pattern = testPattern(map, module, input);
    const metapattern = counts(pattern);

    for (const [k, p] of Object.entries(pattern)) {
      console.log(`${input} state ${k}`, p)
    }

    console.log(`module '${module}' input '${input}' pattern`, metapattern);
  }
};

// module 'ls' input 'px' pattern [
//   { count: 1024, state: 'low', repeat: 5090 },
//   { count: 1024, state: 'high', repeat: 2545 },
//   { count: 857, state: 'high', repeat: 2545 }
// ]
// module 'ls' input 'th' pattern [
//   { count: 16, state: 'low', repeat: 313057 },
//   { count: 16, state: 'high', repeat: 310511 },
//   { count: 9, state: 'high', repeat: 2545 }
// ]
// module 'ls' input 'hz' pattern [
//   { count: 1, state: 'low', repeat: 4996182 },
//   { count: 1, state: 'high', repeat: 4998727 },
//   { count: 2, state: 'low', repeat: 2545 }
// ]
// module 'ls' input 'bn' pattern [
//   { count: 512, state: 'low', repeat: 10181 },
//   { count: 512, state: 'high', repeat: 7635 },
//   { count: 345, state: 'high', repeat: 2545 }
// ]
// module 'ls' input 'fx' pattern [
//   { count: 64, state: 'low', repeat: 78900 },
//   { count: 64, state: 'high', repeat: 76355 },
//   { count: 25, state: 'high', repeat: 2545 }
// ]
// module 'ls' input 'bz' pattern [
//   { count: 256, state: 'low', repeat: 20361 },
//   { count: 256, state: 'high', repeat: 17816 },
//   { count: 89, state: 'high', repeat: 2545 }
// ]
// module 'ls' input 'dv' pattern [
//   { count: 2048, state: 'low', repeat: 2545 },
//   { count: 1881, state: 'high', repeat: 2545 }
// ]
// module 'ls' input 'hg' pattern [
//   { count: 8, state: 'low', repeat: 626113 },
//   { count: 8, state: 'high', repeat: 623568 },
//   { count: 1, state: 'high', repeat: 2545 }
// ]

const findPattern = (original, module, input) => {
  const map = JSON.parse(JSON.stringify(original));
  const { state: states } = map[module];

  const rs = [];

  let s = states[input];
  let n = 0;

  while (true) {
    n += 1;
    mash(map);
    if (s !== states[input]) {
      // we assume that the pattern ends when a repetition count is found that does not follow the pattern
      // we will 1. fail to detect if the pattern we found breaks after a certain number of repetitions, and 2. fail to halt if the counts continue to repeat perfectly
      if ((rs.length > 0) && (n != rs[0].count)) {
        // if the pulse type is low, then we've counted too many by the regular length of the first interval
        if (s === PulseType.Low) {
          rs.push({ count: n - rs[0].count, state: s });
        } else {
          rs.push({ count: n, state: s });
        }

        // we have a high state starting at offset, repeating every offset + length
        const offset = rs[0].count;
        // the high state remains for length
        const length = rs[1].count;
        // this loop repeats / resets every
        const loop = rs.reduce((l, { count }) => l + count, 0);

        return { offset, length, loop };
      } else {
        rs.push({ count: n, state: s });
      }
      s = states[input];
      n = 0;
    }
  }
}

const analyze = (map, module) => {
  const rs = [];
  for (const input of Object.keys(map[module].state)) {
    const pattern = findPattern(map, module, input);
    // console.log(`module '${module}' input '${input}' pattern `, pattern);
    rs.push(pattern);
  }
  const loop = rs[0].loop;
  const sum = rs.reduce((n, { offset }) => n + offset, 0);
  // console.log(`module '${module}' has loop ${loop} and sum ${sum}`);

  return loop;
};

// (vr) => rx
// (pq, fg, dk, fm) => vr
// (fs) => pq
// (ls) => fg
// (sf) => dk
// (tx) => fm

// vr memory must be high for pg, fg, dk, fm each
// pg, fg, dk, fm each have one source, so each memory must be low for a high pulse to be sent; the corresponding source modules are fs, ls, sf and tx
// fs, ls, sf and tx must reach a high memory state at the same time for each of their dependencies

// each input state appears to follow a pattern where low/highs are flipped every N iterations, but broken every M iterations
// this pattern then appears to repeat indefinitely

// --- analyzing fs
// module 'fs' input 'hd' pattern  { offset: 128, length: 128, loop: 4001 }
// module 'fs' input 'jz' pattern  { offset: 32, length: 32, loop: 4001 }
// module 'fs' input 'dt' pattern  { offset: 2048, length: 1953, loop: 4001 }
// module 'fs' input 'vn' pattern  { offset: 256, length: 256, loop: 4001 }
// module 'fs' input 'rt' pattern  { offset: 512, length: 512, loop: 4001 }
// module 'fs' input 'kz' pattern  { offset: 1024, length: 1024, loop: 4001 }
// module 'fs' input 'nk' pattern  { offset: 1, length: 1, loop: 4001 }
// module 'fs' has loop 4001 and sum 4001
// --- analyzing ls
// module 'ls' input 'px' pattern  { offset: 1024, length: 1024, loop: 3929 }
// module 'ls' input 'th' pattern  { offset: 16, length: 16, loop: 3929 }
// module 'ls' input 'hz' pattern  { offset: 1, length: 1, loop: 3929 }
// module 'ls' input 'bn' pattern  { offset: 512, length: 512, loop: 3929 }
// module 'ls' input 'fx' pattern  { offset: 64, length: 64, loop: 3929 }
// module 'ls' input 'bz' pattern  { offset: 256, length: 256, loop: 3929 }
// module 'ls' input 'dv' pattern  { offset: 2048, length: 1881, loop: 3929 }
// module 'ls' input 'hg' pattern  { offset: 8, length: 8, loop: 3929 }
// module 'ls' has loop 3929 and sum 3929
// --- analyzing sf
// module 'sf' input 'vg' pattern  { offset: 128, length: 128, loop: 3793 }
// module 'sf' input 'xv' pattern  { offset: 1024, length: 1024, loop: 3793 }
// module 'sf' input 'gg' pattern  { offset: 64, length: 64, loop: 3793 }
// module 'sf' input 'mv' pattern  { offset: 16, length: 16, loop: 3793 }
// module 'sf' input 'hp' pattern  { offset: 2048, length: 1745, loop: 3793 }
// module 'sf' input 'nv' pattern  { offset: 1, length: 1, loop: 3793 }
// module 'sf' input 'fh' pattern  { offset: 512, length: 512, loop: 3793 }
// module 'sf' has loop 3793 and sum 3793
// --- analyzing tx
// module 'tx' input 'jk' pattern  { offset: 1024, length: 1024, loop: 4007 }
// module 'tx' input 'bj' pattern  { offset: 32, length: 32, loop: 4007 }
// module 'tx' input 'jh' pattern  { offset: 4, length: 4, loop: 4007 }
// module 'tx' input 'hr' pattern  { offset: 1, length: 1, loop: 4007 }
// module 'tx' input 'gm' pattern  { offset: 128, length: 128, loop: 4007 }
// module 'tx' input 'jt' pattern  { offset: 256, length: 256, loop: 4007 }
// module 'tx' input 'gk' pattern  { offset: 2, length: 2, loop: 4007 }
// module 'tx' input 'xt' pattern  { offset: 2048, length: 1959, loop: 4007 }
// module 'tx' input 'zb' pattern  { offset: 512, length: 512, loop: 4007 }
// module 'tx' has loop 4007 and sum 4007

// we find that the sum of the offsets is equal to the loop length / point of reset
// the sum of the offsets is where alignment happens and a low pulse is sent out
// the low pulse being sent out appears to cause the state of the dependency to be reset to its initial state

// -> this means that a low pulse is sent out after every loop length

// -> low pulses from all dependencies will therefore coincide at the lcm of the dependencies' loop lengths

const deps = ['fs', 'ls', 'sf', 'tx'];

// for (const dep of deps) {
//   console.log(`--- analyzing ${dep}`);
//   analyze(map, dep);
// }

const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => (a * b) / gcd(a, b);

const loops = deps.map((dep) => analyze(map, dep));

const n = loops.reduce((a, b) => lcm(a, b));

console.log(n);

// 238920142622879
