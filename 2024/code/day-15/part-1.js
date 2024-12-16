export default (input) => {
  const Symbol = {
    robot: '@',
    wall: '#',
    box: 'O',
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

  const width = cells[0].length;
  const height = cells.length;

  const walls = [...Array(width * height)].map(() => false);
  const boxes = [...Array(width * height)].map(() => false);

  let robot;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const symbol = cells[y][x];

      const index = width * y + x;

      if (symbol === Symbol.wall) {
        walls[index] = true;
      }

      if (symbol === Symbol.box) {
        boxes[index] = true;
      }

      if (symbol === Symbol.robot) {
        robot = index;
      }
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
      return Symbol.box;
    }

    return Symbol.free;
  };

  const offset = [-width, width, -1, 1];

  const loose = (index, instruction) => {
    if (walls[index]) {
      return false;
    }

    if (boxes[index]) {
      const n = index + offset[instruction];
      return loose(n, instruction);
    }

    return true;
  };

  const push = (index, instruction) => {
    if (boxes[index]) {
      const n = index + offset[instruction];
      push(n, instruction);
      boxes[n] = true;
      boxes[index] = false;
    }
  }

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
