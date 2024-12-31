export default (input) => {
  const parseInput = (s) => {
    const [timeString, distanceString] = s.split('\n');

    const times = timeString.replace(/\s+/g, ' ').split(' ').slice(1).map((s) => parseInt(s, 10));
    const distances = distanceString.replace(/\s+/g, ' ').split(' ').slice(1).map((s) => parseInt(s, 10));

    const games = [];
    for (const i of Object.keys(times)) {
      games.push({
        time: times[i],
        distance: distances[i]
      });
    }

    return games;
  }

  const solveGame = ({ time, distance }) => {
    let w = 0;
    for (let t = 0; t < time; t++) {
      const v = t;
      const d = (time - t) * v;
      if (d > distance) {
        w++;
      }
    }
    return w;
  }

  const games = parseInput(input);

  const ws = games.map(solveGame);

  const p = ws.reduce((a, b) => a * b, 1);

  console.log(p);

  return p;
}
