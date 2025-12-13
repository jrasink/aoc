export default (input) => {
  const machines = input.split('\n').map((line) => {
    const sections = line.split(' ').map((s) => s.slice(1, -1));
    const target = sections.shift().split('').reverse().map((s) => s === '#' ? 1 : 0).reduce((n, b) => b + (n << 1), 0);
    const numbers = sections.map((s) => s.split(',').map((s) => parseInt(s, 10))).slice(0, -1);
    const buttons = numbers.map((ms) => ms.reduce((n, m) => n + (1 << m), 0));
    return { target, buttons };
  });

  const test = (target, buttons, h = 0) => {
    if (target === 0) {
      return h;
    }

    const hs = buttons.map((button, i) => test(target ^ button, buttons.slice(i + 1), h + 1)).filter((h) => (h !== null));

    if (!hs.length) {
      return null;
    }

    return hs.sort((a, b) => a - b).shift();
  }

  return machines.reduce((z, { buttons, target }) => z + test(target, buttons), 0);
}
