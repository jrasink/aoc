export default (input) => {
  const is = input.match(/mul\((\d+),(\d+)\)/g);

  const ms = is.map((i) => i.match(/(\d+)/g).map((s) => parseInt(s, 10)));

  const rs = ms.map((xs) => xs.reduce((n, a) => n * a, 1));

  const result = rs.reduce((n, a) => n + a, 0);

  return result;
}
