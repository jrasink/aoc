export default (input) => {
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
    // console.log('process', source, target, pulseType)

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

  const calculate = (map, repeat) => {
    const ps = [];

    for (let i = 0; i < repeat; i++) {
      ps.push(...mash(map));
    }

    const hi = ps.filter(({ type }) => type === PulseType.High).length;
    const lo = ps.filter(({ type }) => type === PulseType.Low).length;

    return { lo, hi };
  };

  const { lo, hi } = calculate(map, 1000);

  // console.log(hi, lo);
  console.log(hi * lo);

  // 712543680

  return hi * lo;
}
