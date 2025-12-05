export default (input) => {
  const [rangeInput, itemInput] = input.split('\n\n');

  const ranges = rangeInput.split('\n').map((s) => s.split('-').map((s) => parseInt(s, 10)));
  const items = itemInput.split('\n').map((s) => parseInt(s, 10));

  const fresh = (n, ranges) => {
    for (const [min, max] of ranges) {
      if (n >= min && n <= max) {
        return true;
      }
    }
    return false;
  }

  let z = 0;

  for (const n of items) {
    if (fresh(n, ranges)) {
      z += 1;
    }
  }

  return z;
}
