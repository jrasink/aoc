const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const CATEGORY = {
  x: 'x',
  m: 'm',
  a: 'a',
  s: 's'
};

const OP = {
  always: '*',
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

const parseInput = (s) => {
  const [workflowsString, materialsString] = s.split('\n\n');
  const materials = materialsString.split('\n').map(parseMaterialsString);
  const workflowLines = workflowsString.split('\n').map(parseWorkflowLine);
  const workflows = workflowLines.reduce((o, { name, rules }) => ({ ...o, [name]: rules }), {});
  return { workflows, materials };
};

const applies = ({ op, at, par }, m) => {
  if (op === OP.always) {
    return true;
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

const next = (m, rules) => {
  for (const { condition, target } of rules) {
    if (applies(condition, m)) {
      return target;
    }
  }

  throw 'oh noes';
};

const test = (m, workflows) =>  {
  let w = 'in';

  while (true) {
    w = next(m, workflows[w]);

    if (w === 'R') {
      return false;
    }

    if (w === 'A') {
      return true;
    }
  }
};

const sum = (m) => Object.values(m).reduce((a, b) => a + b);

const { workflows, materials } = parseInput(input);

// console.log(JSON.stringify(workflows));

let n = 0;

for (const material of materials) {
  if (test(material, workflows)) {
    n += sum(material);
  }
}

console.log(n);

// 332145
