export default (input) => {
  const parseNode = (s) => {
    const { id, L, R } = s.match(/^(?<id>\w+) = \((?<L>\w+), (?<R>\w+)\)$/).groups;
    return { id, L, R };
  };

  const parseInput = (s) => {
    const [seqString, _empty, ...nodeStrings] = s.split('\n');
    const seq = seqString.split('');
    const map = nodeStrings.map(parseNode).reduce((map, { id, L, R }) => ({ ...map, [id]: { L, R } }), {});
    return { seq, map };
  }

  const findLoops = (node, map, seq) => {
    // find where the path loops back to itself; return a list of indices of Z positions, the starting point of the loop and the length of the loop
    // this will allow us to generate infinite lists of Z positions and find combined patterns more easily

    // NOTE: a loopback is only when the combination of sequence index and position occurred before

    const path = [];
    let pos = node;
    let p;

    while (true) {
      const i = path.length % seq.length;
      const d = seq[i];

      p = pos + `00${i}`.slice(-3);

      if (path.includes(p)) {
        break;
      }

      path.push(p);

      pos = map[pos][d];
    }

    // turns out every loop includes just one Z position, which is at a position equal to the length of the repeated path section
    // this reduces the problem to finding least common multiples of these lengths
    // this also means we only need the length of each repeated section, we can discard the offset and the Z positions

    // NOTE: this is a special case of the problem! the problem is not solved here for other cases.
    // TODO: work out a general solution for one or more Z positions per loop and arbitrary loop length.

    return path.length - path.indexOf(p);
  };

  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => (a * b) / gcd(a, b);

  const { seq, map } = parseInput(input);

  const inits = Object.keys(map).filter((s) => s[2] === 'A');

  const loops = inits.map((node) => findLoops(node, map, seq));

  const n = loops.reduce((a, b) => lcm(a, b));

  console.log(n);

  return n;
}
