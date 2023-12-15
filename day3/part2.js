const fs = require('fs');

const inputToMatrix = (input) => {
  const lines = input.split('\n');
  const matrix = [];

  for (const line of lines) {
    const vector = [];
    matrix.push(vector);
    for (const char of line) {
      const isNumber = !isNaN(parseInt(char, 10));
      const isDot = char === '.';
      const isSymbol = !(isNumber || isDot);
      const isGear = char === '*';

      vector.push({
        char,
        isNumber,
        isDot,
        isSymbol,
        isGear,
        adjacentNumbers: []
      });
    }
  }

  return matrix;
}

const findNumbers = (matrix) => {
  const numbers = [];

  let collect = null;

  for (let y = 0; y < matrix.length; y++) {
    const line = matrix[y];
    for (x = 0; x < line.length; x++) {
      const o = line[x];
      if (o.isNumber) {
        if (!collect) {
          collect = {
            position: { x, y },
            chars: []
          }
        }
        collect.chars.push(o.char);
      } else {
        if (collect) {
          const { position, chars } = collect;
          const number = {
            position,
            length: chars.length,
            number: parseInt(chars.join(''), 10)
          }
          numbers.push(number);
          collect = null;
        }
      }
    }

    if (collect) {
      const { position, chars } = collect;
      const number = {
        position,
        length: chars.length,
        number: parseInt(chars.join(''), 10)
      }
      numbers.push(number);
      collect = null;
    }
  }

  return numbers;
};

const registerNumber = (number, matrix) => {
  const { position, length } = number;

  const checkPositions = [];

  checkPositions.push({ y: position.y, x: position.x - 1 });
  checkPositions.push({ y: position.y, x: position.x + length });

  for (let x = (position.x - 1); x <= (position.x + length); x++) {
    checkPositions.push({ y: position.y - 1, x });
    checkPositions.push({ y: position.y + 1, x });
  }

  // console.log(`Checking number ${JSON.stringify(number.number)}`);
  // console.log(checkPositions);

  for (const { x, y } of checkPositions) {
    if ((y in matrix) && (x in matrix[y]) && matrix[y][x].isGear) {
      // console.log(`Number '${number.number}' (${number.length}) at (${position.x}, ${position.y}) YES, symbol '${matrix[y][x].char}' at (${x}, ${y})`);
      matrix[y][x].adjacentNumbers.push(number);
    }
  }
};

const input = fs.readFileSync('./actual-input').toString();
const matrix = inputToMatrix(input);
const numbers = findNumbers(matrix);

for (const number of numbers) {
  registerNumber(number, matrix);
}

let result = 0;

for (let y = 0; y < matrix.length; y++) {
  const line = matrix[y];
  for (x = 0; x < line.length; x++) {
    if (matrix[y][x].isGear) {
      if (matrix[y][x].adjacentNumbers.length === 2) {
        const product = matrix[y][x].adjacentNumbers.reduce((n, { number }) => n * number, 1);
        console.log(`Gear at ${x}, ${y} has product ${product}`);
        result += product;
      }
    }
  }
}

console.log(result);
