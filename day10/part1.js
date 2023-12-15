const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const getDimensions = (s) => {
  const lines = input.split('\n');
  const [line] = lines;
  return { width: line.length, height: lines.length };
}

const parseInput = (s) => {
  const { width, height } = getDimensions(s);
  const map = s.replace(/\s+/g, '').split('');
  const spos = map.indexOf('S');
  return { s: spos, map, width, height };
}

const walk = ({ map, width }, from, start) => {
  let last = from, current = start, next, a, b;

  const path = [];

  path.push(last);

  do {
    console.log(`last: position: ${current} (${current % width}, ${Math.floor(current/ width)}, current: ${current} (${current % width}, ${Math.floor(current/ width)}), pipe: ${map[current]}`);

    if (current < 0 || current >= map.length) {
      return null;
    }

    path.push(current);

    switch(map[current]) {
      case 'S':
        return path; // found a loop \o/
      case '.':
        return null; // failed to find a loop /o\
      case '|':
        a = current - width;
        b = current + width;
        break;
      case '-':
        a = current - 1;
        b = current + 1;
        break;
      case 'L':
        a = current - width;
        b = current + 1;
        break;
      case 'J':
        a = current - width;
        b = current - 1;
        break;
      case '7':
        a = current - 1;
        b = current + width;
        break;
      case 'F':
        a = current + 1;
        b = current + width;
        break;
    }

    if (a == last) {
      next = b;
    } else if (b == last) {
      next = a;
    } else {
      return null;
    }

    last = current;
    current = next;
  } while(true);
};

const getNeighbours = ({ width }, i) => {
  return [
    i - 1,
    i + 1,
    i - width - 1,
    i - width,
    i - width + 1,
    i + width - 1,
    i + width,
    i + width + 1
  ];
};

const board = parseInput(input);

console.log(board);

const ns = getNeighbours(board, board.s);

// console.log(ns);

const ws = ns.map((n) => walk(board, board.s, n));

// console.log(ws);

const path = ws.filter((a) => a != null).shift();

console.log(path);

const steps = Math.floor(path.length / 2);

const i = path[steps];

console.log(board.map[i]);

console.log(i);

console.log(steps);
