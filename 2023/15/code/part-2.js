export default (input) => {
  const range = (n) => [...Array(n)].map((_, i) => i);

  const OP = { add: 0, remove: 1 };

  const parseInput = (s) => s.split('\n').join('').split(',').map((s) => {
    if (s.indexOf('=') !== -1) {
      const [label, number] = s.split('=');
      return { op: OP.add, ps: [label, parseInt(number, 10)] };
    }

    if (s.indexOf('-') !== -1) {
      const [label] = s.split('-');
      return { op: OP.remove, ps: [label] };
    }

    throw `failed to parse instruction ${s}`;
  });

  const hash = (label) => label.split('').reduce((n, c) => ((n + c.charCodeAt(0)) * 17) % 256, 0);

  const findLabel = (box, s) => box.reduce((i, [label], k) => label == s ? k : i, -1);

  const remove = (boxes, label) => {
    const index = hash(label);
    const box = boxes[index];
    const k = findLabel(box, label);
    if (k !== -1) {
      box.splice(k, 1);
    }
  };

  const add = (boxes, label, number) => {
    const index = hash(label);
    const box = boxes[index];
    const k = findLabel(box, label);
    if (k !== -1) {
      box[k][1] = number;
    } else {
      box.push([label, number]);
    }
  };

  const boxes = range(256).map(() => []);

  const instructions = parseInput(input);

  for (const { op, ps } of instructions) {
    switch (op) {
      case OP.add:
        add(boxes, ...ps);
        break;
      case OP.remove:
        remove(boxes, ...ps);
        break;
    }
  }

  const boxPower = (box, i) => {
    if (!box.length) {
      return 0;
    }

    return box.map(([_, n], k) => (1 + k) * (1 + i) * n).reduce((a, b) => a + b);
  };

  const power = boxes.map(boxPower).reduce((a, b) => a + b);

  console.log(power);

  return power;
}
