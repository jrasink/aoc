const fs = require('fs');

const input = fs.readFileSync('./actual-input').toString();
const lines = input.split('\n');

const findDigits = (inputString) => {
  targets = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
  };

  const results = [];

  for (const [word, value] of Object.entries(targets)) {
    const reg = new RegExp(word, 'g');
    let match;
    while ((match = reg.exec(inputString)) != null) {
      results.push({ value, index: match.index });
    }
  }

  const sorted = results.sort((a, b) => a.index - b.index);
  const values = sorted.map((o) => o.value);

  // console.log(`${inputString}: ${JSON.stringify(sorted)}`);

  return values;
}

const parseLine = (s) => {
  const numbers = findDigits(s);
  const result = 10 * numbers[0] + numbers[numbers.length - 1];
  console.log(`${result} < ${s}`);
  return result;
};

const values = lines.map(parseLine);
const sum = values.reduce((s, n) => s + n);

console.log('-- +')
console.log(sum);
