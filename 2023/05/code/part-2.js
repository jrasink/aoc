export default (input) => {
  const SML = 0;
  const BIG = 5000000000;

  const dump = (o) => console.log(JSON.stringify(o, null, 4));

  const parseSeedString = (s) => {
    const ns = s.split(': ').slice(1).shift().split(' ').map((p) => parseInt(p, 10));
    const seeds = [];
    while(ns.length) {
      const start = ns.shift();
      const length = ns.shift();
      seeds.push({ start, length });
    };
    return seeds;
  };

  const parseRangeString = (s) => {
    const [destination, source, length] = s.split(' ').map((p) => parseInt(p, 10));
    return { source, destination, length };
  };

  const parseMappingString = (s) => {
    const [header, ...rangeStrings] = s.split('\n');
    const [name] = header.split(' ');
    const ranges = rangeStrings.map(parseRangeString).sort((a, b) => a.source - b.source);

    const firstRange = ranges[0];
    if (firstRange.source > SML) {
      ranges.unshift({
        source: SML,
        destination: SML,
        length: firstRange.source - SML
      });
    }

    const lastRange = ranges[ranges.length - 1];
    if ((lastRange.source + lastRange.length) < BIG) {
      ranges.push({
        source: (lastRange.source + lastRange.length),
        destination: (lastRange.source + lastRange.length),
        length: BIG - (lastRange.source + lastRange.length)
      });
    }

    return { name, ranges };
  }

  const parseInput = (s) => {
    const [seedString, ...mappingStrings] = s.split('\n\n');
    const seeds = parseSeedString(seedString);
    const mappings = mappingStrings.map(parseMappingString);
    return {
      seeds,
      mappings
    };
  };

  const combineMappings = (a, b) => {
    const ars = a.ranges.sort((r1, r2) => (r1.destination - r2.destination));
    const brs = b.ranges;

    const ranges = [];

    let i = 0, j = 0;

    let sourceOffset = 0;
    let destinationOffset = 0;

    while (i < ars.length && j < brs.length) {
      const ar = ars[i]
      const arf = ar.destination;
      const art = ar.destination + ar.length;

      const br = brs[j]
      const brf = br.source;
      const brt = br.source + br.length;

      const lo = Math.max(arf, brf);
      const hi = Math.min(art, brt);

      if (lo < hi) {
        const length = hi - lo;

        // console.log(`combining: [${arf}, ${art}] to [${brf}, ${brt}] have overlap ${lo}, ${hi}`);
        // console.log(`[${ar.source}, ${ar.source + ar.length}] => [${ar.destination}, ${ar.destination + ar.length}]`);
        // console.log(`[${br.source}, ${br.source + br.length}] => [${br.destination}, ${br.destination + br.length}]`);
        // console.log(`---`);
        // console.log(`[${ar.source + sourceOffset}, ${ar.source + sourceOffset + length}] => [${br.destination + destinationOffset}, ${br.destination + destinationOffset + length}]`);
        // console.log('');

        ranges.push({
          source: ar.source + sourceOffset,
          destination: br.destination + destinationOffset,
          length: length
        });

        sourceOffset += (hi - lo);
        destinationOffset += (hi - lo);
      } else {
        // console.log(`combining: [${arf}, ${art}] to [${brf}, ${brt}] have no overlap`);
      }

      if (art < brt) {
        i++;
        sourceOffset = 0;
      } else {
        j++;
        destinationOffset = 0;
      }
    }

    const from = a.name.split('-to-').shift();
    const to = b.name.split('-to-').slice(1).shift();
    const name = `${from}-to-${to}`;

    return { name, ranges: ranges.sort((a, b) => a.source - b.source) };
  };

  const applyMapping = ({ start, length }, { name, ranges }) => {
    // console.log(`Applying ${start, length}`);

    const results = [];
    for (const { source, destination, length: rangeLength } of ranges) {
      const lo = Math.max(start, source);
      const hi = Math.min(start + length, source + rangeLength);
      // console.log(`Checking range ${source}, ${source + rangeLength}`);
      if (lo < hi) {
        // seed interval intersects with mapping range
        // we're only interested in the minimum result possible
        // this is always the lowest seed number in the intersection

        // console.log(`Found result ${lo}, pushing ${lo - source + destination}`);
        results.push(lo - source + destination);
      }
    }

    // console.log(`Got ${results}`);

    // return the lowest of the numbers we found
    return results.reduce((a, b) => a < b ? a : b);
  };

  const {
    seeds,
    mappings
  } = parseInput(input);

  // dump(seeds);

  // dump(mappings);

  // console.log(combineMappings(mappings[0], mappings[1]));

  const combinedMapping = mappings.reduce(combineMappings);

  dump(combinedMapping);

  const minLocationsPerSeed = seeds.map((seed) => applyMapping(seed, combinedMapping));

  // console.log(minLocationsPerSeed);

  const m = minLocationsPerSeed.reduce((a, b) => (a < b ? a : b));

  console.log(m);

  return m;
}
