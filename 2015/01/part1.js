const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const lines = input.split('\n');

const val = (c) => {
  switch (c) {
    case '(':
      return 1;
    case ')':
      return -1;
    default:
      throw new Error(`waa: '${c}'`);
  }
}

for (const line of lines) {
  const f = line.split('').reduce((f, c) => f + val(c), 0);
  console.log(f);
}

// 74
