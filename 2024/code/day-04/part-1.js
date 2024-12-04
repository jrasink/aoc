export default (input) => {
  const C = {
    x: 'X',
    m: 'M',
    a: 'A',
    s: 'S'
  };

  const matrix = input.split('\n').map((s) => s.split(''));

  const isValidPosition = ([xi, yi]) => xi >= 0 && yi >= 0 && xi < matrix[0].length && yi < matrix.length;

  const get = ([xi, yi]) => matrix[yi][xi];
  const offset = ([xi, yi], [xd, yd], l) => [xi + xd * l, yi + yd * l];

  const findXs = () => {
    const ps = [];
    for (let yi = 0; yi < matrix.length; yi++) {
      for (let xi = 0; xi < matrix[0].length; xi++) {
        const p = [xi, yi];
        if (get(p) === C.x) {
          ps.push(p);
        }
      }
    }
    return ps;
  }

  const xps = findXs();

  const ds = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  const getCandidates = (p) => ds.map((d) => [1,2,3].map((l) => offset(p, d, l)).filter(isValidPosition)).filter((ps) => ps.length === 3);

  const testCandidate = ([a, b, c]) => get(a) === C.m && get(b) === C.a && get(c) === C.s;

  const cs = [].concat(...xps.map(getCandidates));

  const xmass = cs.filter(testCandidate);

  return xmass.length;
}
