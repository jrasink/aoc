export default (input) => {
  const program = input.split('\n\n').pop().split(': ').pop().split(',').map((s) => parseInt(s, 10));
  // Program: 2,4, 1,2, 7,5, 1,7, 4,4, 0,3, 5,5, 3,0

  // 2,4 -- bst [a]  -- b = a & 7
  // 1,2 -- bxl 2    -- b = b ^ 2
  // 7,5 -- cdv [b]  -- c = a >> b
  // 1,7 -- bxl 7    -- b = b ^ 7
  // 4,4 -- bxc -    -- b = b ^ c
  // 0,3 -- adv 3    -- a = a >> 3
  // 5,5 -- out [b]  -- output b
  // 3,0 -- jnz 0    -- a > 0 ? repeat from start : terminate

  // so:
  // - output ((((a & 7) ^ 2) ^ 7) ^ (a >> ((a & 7) ^ 2))) & 7
  // - adv a >> 3
  // - if a is not 0 repeat

  // - the final output only depends on the leftmost group of 3 bits
  // - we can determine these bits given only the output
  // - moving to each previous output, all the bits we need to determine the next group have been determined previously
  // - sometimes there will be more than one option for the three bits
  // - since we need the lowest result, use depth first search starting with the lowest values

  const find = (a, output) => {
    const rs = [];
    for (let n = 0n; n < 8n; n++) {
      const t = (a << 3n) + n;
      if ((((((t & 7n) ^ 2n) ^ 7n) ^ (t >> ((t & 7n) ^ 2n))) & 7n) === BigInt(output)) {
        rs.push(t);
      }
    }
    return rs;
  };

  const solve = (target, current = 0n) => {
    if (!target.length) {
      return current;
    }

    const output = target.slice(-1)[0];

    const options = find(current, output);

    for (const option of options) {
      const t = solve(target.slice(0, -1), option);

      if (t !== null) {
        return t;
      }
    }

    return null;
  }

  const result = Number(solve(program));

  return result;
}
