export default (input) => {
  const positions = input.split('\n').map((line) => line.split(',').map((s) => parseInt(s, 10)));

  const Direction = { L: 0, R: 1, U: 2, D: 3 };

  const next = (i, n) => (i + n + positions.length) % positions.length;

  const direction = (i) => {
    const j = next(i, 1);

    const dx = positions[j][0] - positions[i][0];
    const dy = positions[j][1] - positions[i][1];

    if (dx > 0) {
      return Direction.R;
    }

    if (dx < 0) {
      return Direction.L;
    }

    if (dy > 0) {
      return Direction.D;
    }

    return Direction.U;
  }

  const exclusion = (i) => {
    const n = next(i, 1);
    const p = next(i, -1);

    switch (direction(i)) {
      case Direction.L:
        return [
          [positions[i][0] + (direction(p) === Direction.D ? 1 : 0) + (direction(p) === Direction.U ? -1 : 0), positions[i][1] + 1],
          [positions[n][0] + (direction(n) === Direction.D ? 1 : 0) + (direction(n) === Direction.U ? -1 : 0), positions[n][1] + 1]
        ]
      case Direction.R:
        return [
          [positions[i][0] + (direction(p) === Direction.D ? 1 : 0) + (direction(p) === Direction.U ? -1 : 0), positions[i][1] - 1],
          [positions[n][0] + (direction(n) === Direction.D ? 1 : 0) + (direction(n) === Direction.U ? -1 : 0), positions[n][1] - 1]
        ]
      case Direction.U:
        return [
          [positions[i][0] - 1, positions[i][1] + (direction(p) === Direction.L ? 1 : 0) + (direction(p) === Direction.R ? -1 : 0)],
          [positions[n][0] - 1, positions[n][1] + (direction(n) === Direction.L ? 1 : 0) + (direction(n) === Direction.R ? -1 : 0)]
        ]
      case Direction.D:
        return [
          [positions[i][0] + 1, positions[i][1] + (direction(p) === Direction.L ? 1 : 0) + (direction(p) === Direction.R ? -1 : 0)],
          [positions[n][0] + 1, positions[n][1] + (direction(n) === Direction.L ? 1 : 0) + (direction(n) === Direction.R ? -1 : 0)]
        ]
    }
  }

  const exclusions = positions.map((_, i) => exclusion(i));

  const intersects = (v, w) => {
    // borrowed from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function/15182022#15182022

    const [[x1, y1], [x2, y2]] = v;
    const [[x3, y3], [x4, y4]] = w;

    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    if (x1 >= x2) {
      if (!(x2 <= x && x <= x1)) {
        return false;
      }
    } else {
      if (!(x1 <= x && x <= x2)) {
        return false;
      }
    }

    if (y1 >= y2) {
      if (!(y2 <= y && y <= y1)) {
        return false;
      }
    } else {
      if (!(y1 <= y && y <= y2)) {
        return false;
      }
    }

    if (x3 >= x4) {
      if (!(x4 <= x && x <= x3)) {
        return false;
      }
    } else {
      if (!(x3 <= x && x <= x4)) {
        return false;
      }
    }

    if (y3 >= y4) {
      if (!(y4 <= y && y <= y3)) {
        return false;
      }
    } else {
      if (!(y3 <= y && y <= y4)) {
        return false;
      }
    }

    return true;
  }

  const excluded = (i, j) => {
    const [x1, y1] = positions[i];
    const [x2, y2] = positions[j];

    const test = [
      [[x1, y1], [x2, y1]],
      [[x2, y1], [x2, y2]],
      [[x2, y2], [x1, y2]],
      [[x1, y2], [x1, y1]]
    ];

    for (const v of test) {
      for (const w of exclusions) {
        if (intersects(v, w)) {
          return true;
        }
      }
    }

    return false;
  }

  const area = ([ax, ay], [bx, by]) => (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1);

  let z = 0;

  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (!excluded(i, j)) {
        const a = area(positions[i], positions[j]);
        if (a > z) {
          z = a;
        }
      }
    }
  }

  return z;
}
