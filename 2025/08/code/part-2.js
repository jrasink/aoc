export default (input) => {
  const positions = input.split('\n').map((line) => line.split(',').map((s) => parseInt(s, 10)));

  const distance = ([ax, ay, az], [bx, by, bz]) => Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);

  const pairs = [];

  for (let from = 0; from < positions.length - 1; from++) {
    for (let to = from + 1; to < positions.length; to++) {
      pairs.push({ from, to, distance: distance(positions[from], positions[to]) });
    }
  }

  const connections = pairs.sort((a, b) => a.distance - b.distance).map(({ from, to }) => ({ from, to }));

  const circuits = positions.map((_, i) => i);

  for (const { from, to } of connections) {
    const move = circuits[to];

    let done = true;

    for (let i = 0; i < circuits.length; i++) {
      if (circuits[i] === move) {
        circuits[i] = circuits[from];
      }

      if (circuits[i] !== circuits[from]) {
        done = false;
      }
    }

    if (done) {
      return positions[from][0] * positions[to][0];
    }
  }
}
