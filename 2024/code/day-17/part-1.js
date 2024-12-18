export default (input) => {
  const [registersString, programString] = input.split('\n\n');
  const [a, b, c] = registersString.split('\n').map((s) => parseInt(s.split(': ').pop(), 10));
  const register = { a, b, c };
  const program = programString.split(': ').pop().split(',').map((s) => parseInt(s, 10));

  const output = [];

  let pointer = 0;

  const take = () => {
    if (pointer < 0 || pointer >= program.length) {
      return null;
    }
    return program[pointer++];
  }

  const combo = (n) => {
    switch (n) {
      case 0:
      case 1:
      case 2:
      case 3:
        return n;
      case 4:
        return register.a;
      case 5:
        return register.b;
      case 6:
        return register.c;
      default:
        throw new Error(`combo ${n} wa`);
    }
  }

  const adv = (x) => {
    register.a = register.a >> combo(x);
  };

  const bxl = (x) => {
    register.b = register.b ^ x;
  }

  const bst = (x) => {
    register.b = combo(x) % 8;
  }

  const jnz = (x) => {
    if (register.a !== 0) {
      pointer = x;
    }
  }

  const bxc = () => {
    register.b = register.b ^ register.c;
  }

  const out = (x) => {
    output.push(combo(x) % 8);
  }

  const bdv = (x) => {
    register.b = register.a >> combo(x);
  };

  const cdv = (x) => {
    register.c = register.a >> combo(x);
  };

  const instructions = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

  const step = () => {
    const op = take();
    const arg = take();

    if (op === null || arg === null) {
      return true;
    }

    instructions[op](arg);

    return false;
  };

  while(!step()) {

  }

  return output.join(',');
}