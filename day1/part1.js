const fs = require('fs');

const input = fs.readFileSync('./actual-input').toString();
const lines = input.split('\n');

const values = lines.map((s) => {
  const numbers = [];
  for (const c of s) {
    const n = parseInt(c);
    if (!isNaN(n)) {
      numbers.push(n);
    }
  }
  return 10 * numbers[0] + numbers[numbers.length - 1];
});

const sum = values.reduce((s, n) => s + n);

console.log(input);
console.log(lines);
console.log(values);
console.log(sum);
