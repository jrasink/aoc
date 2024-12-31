export default (input) => {
  const parseInput = (s) => {
    const [timeString, distanceString] = s.split('\n');

    const time = parseInt(timeString.replace(/\s+/g, ' ').split(' ').slice(1).join(''), 10);
    const distance = parseInt(distanceString.replace(/\s+/g, ' ').split(' ').slice(1).join(''));

    return {
      time, distance
    };
  }

  const solveGame = ({ time, distance }) => {
    const d = (time * time) - 4 * distance;
    const s = Math.sqrt(d);
    const [lo, hi] = [s, -s].map((n) => (time + n) / 2).sort((a, b) => a - b);
    return 1 + Math.floor(hi) - Math.ceil(lo);
  }

  const game = parseInput(input);

  const win = solveGame(game);

  console.log(win);

  return win;
}
