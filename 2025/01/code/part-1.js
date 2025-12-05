export default (input) => {
  const rs = input.split('\n').map((s) => ({ d: s.slice(0, 1) === 'L' ? -1 : 1, l: parseInt(s.slice(1), 10) }));

  let p = 50;
  let z = 0;

  for (const { d, l } of rs) {
    p = (100 + p + d * l) % 100;
    if (p === 0) {
      z += 1;
    }
  }

  return z;
}
