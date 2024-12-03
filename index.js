const { measureTime, getCode, getInput, getParams } = require('./lib/utils');

try {
  const { params, options } = getParams();
  const [year, day, part] = params;

  if (!year || !day || !part) {
    throw new Error(`Provide parameters for year, day and part number.`)
  }

  const { test: isTest } = options;

  const input = getInput(year, day, isTest);
  const run = getCode(year, day, part);

  console.log(`Running year ${year}, day ${day}, part ${part} with ${isTest ? 'test' : 'real'} input (size ${input.length})`);
  console.log('---')

  const getTime = measureTime();

  const result = run(input);

  const elapsed = getTime();

  console.log(`Elapsed: ${elapsed}ms, result: ${result}`);
} catch (e) {
  throw e;
}
