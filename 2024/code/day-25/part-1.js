export default (input) => {
  const ms = input.split('\n\n').map((s) => s.split('\n').map((s) => s.split('').map((s) => s === '#' ? 1 : 0)));

  const keys = [];
  const locks = [];

  for (const m of ms) {
    const rs = [...Array(m[0].length)].map(() => 0);

    for (let y = 1; y < m.length - 1; y++) {
      for (let x = 0; x < m[y].length; x++) {
        rs[x] += m[y][x];
      }
    }

    if (m[0][0]) {
      locks.push(rs);
    } else {
      keys.push(rs);
    }
  }

  const test = (lock, key) => {
    for (let i = 0; i < key.length; i++) {
      if ((lock[i] + key[i]) > 5) {
        return false;
      }
    }
    return true;
  }

  let r = 0;

  for (const lock of locks) {
    for (const key of keys) {
      if (test(lock, key)) {
        r += 1;
      }
    }
  }

  return r;
}
