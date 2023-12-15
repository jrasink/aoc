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

      vector.push({
        char,
        isNumber,
        isDot,
        isSymbol
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

const validateNumber = (number, matrix) => {
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
    if ((y in matrix) && (x in matrix[y]) && matrix[y][x].isSymbol) {
      // console.log(`number ${JSON.stringify(number)} valid, symbol at (${x}, ${y})`)
      console.log(`Number '${number.number}' (${number.length}) at (${position.x}, ${position.y}) YES, symbol '${matrix[y][x].char}' at (${x}, ${y})`);
      return true;
    }
  }

  console.log(`Number '${number.number}' at (${position.x}, ${position.y}) NO`);
  return false;
};

const input = fs.readFileSync('./actual-input').toString();
const matrix = inputToMatrix(input);
const numbers = findNumbers(matrix);

const valid = numbers.filter((number) => validateNumber(number, matrix));

const result = valid.map(({ number }) => number).reduce((a, b) => a + b, 0);

// console.log(valid);

console.log(result);




// const f = (input) => {
//   const xs = [];

//   const lines = input.split('\n');
//   for (const line of lines) {
//     for (const char of line) {
//       if (!(xs.includes(char))) {
//         xs.push(char);
//       }
//     }
//   }

//   console.log(xs);
// }

// f(input)
