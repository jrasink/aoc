export default (input) => {
  const is = input.match(/mul\((\d+),(\d+)\)/g);

  const ms = is.map((i) => i.match(/(\d+)/g).map((s) => parseInt(s, 10)));

  const rs = ms.map((xs) => xs.reduce((n, a) => n * a, 1));

  const result = rs.reduce((n, a) => n + a, 0);

  return result;
}

// Running year 2024, day 3, part 1 with real input (size 17699)
// ---
// Elapsed: 1.132ms, result: 164730528
