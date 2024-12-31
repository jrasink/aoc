export default (input) => {
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
    return { s: spos, map, width, height, length: width * height };
  }

  const walk = ({ s, map, width }, start) => {
    let last = s, current = start, next, a, b;

    const path = [];

    path.push(last);

    do {
      // console.log(`last: position: ${current} (${current % width}, ${Math.floor(current/ width)}, current: ${current} (${current % width}, ${Math.floor(current/ width)}), pipe: ${map[current]}`);

      if (current < 0 || current >= map.length) {
        return null;
      }

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

      path.push(current);

      last = current;
      current = next;
    } while(true);
  };

  const inferShape = ({ width }, current, prev, next) => {
    const xs = [prev, next];

    if (xs.includes(current - width) && xs.includes(current + width)) {
      return '|';
    }

    if (xs.includes(current - 1) && xs.includes(current + 1)) {
      return '-';
    }

    if (xs.includes(current - width) && xs.includes(current + 1)) {
      return 'L';
    }

    if (xs.includes(current - width) && xs.includes(current - 1)) {
      return 'J';
    }

    if (xs.includes(current - 1) && xs.includes(current + width)) {
      return '7';
    }

    if (xs.includes(current + 1) && xs.includes(current + width)) {
      return 'F';
    }

    throw 'impossible to infer shape';
  }

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

  const getPathSituations = ({ map, width }, path) => {
    const sits = [];

    for (let i = 0, m = path.length; i < m; i++) {
      const current = path[i];
      const prev = path[(i + path.length - 1) % path.length];

      let a, b, left, right, pipe;

      const shape = map[current];

      switch(shape) {
        case '|':
          a = current - width;
          b = current + width;

          pipe = [a, b];
          left = [current - 1, current - width - 1, current + width - 1].sort();
          right = [current + 1, current - width + 1, current + width + 1].sort();

          if (b == prev) {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: left,
              right: right
            });
          } else {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: right,
              right: left
            });
          }
          break;
        case '-':
          a = current + 1;
          b = current - 1;

          pipe = [a, b];
          left = [current - width - 1, current - width, current - width + 1].sort();
          right = [current + width - 1, current + width, current + width + 1].sort();

          if (b == prev) {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: left,
              right: right
            });
          } else {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: right,
              right: left
            });
          }
          break;
        case 'L':
          a = current - width;
          b = current + 1;

          pipe = [a, b];
          left = [current - 1, current - width - 1, current + width - 1, current + width, current + width, current + width + 1].sort();
          right = [current - width + 1].sort();

          if (b == prev) {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: left,
              right: right
            });
          } else {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: right,
              right: left
            });
          }
          break;
        case 'J':
          a = current - width;
          b = current - 1;

          pipe = [a, b];
          left = [current - width - 1].sort();
          right = [current - width + 1, current + 1, current + width + 1, current + width, current + width - 1].sort();

          if (b == prev) {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: left,
              right: right
            });
          } else {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: right,
              right: left
            });
          }
          break;
        case '7':
          a = current - 1;
          b = current + width;

          pipe = [a, b];
          left = [current - width - 1, current - width, current - width + 1, current + 1, current + width + 1].sort();
          right = [current + width - 1].sort();

          if (a == prev) {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: left,
              right: right
            });
          } else {
            sits.push({
              pos: current,
              shape: shape,
              pipe: pipe,
              left: right,
              right: left
            });
          }
          break;
        case 'F':
          a = current + 1;
          b = current + width;

          pipe = [a, b];
          left = [current + width - 1, current - 1, current - width - 1, current - width, current - width + 1].sort();
          right = [current + width + 1].sort();

          if (b == prev) {
            sits.push({
              pos: current,
              shape: shape,
              prev,
              pipe: pipe,
              left: left,
              right: right
            });
          } else {
            sits.push({
              pos: current,
              shape: shape,
              prev,
              pipe: pipe,
              left: right,
              right: left
            });
          }
          break;
      }
    }

    return sits;
  }

  const drawPipes = (board) => {
    const s = [];
    for (const i in board.map) {
      if (i > 0 && (i % board.width == 0)) {
        s.push('\n');
      }
      s.push(board.map[i]);
    }
    return s.join('');
  }

  const drawPipesWithResult = (board, loop, inside, outside) => {
    const s = [];

    for (let i = 0, m = board.map.length; i < m; i++) {
      if (i > 0 && (i % board.width == 0)) {
        s.push('\n');
      }

      if (loop.includes(i)) {
        s.push(board.map[i]);
      } else if (inside.includes(i)) {
        s.push('X');
      } else if (outside.includes(i)) {
        s.push('O');
      } else {
        // throw `unexpected position not in any set: ${i}`;
        s.push('.');
      }
    }
    return s.join('');
  }

  const runes = {
    'F': "┌",
    'J': "┘",
    'L': "└",
    '|': "│",
    '-': "─",
    '7': "┐",
    'X': '.',
    'O': ' ',
    '\n': '\n'
  }

  const mapRunes = (s) => s.split('').map((c) => runes[c]).join('');

  const drawPositions = (board) => {
    const s = [''];
    for (const i in board.map) {
      if (i > 0 && (i % board.width == 0)) {
        s.push('\n');
      }
      s.push(`  ${i}`.slice(-3));
    }
    return s.join(' ');
  }

  const expandSet = (board, path, set) => {
    let ts = [...set];
    let ls = set, ns = [];
    while(true) {
      for (const x of ls) {
        for (const y of getNeighbours(board, x)) {
          // note: we're wrapping around the sides but that's probably OK
          if (!ts.includes(y) && !ns.includes(y) && !path.includes(y) && y >= 0 && y < board.map.length) {
            ns.push(y);
          }
        }
      }

      // console.log(`expanding: new items found ${ns.length}`);

      if (!ns.length) {
        break;
      }

      ts.push(...ns);

      // console.log(ts);

      ls = ns;
      ns = [];
    }

    return ts;
  }

  const board = parseInput(input);

  console.log(`input board:`);

  console.log(drawPipes(board));

  const ns = getNeighbours(board, board.s);

  const ws = ns.map((n) => walk(board, n));

  const loop = ws.filter((a) => a != null).shift();

  const shape = inferShape(board, board.s, loop[1], loop[loop.length - 1]);

  // console.log(`missing shape at S is ${shape}`);

  board.map[board.s] = shape;

  console.log(`corrected board:`);

  console.log(drawPipes(board));

  // console.log(`index map:`);

  // console.log(drawPositions(board));

  // console.log(`found loop:`);

  // console.log(`[${loop.join(', ')}]`);

  const situations = getPathSituations(board, loop);

  // console.log(`situations at each node:`);

  // console.log(situations);

  const lefts = situations.reduce((left, sit) => {
    for (const x of sit.left) {
      if (!(left.includes(x) || loop.includes(x))) {
        left.push(x);
      }
    }
    return left;
  }, []);

  const rights = situations.reduce((right, sit) => {
    for (const x of sit.right) {
      if (!(right.includes(x) || loop.includes(x))) {
        right.push(x);
      }
    }
    return right;
  }, []);

  const expandedRights = expandSet(board, loop, rights);
  const expandedLefts = expandSet(board, loop, lefts);

  const knownOutsidePosition = 0;

  let inside, outside;

  if (expandedLefts.includes(knownOutsidePosition)) {
    outside = expandedLefts;
    inside = expandedRights;
  }

  if (expandedRights.includes(knownOutsidePosition)) {
    outside = expandedRights;
    inside = expandedLefts;
  }

  // console.log(outside);
  // console.log(inside);

  console.log(`board with dispositions:`);

  console.log(mapRunes(drawPipesWithResult(board, loop, inside, outside)));
  // console.log(drawPipesWithResult(board, loop, inside, outside));

  console.log(`loop interior size:`);

  console.log(inside.length);

  // 423

  return inside.length;
}
