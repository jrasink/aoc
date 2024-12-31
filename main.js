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
  const time = t();
  return { result, time };
};

const getCode = async ({ year, day, part }) => {
  const s = `0${day}`.slice(-2);
  const { default: run } = await import(`./${year}/${s}/code/part-${part}.js`);
  return timed(run);
};

const getInput = async ({ year, day, options }) => {
  const s = `0${day}`.slice(-2);
  const b = await fs.readFile(`./${year}/${s}/input/${options.test ? STAGE.test : STAGE.real}`);
  return b.toString();
};

const writeOutput = async ({ year, day, part, options }, output) => {
  const s = `0${day}`.slice(-2);
  await fs.mkdir(`./${year}/${s}/output`, { recursive: true });
  await fs.writeFile(`./${year}/${s}/output/part-${part}.json`, Buffer.from(JSON.stringify(output, null, 4)));
};

const createFiles = async ({ year, day }) => {
  const s = `0${day}`.slice(-2);
  await fs.mkdir(`./${year}/${s}/code`, { recursive: true });
  await fs.mkdir(`./${year}/${s}/input`, { recursive: true });
  await fs.writeFile(`./${year}/${s}/code/part-1.js`, Buffer.from(`export default (input) => {\n\n}\n`));
  await fs.writeFile(`./${year}/${s}/code/part-2.js`, Buffer.from(`export default (input) => {\n\n}\n`));
  await fs.writeFile(`./${year}/${s}/input/${STAGE.test}`, '');
  await fs.writeFile(`./${year}/${s}/input/${STAGE.real}`, '');
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
    i.question(`About to create code and input files for year ${year}, day ${day}.\nThis will overwrite any existing files. Are you sure? [y/n] `, (r) => {
      i.close();
      if (!['y', 'yes', 'yes please', 'yea', 'yeah', 'aye', 'ok', 'sure', 'go', 'do it'].includes(r.toLowerCase())) {
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

  const input = await getInput({ year, day, part, options });
  const code = await getCode({ year, day, part, options });

  console.log(`Running year ${year}, day ${day}, part ${part} with ${options.test ? 'test' : 'real'} input (size ${input.length})`);

  const { time, result } = await code(input);

  console.log(`Elapsed: ${time}ms, result: ${result}`);

  if (!options.test) {
    await writeOutput({ year, day, part, options }, { time, result });
  }
};

const runDay = async (params, options) => {
  await run([...params, 1], options);
  await run([...params, 2], options);
}

const runYear = async (params, options) => {
  for (let day = 1; day < 26; day++) {
    await runDay([...params, day], options);
  }
}

(async () => {
  const { params, options } = getParams();

  const [cmd, ...ps] = params;

  switch (cmd) {
    case 'init':
      return init(ps, options);
    case 'part':
      return run(ps, options);
    case 'day':
      return runDay(ps, options);
    case 'year':
      return runYear(ps, options);
    default:
      throw new Error(`Unsupported command '${cmd}'`);
  }
})().catch((e) => {
  throw e;
});
