export default (input) => {
  const lines = input.split('\n');

  const val = (c) => {
    switch (c) {
      case '(':
        return 1;
      case ')':
        return -1;
      default:
        throw new Error(`waa: '${c}'`);
    }
  }

  const [line] = lines;

  const f = line.split('').reduce((f, c) => f + val(c), 0);

  return f;
}
