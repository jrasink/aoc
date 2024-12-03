import { getCode, getInput, getParams } from './lib/utils.js';

(async () => {
  const { params, options } = getParams();
  const [year, day, part] = params;

  if (!year || !day || !part) {
    throw new Error(`Provide parameters for year, day and part number.`)
  }

  const { test: isTest } = options;

  const input = await getInput(year, day, isTest);
  const run = await getCode(year, day, part);

  console.log(`Running year ${year}, day ${day}, part ${part} with ${isTest ? 'test' : 'real'} input (size ${input.length})`);
  console.log('---')

  const { elapsed, result } = await run(input);

  console.log(`Elapsed: ${elapsed}ms, result: ${result}`);
})().catch((e) => {
  throw e;
});
