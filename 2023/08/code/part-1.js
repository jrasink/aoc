export default (input) => {
  const from = 'AAA';
  const to = 'ZZZ';

  const getDirection = (s) => ({ 'L': 0, 'R': 1 }[s]);

  const parseNode = (s) => {
    const { id, left, right } = s.match(/^(?<id>\w+) = \((?<left>\w+), (?<right>\w+)\)$/).groups;
    return { id, nodes: [left, right] };
  };

  const parseInput = (s) => {
    const [seqString, _empty, ...nodeStrings] = s.split('\n');
    const seq = seqString.split('').map(getDirection);
    const map = nodeStrings.map(parseNode).reduce((map, { id, nodes }) => ({ ...map, [id]: nodes }), {});
    return { seq, map };
  }

  const walk = (map, seq) => {
    let pos = from;
    let step = 0;

    while (pos != to) {
      const d = seq[step % seq.length];
      const next = map[pos][d];
      // console.log(`step: ${step}, pos: ${pos}, dir: ${d}, map: ${map[pos]}, next: ${next}`);
      step += 1;
      pos = next;
    }

    return step;
  }

  const { seq, map } = parseInput(input);
  const steps = walk(map, seq);

  console.log(steps);

  return steps;
}
