const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const parseRow = (s) => {
  const [row, groupString] = s.split(' ');
  const groups = groupString.split(',').map((s) => parseInt(s, 10));
  return { row, groups };
}

const parseInput = (s) => s.split('\n').map(parseRow);

const expand = (row) => {
  let xs = [''];

  for (let i = 0, m = row.length; i < m; i++) {
    const options = row[i] === '?' ? ['.', '#'] : [row[i]];
    const ys = [];
    for (const x of xs) {
      for (const option of options) {
        ys.push(`${x}${option}`);
      }
    }
    xs = ys;
  }

  return xs;
};

const profile = (row) => {
  const ls = [];
  let l = 0;

  for (let i = 0, m = row.length; i < m; i++) {
    if (row[i] === '#') {
      l += 1;
    } else if (l > 0) {
      ls.push(l);
      l = 0;
    }
  }

  if (l > 0) {
    ls.push(l);
  }

  return ls;
}

const match = (xs, ys) => {
  if (xs.length != ys.length) {
    return false;
  }
  if (xs.length === 0) {
    return true;
  }
  const [x, ...txs] = xs;
  const [y, ...tys] = ys;
  return (x === y) && match(txs, tys);
}

const arrangements = ({ row, groups }) => {
  const options = expand(row);
  const valid = options.filter((row) => match(profile(row), groups));
  return valid.length;
};

const data = parseInput(input);

console.log(data);

const a = data.map(arrangements).reduce((a, b) => a + b);

console.log(a);

// 7361
