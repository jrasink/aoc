export default (input) => {
  const ss = input.split('\n\n');

  const areas = ss.pop().split('\n').map((s) => {
    const [sizeString, boxesString] = s.split(': ');
    const boxes = boxesString.split(' ').map((w) => parseInt(w, 10));
    const size = sizeString.split('x').map((w) => parseInt(w, 10));
    return { size, boxes };
  });

  const packs = ss.map((s) => s.split('\n').slice(1).map((w) => w.split('').map((v) => v === '#')));

  const minSupport = ([x, y]) => Math.floor(x / 3) * Math.floor(y / 3);

  const test = areas.map(({ size, boxes }) => {
    const diff = minSupport(size) - boxes.reduce((a, b) => a + b);

    // calculate for combinations of packs how much can potentially be gained by packing
    // the differences between the minimum and the requirement seem to be large
    // check if the differences can be beaten by packing

    // if (diff < 0) {
    //   console.log(diff);
    // }

    return diff >= 0;
  });

  return test.reduce((z, b) => z + (b ? 1 : 0), 0);
}
