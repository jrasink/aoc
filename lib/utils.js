import fs from 'fs/promises';

export const STAGE = {
  test: 'test',
  real: 'real'
};

export const measureTime = () => {
  const startTime = process.hrtime();
  return () => {
    const [s, ns] = process.hrtime(startTime);
    const t = (s * 1e3) + (ns * 1e-6);
    return Math.floor(t * 1000) / 1000;
  };
};

export const timed = (f) => async (...xs) => {
  const t = measureTime();
  const result = await f(...xs);
  const elapsed = t();
  return { result, elapsed };
};

export const getCode = async ({ year, day, part }) => {
  const s = `0${day}`.slice(-2);
  const { default: run } = await import( `../${year}/code/day-${s}/part-${part}.js`);
  return timed(run);
};

export const getInput = async ({ year, day, options }) => {
  const s = `0${day}`.slice(-2);
  const b = await fs.readFile(`./${year}/input/day-${s}/${options.test ? STAGE.test : STAGE.real}`);
  return b.toString();
};

export const writeOutput = async ({ year, day, part, options }, { elapsed, result, logs }) => {
  const s = `0${day}`.slice(-2);
  await fs.mkdir(`./${year}/output/day-${s}`, { recursive: true });
  await fs.writeFile(`./${year}/output/day-${s}/part-${part}-${options.test ? STAGE.test : STAGE.real}.json`, Buffer.from(JSON.stringify({ elapsed, result, logs }, null, 4)));
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
      throw new Error(`Cannot parse '${s}'`);
    }

    if (ds.length === 2) {
      return option(name, true);
    }

    if (ds.length === 1) {
      if (!xs.length) {
        throw new Error(`No value for input argument '${s}'`);
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

export const getContext = () => {
  const { params, options } = getParams();

  const [yearString, dayString, partString] = params;

  if (!yearString || !dayString || !partString) {
    throw new Error(`Provide parameters for year, day and part number.`)
  }

  const year = parseInt(yearString, 10);

  if (isNaN(year) || year < 2015 || year > new Date().getFullYear()) {
    throw new Error(`Not a valid year: '${yearString}'`);
  }

  const day = parseInt(dayString, 10);

  if (isNaN(day) || day < 1 || day > 25) {
    throw new Error(`Not a valid day number: '${dayString}'`);
  }

  const part = parseInt(partString, 10);

  if (isNaN(part) || part < 1 || part > 2) {
    throw new Error(`Not a valid part number: '${partString}'`);
  }

  return { year, day, part, options }
};
