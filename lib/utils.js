import fs from 'fs/promises';

const measureTime = () => {
  const startTime = process.hrtime();
  return () => {
    const [s, ns] = process.hrtime(startTime);
    const t = (s * 1e3) + (ns * 1e-6);
    return Math.floor(t * 1000) / 1000;
  };
};

const timed = (f) => async (...xs) => {
  const t = measureTime();
  const result = await f(...xs);
  const elapsed = t();
  return { result, elapsed };
};

export const getCode = async (year, day, part) => {
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

  const { default: run } = await import( `../${y}/code/day-${s}/part-${p}.js`);

  return timed(run);
};

export const getInput = async (year, day, test = false) => {
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

  const b = await fs.readFile(`./${path}`);

  return b.toString();
};

export const getParams = () => {
  const dash = '-';

  const xs = [...process.argv.slice(2)];

  const params = [];
  const options = {};

  const take = () => xs.shift();

  const option = (k, v) => {
    options[k] = v;
  }

  const param = (k) => {
    params.push(k);
  }

  const read = () => {
    const s = take();
    const ds = s.split(dash);
    const name = ds.pop();

    if (!name || ds.length > 2) {
      throw new Error(`Cannot parse '${[...ds, name].join(dash)}'`);
    }

    if (ds.length === 2) {
      return option(name, true);
    }

    if (ds.length === 1) {
      if (!xs.length) {
        throw new Error(`No value for input argument '${[...ds, name].join(dash)}'`);
      }

      return option(name, take());
    }

    return param(name);
  };

  while(xs.length > 0) {
    read();
  }

  return { params, options };
};
