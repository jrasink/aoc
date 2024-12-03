import { getCode, getInput, getContext, writeOutput } from './lib/utils.js';

(async () => {
  const { year, day, part, options } = getContext();

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
  log('---')

  const { elapsed, result } = await run(input);

  log(`Elapsed: ${elapsed}ms, result: ${result}`);

  await writeOutput({ year, day, part, options }, { elapsed, result, logs });
})().catch((e) => {
  throw e;
});
