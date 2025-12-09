export default (input) => {
  const positions = input.split('\n').map((line) => line.split(',').map((s) => parseInt(s, 10)));

  const distance = ([ax, ay, az], [bx, by, bz]) => Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);

  const pairs = [];

  for (let from = 0; from < positions.length - 1; from++) {
    for (let to = from + 1; to < positions.length; to++) {
      pairs.push({ from, to, distance: distance(positions[from], positions[to]) });
    }
  }

  const connections = pairs.sort((a, b) => a.distance - b.distance).slice(0, positions.length === 20 ? 10 : 1000).map(({ from, to }) => ({ from, to }));

  const circuits = positions.map((_, i) => i);

  for (const { from, to } of connections) {
    const move = circuits[to];

    for (let i = 0; i < circuits.length; i++) {
      if (circuits[i] === move) {
        circuits[i] = circuits[from];
      }
    }
  }

  const sizes = circuits.map(() => 0);

  for (const c of circuits) {
    sizes[c] += 1;
  }

  return sizes.filter((a) => a > 0).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b);
}
