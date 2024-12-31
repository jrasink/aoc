export default (input) => {

  const parseInput = (s) => s.split('\n').join('').split(',');

  const f = 17;
  const m = 256;

  const hash = (s) => s.split('').reduce((n, c) => ((n + c.charCodeAt(0)) * f) % m, 0);

  const ss = parseInput(input);

  const n = ss.map(hash).reduce((a, b) => a + b);

  console.log(n);

  return n;
}
