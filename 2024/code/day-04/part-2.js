export default (input) => {
  const C = {
    x: 'X',
    m: 'M',
    a: 'A',
    s: 'S'
  };

  const D = {
    ne: [1, -1],
    nw: [-1, -1],
    se: [1, 1],
    sw: [-1, 1]
  };

  const matrix = input.split('\n').map((s) => s.split(''));

  const get = ([xi, yi]) => matrix[yi][xi];
  const offset = ([xi, yi], [xd, yd], l = 1) => [xi + xd * l, yi + yd * l];

  const findInnerAs = () => {
    const ps = [];
    for (let yi = 1; yi < matrix.length - 1; yi++) {
      for (let xi = 1; xi < matrix[0].length - 1; xi++) {
        const p = [xi, yi];
        if (get(p) === C.a) {
          ps.push(p);
        }
      }
    }
    return ps;
  }

  const aps = findInnerAs();

  const isMas = (a, b) => get(a) === C.m && get(b) === C.s || get(a) === C.s && get(b) === C.m;
  const nesw = (p) => isMas(offset(p, D.ne), offset(p, D.sw));
  const nwse = (p) => isMas(offset(p, D.nw), offset(p, D.se));
  const xmass = aps.filter((p) => nesw(p) && nwse(p));

  return xmass.length;
}
