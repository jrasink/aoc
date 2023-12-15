const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const dump = (o) => console.log(JSON.stringify(o, null, 4));

const parseSeedString = (s) => s.split(': ').slice(1).shift().split(' ').map((p) => parseInt(p, 10));

const parseRangeString = (s) => {
  const [destination, source, length] = s.split(' ').map((p) => parseInt(p, 10));
  return { source, destination, length };
};

const parseMappingString = (s) => {
  const [header, ...rangeStrings] = s.split('\n');
  const [name] = header.split(' ');
  const ranges = rangeStrings.map(parseRangeString);
  return { name, ranges };
}

const parseInput = (s) => {
  const [seedString, ...mappingStrings] = input.split('\n\n');
  const seeds = parseSeedString(seedString);
  const mappings = mappingStrings.map(parseMappingString);
  return {
    seeds,
    mappings
  };
};

const applyMapping = (n, { name, ranges }) => {
  for (const { source, destination, length } of ranges) {
    if (n >= source && n < (source + length)) {
      console.log(`${name}: ${n} -> ${n - source + destination}`)
      return (n - source + destination);
    }
  }
  console.log(`${name}: ${n} -> ${n}`)
  return n;
};

const applyMappings = (n, mappings) => mappings.reduce((m, mapping) => applyMapping(m, mapping), n);

const {
  seeds,
  mappings
} = parseInput(input);

dump(seeds);

dump(mappings);

const locations = seeds.map((seed) => applyMappings(seed, mappings));

console.log(locations);

const minimum = locations.reduce((a, b) => (a < b ? a : b));

console.log(minimum);
