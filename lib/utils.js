const fs = require('fs');

const measureTime = () => {
  const startTime = process.hrtime();
  return () => {
    const [s, ns] = process.hrtime(startTime);
    const t = (s * 1e3) + (ns * 1e-6);
    return Math.floor(t * 1000) / 1000;
  };
};

const getCode = (year, day, part) => {
  const y = parseInt(year, 10);

  if (isNaN(y) || y < 2015 || y > new Date().getFullYear()) {
    throw new Error(`Not a valid year: '${year}'`);
  }

  const d = parseInt(day, 10);

  if (isNaN(d) || d < 1 || d > 25) {
    throw new Error(`Not a valid day number: '${day}'`);
  }

  const s = `0${d}`.slice(-2);

  const p = parseInt(part, 10);

  if (isNaN(p) || p < 1 || p > 2) {
    throw new Error(`Not a valid part number: '${part}'`);
  }

  return require(`../${y}/code/day-${s}/part-${p}`);
};

const getInput = (year, day, test = false) => {
  const y = parseInt(year, 10);

  if (isNaN(y) || y < 2015 || y > new Date().getFullYear()) {
    throw new Error(`Not a valid year: '${year}'`);
  }

  const d = parseInt(day, 10);

  if (isNaN(d) || d < 1 || d > 25) {
    throw new Error(`Not a valid day number: '${day}'`);
  }

  const s = `0${d}`.slice(-2);

  const v = test ? 'test' : 'real';

  const path = `${y}/input/day-${s}/${v}`;

  if (!fs.existsSync(`./${path}`)) {
    throw new Error(`Input file does not exist: '${path}'`);
  }

  if(fs.lstatSync(`./${path}`).isDirectory()) {
    throw new Error(`Input file is a directory: '${path}'`);
  }

  return fs.readFileSync(`./${path}`).toString();
};

const getParams = () => {
  const dash = '-';

  const parse = (xs) => {
    const ys = [...xs];

    const params = [];
    const options = {};

    const take = () => ys.shift();

    const set = (k, v) => {
      options[k] = v;
    }

    const read = () => {
      const s = take();
      const ds = s.split(dash);
      const name = ds.pop();

      if (ds.length > 2) {
        throw new Error(`Cannot parse input argument '${[...ds, name].join(dash)}'`);
      }

      if (ds.length === 2) {
        return set(name, true);
      }

      if (ds.length === 1) {
        if (!ys.length) {
          throw new Error(`Cannot get value for input argument '${[...ds, name].join(dash)}'`);
        }

        return set(name, take());
      }

      params.push(name);
    };

    while(ys.length > 0) {
      read();
    }

    return { params, options };
  }

  return parse(process.argv.slice(2));
};

module.exports = {
  measureTime,
  getParams,
  getCode,
  getInput
};
