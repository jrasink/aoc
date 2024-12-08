import fs from 'fs/promises';
import readline from 'readline';
import { stdin, stdout } from 'process';

const STAGE = {
  test: 'test',
  real: 'real'
};

const CHAR = {
  dash: '-'
};

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

const getCode = async ({ year, day, part }) => {
  const s = `0${day}`.slice(-2);
  const { default: run } = await import(`./${year}/code/day-${s}/part-${part}.js`);
  return timed(run);
};

const getInput = async ({ year, day, options }) => {
  const s = `0${day}`.slice(-2);
  const b = await fs.readFile(`./${year}/input/day-${s}/${options.test ? STAGE.test : STAGE.real}`);
  return b.toString();
};

const writeOutput = async ({ year, day, part, options }, { elapsed, result, logs }) => {
  const s = `0${day}`.slice(-2);
  await fs.mkdir(`./${year}/output/day-${s}`, { recursive: true });
  await fs.writeFile(`./${year}/output/day-${s}/part-${part}-${options.test ? STAGE.test : STAGE.real}.json`, Buffer.from(JSON.stringify({ elapsed, result, logs }, null, 4)));
};

const createFiles = async ({ year, day }) => {
  const s = `0${day}`.slice(-2);
  await fs.mkdir(`./${year}/code/day-${s}`, { recursive: true });
  await fs.mkdir(`./${year}/input/day-${s}`, { recursive: true });
  await fs.writeFile(`./${year}/code/day-${s}/part-1.js`, Buffer.from(`export default (input) => {\n\n}`));
  await fs.writeFile(`./${year}/code/day-${s}/part-2.js`, Buffer.from(`export default (input) => {\n\n}`));
  await fs.writeFile(`./${year}/input/day-${s}/${STAGE.test}`, '');
  await fs.writeFile(`./${year}/input/day-${s}/${STAGE.real}`, '');
};

const getParams = () => {
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
    const ds = s.split(CHAR.dash);
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

const init = async (params, options) => {
  const [yearString, dayString] = params;

  if (!yearString || !dayString) {
    throw new Error(`Provide parameters for year and day.`)
  }

  const year = parseInt(yearString, 10);

  if (isNaN(year) || year < 2015 || year > new Date().getFullYear()) {
    throw new Error(`Not a valid year: '${yearString}'`);
  }

  const day = parseInt(dayString, 10);

  if (isNaN(day) || day < 1 || day > 25) {
    throw new Error(`Not a valid day number: '${dayString}'`);
  }

  await new Promise((resolve) => {
    const i = readline.createInterface({ input: stdin, output: stdout });
    i.question(`Creating code and input files for year ${year}, day ${day}. This will overwrite any existing files. Are you sure? `, (r) => {
      i.close();
      if (!['y', 'yes'].includes(r)) {
        console.log(`Ok fine.`);
        process.exit();
      }
      resolve();
    });
  });

  await createFiles({ year, day, options });

  console.log(`Done.`);
};

const run = async (params, options) => {
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

  const logs = [];

  const log = (...xs) => {
    logs.push(...xs);
    console.log(...xs);
  };

  const input = await getInput({ year, day, part, options });
  const run = await getCode({ year, day, part, options });

  log(`Running year ${year}, day ${day}, part ${part} with ${options.test ? 'test' : 'real'} input (size ${input.length})`);

  const { elapsed, result } = await run(input);

  log(`Elapsed: ${elapsed}ms, result: ${result}`);

  await writeOutput({ year, day, part, options }, { elapsed, result, logs });
};

(async () => {
  const { params, options } = getParams();

  const [cmd, ...ps] = params;

  switch (cmd) {
    case 'run':
      return run(ps, options);
    case 'init':
      return init(ps, options);
    default:
      throw new Error(`Unsupported command '${cmd}'`);
  }
})().catch((e) => {
  throw e;
});
