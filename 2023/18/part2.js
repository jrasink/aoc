const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const DIRECTION = {
  R: 'R',
  L: 'L',
  U: 'U',
  D: 'D'
};

const parseDirection = (s) => {
  switch(s) {
    case '0':
      return DIRECTION.R;
    case '1':
      return DIRECTION.D;
    case '2':
      return DIRECTION.L;
    case '3':
      return DIRECTION.U;
  }
}

const parseLine = (s) => {
  const [dataString] = s.split(' ').slice(2);
  const { dirstr, lenhex } = dataString.match(/^\(#(?<lenhex>\w{5})(?<dirstr>\w{1})\)$/).groups;
  const len = parseInt(lenhex, 16);
  const dir = parseDirection(dirstr);
  return { dir, len };
}

const parseInput = (s) => s.split('\n').map(parseLine);

const next = ({ x, y }, { dir, len }) => {
  let from, to;

  switch(dir) {
    case DIRECTION.R:
      from = { x: x + 1, y };
      to = { x: x + len, y };
      break;
    case DIRECTION.L:
      from = { x: x - 1, y };
      to = { x: x - len, y };
      break;
    case DIRECTION.U:
      from = { x, y: y - 1 };
      to = { x, y: y - len };
      break;
    case DIRECTION.D:
      from = { x, y: y + 1 };
      to = { x, y: y + len };
      break;
    default:
      throw 'waa';
  }

  return { from, to, dir, len };
};

const bounds = (lines) => {
  const ps = lines.reduce((ps, { from, to }) => [...ps, from, to], []);

  const xs = ps.map(({ x }) => x);
  const xl = xs.reduce((a, b) => a < b ? a : b);
  const xr = xs.reduce((a, b) => a > b ? a : b);

  const ys = ps.map(({ y }) => y);
  const yl = ys.reduce((a, b) => a < b ? a : b);
  const yr = ys.reduce((a, b) => a > b ? a : b);

  return { xs: [xl, xr], ys: [yl, yr] };
}

const walk = (pos, instructions) => {
  const lines = [];
  let p = pos;

  for (const instruction of instructions) {
    const line = next(p, instruction);
    lines.push(line);
    p = line.to;
    last = instruction;
  }

  for (let i = 0; i < lines.length; i++) {
    lines[i].open = (lines[i].dir == DIRECTION.U) || (lines[(i + 1) % lines.length].dir == DIRECTION.U);
    lines[i].close = (lines[i].dir == DIRECTION.D) || (lines[(i + 1) % lines.length].dir == DIRECTION.D);
    lines[i].left = Math.min(lines[i].from.x, lines[i].to.x);
    lines[i].right = Math.max(lines[i].from.x, lines[i].to.x);
    lines[i].width = 1 + lines[i].right - lines[i].left;
  }

  return lines;
};

const instructions = parseInput(input);

// console.log(instructions);

const lines = walk({ x: 0, y: 0 }, instructions);

// console.log(lines);

const { ys: [byl, byr] } = bounds(lines);

// console.log(bounds(lines));

const intersects = (y, lines) => lines.filter(({ from, to }) => ((y >= from.y) && (y <= to.y)) || ((y <= from.y) && (y >= to.y))).sort((p, q) => p.left - q.left);

let n = 0;

for (let y = byl; y <= byr; y++) {
  if (((y - byl) % 1000000) == 0) {
    console.log(`processing ${Math.floor(10000 * (y - byl) / (byr - byl)) / 100} percent complete`);
  }

  const ls = intersects(y, lines);

  let v = 0;
  let p = null;

  for (let i = 0, m = ls.length; i < m; i++) {
    const { right, width, open, close } = ls[i];
    if (p === null) {
      v += width;

      if (open) {
        p = right;
      }
    } else if (close) {
      v += right - p;
      p = null;
    }
  }

  if (p !== null) {
    throw 'wut';
  }

  n += v;
}

console.log(n);

// 88007104020978
