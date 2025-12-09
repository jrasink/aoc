export default (input) => {
  const positions = input.split('\n').map((line) => line.split(',').map((s) => parseInt(s, 10)));

  const area = ([ax, ay], [bx, by]) => (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1);

  let z = 0;

  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = area(positions[i], positions[j]);
      if (a > z) {
        z = a;
      }
    }
  }

  return z;
}
