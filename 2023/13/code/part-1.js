export default (input) => {
  const range = (n) => [...Array(n)].map((_, i) => i);

  const parsePatternString = (s) => {
    // todo use bit shifting
    // # 1, . 0, rows and cols are represented by numbers

    const rs = s.split('\n');
    const width = rs[0].length;
    const height = rs.length;
    const matrix = rs.join('');

    const pos = (x, y) => x + width * y;
    const cell = (x, y) => matrix[pos(x, y)];
    const row = (y) => range(width).map((x) => cell(x, y)).join('');
    const col = (x) => range(height).map((y) => cell(x, y)).join('');

    const rows = () => range(height).map((y) => row(y));
    const cols = () => range(width).map((x) => col(x));

    const draw = () => rows().join('\n');

    return {
      matrix,
      width,
      pos,
      cell,
      row,
      col,
      rows,
      cols,
      draw
    };
  };

  const compare = (xs, i) => {
    for (let k = 0, w = Math.min(i, xs.length - i - 2) + 1; k < w; k++) {
      if (xs[i - k] != xs[i + k + 1]) {
        // console.log(`checking row ${i}: ${i - k} vs ${i + 1 + k}: ${xs[i - k]} == ${xs[i + 1 + k]}: no match`);
        return false;
      } else {
        // console.log(`checking row ${i}: ${i - k} vs ${i + 1 + k}: ${xs[i - k]} == ${xs[i + 1 + k]}: match`);
      }
    }

    // console.log(`checking ${i}: this is a mirror`);
    return true;
  }

  const find = (xs) => {
    for (let i = 0, m = xs.length - 1; i < m; i++) {
      if (compare(xs, i)) {
        return i;
      }
    }
    return null;
  };

  const reflect = (pattern) => {
    // console.log('reflecting');
    // console.log(pattern.draw());

    const rows = pattern.rows();
    const row = find(rows);
    if (row !== null) {
      // console.log(`found horizontal mirror after row ${row}`);
      return 100 * (row + 1);
    }

    const cols = pattern.cols();
    const col = find(cols);
    if (col !== null) {
      // console.log(`found vertical mirror after col ${col}`);
      return col + 1;
    }

    throw `no mirror found for pattern`;
  }

  const parseInput = (s) => s.split('\n\n').map(parsePatternString);

  const pattern = parseInput(input);

  const notes = pattern.map(reflect);

  const sum = notes.reduce((a, b) => a + b);

  console.log(sum);

  // 33195

  return sum;
}
