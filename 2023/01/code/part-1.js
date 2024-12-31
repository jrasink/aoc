export default (input) => {
  const lines = input.split('\n');

  const values = lines.map((s) => {
    const numbers = [];
    for (const c of s) {
      const n = parseInt(c);
      if (!isNaN(n)) {
        numbers.push(n);
      }
    }
    return 10 * numbers[0] + numbers[numbers.length - 1];
  });

  const sum = values.reduce((s, n) => s + n);

  return sum;
}
