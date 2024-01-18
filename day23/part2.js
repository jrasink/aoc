const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const PATH = '.';

const FOREST = '#';

const SLOPE = {
  N: '^',
  E: '>',
  S: 'v',
  W: '<'
};

const stepOptions = ({ x, y }, s) => {
  switch(s) {
    case '#':
      return [];
    case '.':
      return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
    case '^':
      return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
    case '>':
      return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
    case 'v':
      return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
    case '<':
      return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
  }
}

const parseInput = (input) => {
  const cells = input.split('\n').map((s) => s.split(''));
  const map = [];

  const width = cells[0].length;
  const height = cells.length;

  const flatIndex = ({ x, y }) => (x + width * y);

  const start = flatIndex({ x: 1, y: 0 });
  const finish = flatIndex({ x: width - 2, y: height - 1 });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = cells[y][x];
      const i = flatIndex({ x, y });

      const next = stepOptions({ x, y }, cell).filter(({ x: x1, y: y1 }) => x1 >= 0 && x1 < width && y1 >= 0 && y1 < height && cells[y1][x1] !== '#').map(flatIndex);

      map[i] = {
        index: i,
        pos: { x, y },
        cell,
        isPath: cell === PATH,
        isForest: cell === FOREST,
        isSlope: Object.values(SLOPE).includes(cell),
        isStart: i === start,
        isFinish: i === finish,
        next,
        isNode: (next.length > 2) || [start, finish].includes(i)
      };
    }
  }

  return { map, width, height, start, finish };
};

const draw = ({ map, width }, path = []) => {
  const rows = [];

  for (const [i, { pos: { x, y }, cell, isNode, isStart, isFinish }] of Object.entries(map)) {
    if (!rows[y]) {
      rows[y] = [];
    }

    if (isStart) {
      rows[y][x] = 'S';
    } else if (isFinish) {
      rows[y][x] = 'F';
    } else if (isNode) {
      rows[y][x] = 'X';
    } else if (path.includes(y * width + x)) {
      rows[y][x] = 'O';
    } else {
      rows[y][x] = cell;
    }
  }

  return rows.map((row) => row.join('')).join('\n');
}

const world = parseInput(input);

const findNodes = (map) => map.filter(({ isNode }) => isNode);

const nodeWalk = (map, path) => {
  const pos = path[path.length - 1];
  const cell = map[pos];

  if (cell.isNode) {
    return { node: pos, dist: path.length - 1 };
  }

  const opts = cell.next.filter((p) => !path.includes(p));

  if (opts.length > 1) {
    throw 'wa';
  }

  if (opts.length === 0) {
    return null;
  }

  const [p] = opts;

  return nodeWalk(map, [...path, p]);
};

const createNodeMap = ({ map }) => findNodes(map).map((node) => ({
  node: node.index,
  next: node.next.map((p) => nodeWalk(map, [node.index, p])).filter((n) => n !== null)
})).reduce((o, n) => ({ ...o, [n.node]: n.next}), {});

const pathDistance = (path) => path.reduce((n, { dist }) => n + dist, 0);

const walk = (map, nodeMap, path) => {
  const { node } = path[path.length - 1];
  const cell = map[node];

  if (cell.isFinish) {
    return path;
  }

  const next = nodeMap[node].filter(({ node }) => !path.map(({ node }) => node).includes(node));

  if (next.length === 0) {
    return null;
  }

  const paths = next.map((n) => walk(map, nodeMap, [...path, n])).filter((path) => path !== null);

  if (paths.length === 0) {
    return null;
  }

  return paths.reduce((a, b) => pathDistance(a) > pathDistance(b) ? a : b);
};

// console.log(draw(world));

const nodeMap = createNodeMap(world);

const path = walk(world.map, nodeMap, [{ node: world.start, dist: 0 }]);

console.log(path);

const n = pathDistance(path);

console.log(n);

// 6598
