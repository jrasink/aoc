const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const getDimensions = (s) => {
  const lines = s.split('\n');
  const [line] = lines;
  return { cols: line.length, rows: lines.length };
}

const parseInput = (s) => {
  const { cols, rows } = getDimensions(s);
  const map = s.replace(/\s+/g, '');
  return {
    map,
    cols,
    rows
  };
}

const draw = ({ map, cols }) => {
  const s = [];
  for (let i = 0, m = map.length; i < m; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    if (i > 0 && col === 0) {
      s.push('\n');
    }
    s.push(map[i]);
  }
  return s.join('');
}

const getCols = ({ cols, rows }) => {
  const rs = [];
  for (let i = 0; i < cols; i++) {
    const col = [];
    rs.push(col);
    for (let k = 0; k < rows; k++) {
      col.push(i + k * cols);
    }
  }
  return rs;
};

const getRows = ({ cols, rows }) => {
  const rs = [];
  for (let i = 0; i < rows; i++) {
    const col = [];
    rs.push(col);
    for (let k = 0; k < cols; k++) {
      col.push(k + i * cols);
    }
  }
  return rs;
};

const isEmpty = ({ map }, set) => set.reduce((b, r) => b && map[r] === '.', true);
const getEmptyIndexes = (sky, set) => set.reduce((es, xs, i) => isEmpty(sky, xs) ? [...es, i] : es, []);

const insertColAt = ({ map, cols, rows }, col) => {
  const s = map.split('');

  const rs = [];
  for (let i = 0; i < rows; i++) {
    rs.push(s.splice(0, cols));
  }

  for (r of rs) {
    r.splice(col, 0, '.');
  }

  const w = rs.map((r) => r.join('')).join('');

  return { map: w, cols: cols + 1, rows };
}

const insertRowAt = ({ map, cols, rows }, col) => {
  const s = map.split('');

  const rs = [];
  for (let i = 0; i < rows; i++) {
    rs.push(s.splice(0, cols));
  }

  rs.splice(col, 0, '.'.repeat(cols).split(''));

  console.log(rs)

  const w = rs.map((r) => r.join('')).join('');

  return { map: w, cols, rows: rows + 1 };
}

const findGalaxyPositions = ({ map }) =>  map.split('').reduce((ps, c, i) => c == '#' ? [...ps, i] : ps, []);

const getPairs = (xs) => {
  const pairs = [];
  for (let i = 0, m = xs.length; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      pairs.push([xs[i], xs[j]]);
    }
  }
  return pairs;
}

const getDistance = ({ map, cols }, i, j) => {
  const dy = Math.abs(Math.floor(i / cols) - Math.floor(j / cols));
  const dx = Math.abs(i % cols - j % cols);
  return dy + dx;
}

let sky = parseInput(input);

console.log('Initial sky');
console.log(draw(sky));

const rows = getRows(sky);
const cols = getCols(sky);

const emptyCols = getEmptyIndexes(sky, cols);
const emptyRows = getEmptyIndexes(sky, rows);

for (let i = 0, m = emptyCols.length; i < m; i++) {
  sky = insertColAt(sky, emptyCols[i] + i);
}

for (let i = 0, m = emptyRows.length; i < m; i++) {
  sky = insertRowAt(sky, emptyRows[i] + i);
}

console.log('New sky');
console.log(draw(sky));

const galaxies = findGalaxyPositions(sky);

console.log(galaxies);

const pairs = getPairs(galaxies);

console.log(pairs);

const distances = pairs.map(([i, j]) => getDistance(sky, i, j));

console.log(distances);

const sum = distances.reduce((a, b) => a + b);

console.log(sum);
