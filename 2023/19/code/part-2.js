export default (input) => {
  const CATEGORY = {
    x: 'x',
    m: 'm',
    a: 'a',
    s: 's'
  };

  const OP = {
    always: '*',
    never: '#',
    gt: '>',
    lt: '<',
    gte: '>=',
    lte: '<='
  };

  const parseAttributeString = (s) => {
    switch(s) {
      case 'x':
        return CATEGORY.x;
      case 'm':
        return CATEGORY.m;
      case 'a':
        return CATEGORY.a;
      case 's':
        return CATEGORY.s;
    }

    throw `unrecognized attribute: '${s}'`;
  };

  const parseOpString = (s) => {
    switch(s) {
      case '<':
        return OP.lt;
      case '>':
        return OP.gt
    }

    throw `unrecognized operation: '${s}'`;
  };

  const parseRuleString = (s) => {
    const { attrstr, opstr, parstr, target } = s.match(/^(?<attrstr>\w)(?<opstr>[\<\>]{1})(?<parstr>\d+):(?<target>\w+)$/).groups;

    return {
      target,
      condition: {
        at: parseAttributeString(attrstr),
        op: parseOpString(opstr),
        par: parseInt(parstr, 10)
      }
    };
  };

  const parseRulesString = (s) => {
    const ruleStrings = s.split(',');
    const last = ruleStrings.pop();
    const rules = ruleStrings.map(parseRuleString);
    rules.push({
      target: last,
      condition: {
        op: OP.always
      }
    });
    return rules;
  };

  const parseWorkflowLine = (s) => {
    const { name, rulesString } = s.match(/^(?<name>\w+)\{(?<rulesString>.*)\}$/).groups;
    const rules = parseRulesString(rulesString);
    return { name, rules };
  };

  const parseMaterialsString = (s) => s.slice(1).slice(0, -1).split(',').map((p) => {
    const [n, vstr] = p.split('=');
    return { [n]: parseInt(vstr, 10) };
  }).reduce((o, q) => ({ ...o, ...q }), {});

  const invertOp = (op) => {
    switch(op) {
      case OP.always: return OP.never;
      case OP.never: return OP.always;
      case OP.lt: return OP.gte;
      case OP.gt: return OP.lte;
      case OP.gte: return OP.lt;
      case OP.lte: return OP.gte;
      default: throw `cannot invert operation '${op}'`;
    }
  };

  const invertCondition = ({ at, op, par }) => ({ at, op: invertOp(op), par });

  const flattenRules = (rules) => {
    let cs = [];
    const o = {};
    for (const { target, condition } of rules) {
      if (!(target in o)) {
        o[target] = [];
      }
      o[target].push([...cs, condition]);
      cs.push(invertCondition(condition));
    }
    return o;
  };

  const parseInput = (s) => {
    const [workflowString, materialsString] = s.split('\n\n');
    const materials = materialsString.split('\n').map(parseMaterialsString);
    const workflowLines = workflowString.split('\n').map(parseWorkflowLine);
    const workflow = workflowLines.reduce((o, { name, rules }) => ({ ...o, [name]: rules }), {});

    const withFlatRules = {};

    for (const [name, rules] of Object.entries(workflow)) {
      withFlatRules[name] = flattenRules(rules);
    }

    return { workflow: withFlatRules, materials };
  };

  const applies = ({ op, at, par }, m) => {
    if (op === OP.always) {
      return true;
    }

    if (op === OP.never) {
      return false;
    }

    if (op === OP.lt) {
      return m[at] < par;
    }

    if (op === OP.gt) {
      return m[at] > par;
    }

    if (op === OP.lte) {
      return m[at] <= par;
    }

    if (op === OP.gte) {
      return m[at] >= par;
    }

    throw 'oh noes';
  };

  const next = (m, d) => {
    for (const [target, os] of Object.entries(d)) {
      for (const cs of os) {
        if (cs.reduce((b, c) => b && applies(c, m), true)) {
          return target;
        }
      }
    }

    throw 'oh noes';
  };

  const test = (m, flow, start = 'in') =>  {
    let p = start;

    while (true) {
      p = next(m, flow[p]);

      if (p === 'R') {
        return false;
      }

      if (p === 'A') {
        return true;
      }
    }
  };

  const sum = (m) => Object.values(m).reduce((a, b) => a + b);

  const count = (workflow, materials) => materials.filter((material) => test(material, workflow)).reduce((n, material) => n + sum(material), 0);

  const flattenStep = (workflow, start = 'in') => {
    const res = {};

    for (const [target, os] of Object.entries(workflow[start])) {
      if (['A', 'R'].includes(target)) {
        if (!(target in res)) {
          res[target] = [];
        }
        res[target].push(...os);
      } else {
        for (const [deepTarget, ps] of Object.entries(workflow[target])) {
          if (!(deepTarget in res)) {
            res[deepTarget] = [];
          }

          for (const cs of os) {
            for(const ds of ps) {
              res[deepTarget].push([...cs, ...ds]);
            }
          }
        }
      }
    }

    return { ...workflow, [start]: res };
  }

  const flatten = (workflow, start = 'in') => {
    let w = workflow;
    while(!Object.keys(w[start]).reduce((b, k) => b && ['R', 'A'].includes(k), true)) {
      w = flattenStep(w, start);
    }
    return { [start]: w[start] };
  }

  const assertEquivalent = (materials, w1, w2) => {
    if (count(w1, materials) !== count(w2, materials)) {
      throw 'not equivalent';
    }
  }

  const { workflow, materials } = parseInput(input);

  const flat = flatten(workflow);

  assertEquivalent(materials, workflow, flat);

  const applyCondition = ({ op, at, par }, {
    x: { l: xl, r: xr },
    m: { l: ml, r: mr },
    a: { l: al, r: ar },
    s: { l: sl, r: sr }
  }) => {
    const res = {
      x: { l: xl, r: xr },
      m: { l: ml, r: mr },
      a: { l: al, r: ar },
      s: { l: sl, r: sr }
    };

    if (op === OP.always) {
      return res;
    }

    if (op === OP.never) {
      throw 'wa';
    }

    if (op === OP.lt) {
      res[at].r = Math.min(par - 1, res[at].r);
    }

    if (op === OP.gt) {
      res[at].l = Math.max(par + 1, res[at].l);
    }

    if (op === OP.lte) {
      res[at].r = Math.min(par, res[at].r);
    }

    if (op === OP.gte) {
      res[at].l = Math.max(par, res[at].l);
    }

    return res;
  };

  const range = (cs) => {
    const min = 1;
    const max = 4000;

    let m = {
      x: { l: min, r: max },
      m: { l: min, r: max },
      a: { l: min, r: max },
      s: { l: min, r: max }
    };

    for (const c of cs) {
      m = applyCondition(c, m);
    }

    return m;
  };

  const ranges = flat.in.A.map(range);

  const values = ranges.map((m) => Object.values(m).map(({ l, r }) => r - l + 1).reduce((n, v) => n * v, 1));

  const n = values.reduce((a, b) => a + b);

  console.log(n);

  // 136661579897555

  return n;
}
