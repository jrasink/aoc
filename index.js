import { getCode, getInput, getContext, writeOutput } from './lib/utils.js';

(async () => {
  const { year, day, part, options } = getContext();

  if (options.create) {
    // todo
    // create code and input files for the day if they don't exist
    // fetch actual input from aoc
  }

  const logs = [];

  const log = (...xs) => {
    logs.push(...xs);
    if (!options.quiet) {
      console.log(...xs);
    }
  };

  const input = await getInput({ year, day, part, options });
  const run = await getCode({ year, day, part, options });

  log(`Running year ${year}, day ${day}, part ${part} with ${options.test ? 'test' : 'real'} input (size ${input.length})`);

  const { elapsed, result } = await run(input);

  log(`Elapsed: ${elapsed}ms, result: ${result}`);

  await writeOutput({ year, day, part, options }, { elapsed, result, logs });
})().catch((e) => {
  throw e;
});
