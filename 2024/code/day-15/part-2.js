export default (input) => {
  const Symbol = {
    robot: '@',
    wall: '#',
    box: 'O',
    boxLeft: '[',
    boxRight: ']',
    free: '.',
    left: '<',
    right: '>',
    up: '^',
    down: 'v'
  };

  const Instruction = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
  };

  const InstructionDictionary = {
    [Symbol.left]: Instruction.left,
    [Symbol.right]: Instruction.right,
    [Symbol.up]: Instruction.up,
    [Symbol.down]: Instruction.down
  };

  const [mapString, instructionsString] = input.split('\n\n');

  const instructions = instructionsString.split('\n').join('').split('').map((symbol) => InstructionDictionary[symbol]);

  const cells = mapString.split('\n').map((s) => s.split(''));

  const width = cells[0].length * 2;
  const height = cells.length;

  const walls = [...Array(width * height)].map(() => false);
  const boxes = [...Array(width * height)].map(() => false);

  let robot;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const symbol = cells[y][x];

      const l = width * y + 2 * x;
      const r = width * y + 2 * x + 1;

      if (symbol === Symbol.wall) {
        walls[l] = true;
        walls[r] = true;
      }

      if (symbol === Symbol.box) {
        boxes[l] = true;
      }

      if (symbol === Symbol.robot) {
        robot = l;
      }
    }
  }

  const offset = [-width, width, -1, 1];
  const block = [[-width, 1 - width], [width, 1 + width], [-1], [2]];

  const loose = (index, instruction) => {
    if (walls[index]) {
      return false;
    }

    for (const p of [index, index - 1].filter((p) => boxes[p])) {
      for (const b of block[instruction]) {
        if (!loose(p + b, instruction)) {
          return false;
        }
      }
    }

    return true;
  };

  const push = (index, instruction) => {
    const d = offset[instruction];

    for (const p of [index, index - 1].filter((p) => boxes[p])) {
      for (const b of block[instruction]) {
        push(p + b, instruction);
      }
      boxes[p + d] = true;
      boxes[p] = false;
    }
  }

  const charAt = (i) => {
    if (i === robot) {
      return Symbol.robot;
    }

    if (walls[i]) {
      return Symbol.wall;
    }

    if (boxes[i]) {
      return Symbol.boxLeft;
    }

    if (boxes[i-1]) {
      return Symbol.boxRight;
    }

    return Symbol.free;
  };

  const dump = () => console.log([...Array(height)].map((_, y) => [...Array(width)].map((_, x) => charAt(width * y + x)).join('')).join('\n'));

  const move = (instruction) => {
    // console.log(`Next: ${instruction}`);

    const index = robot + offset[instruction];

    if (!loose(index, instruction)) {
      return robot;
    }

    push(index, instruction);

    robot = index;

    // dump();
  }

  // console.log('Initial');
  // dump();

  while (instructions.length > 0) {
    move(instructions.shift());
  }

  const gps = (i) => 100 * Math.floor(i / width) + (i % width);

  const score = boxes.reduce((score, box, i) => box ? score + gps(i) : score, 0);

  return score;
}
