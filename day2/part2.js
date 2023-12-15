const fs = require('fs');

const input = fs.readFileSync('./actual-input').toString();
const lines = input.split('\n');

// 'Game X' => X
const parseGameString = (s) => parseInt(s.split(' ').slice(1).shift(), 10);

// '3 blue, 4 red' => { blue: 3, red: 4 }
const parseEventString = (s) => s.split(', ').reduce((o, s) => {
  const [numberString, colour] = s.split(' ');
  const number = parseInt(numberString, 10);
  if (!(colour in o)) {
    o[colour] = 0;
  } else {
    // colour occurs twice, take note
  }
  o[colour] += number;
  return o;
}, {});

// '3 blue, 4 red; 2 blue, 3 red' => [{ blue: 3, red: 4 }, { blue: 2, red: 3 }]
const parseEventsString = (s) => s.split('; ').map(parseEventString);

// 'Game 2: 3 blue, 4 red; 2 blue, 3 red' => { id: 2, events: [{ blue: 3, red: 4 }, { blue: 2, red: 3 }] }
const parseGameLine = (s) => {
  const [gameString, eventsString] = s.split(': ');
  const id = parseGameString(gameString);
  const events = parseEventsString(eventsString);
  return { id, events };
}

const getMinimumNumbers = ({ id, events }) => {
  const o = {};
  // console.log(`Game ${id} events ${JSON.stringify(events)}`);
  for (const event of events) {
    for (const [c, n] of Object.entries(event)) {
      // console.log(`colour ${c} has ${n}`);
      if (!(c in o)) {
        o[c] = n;
      }
      if (o[c] < n) {
        o[c] = n;
      }
    }
  }
  console.log(`Game ${id} with events ${JSON.stringify(events)} needs at least ${JSON.stringify(o)}`);
  return o;
};

const getPower = (game) => {
  const o = getMinimumNumbers(game);
  const power = Object.values(o).reduce((n, m) => n * m, 1);
  console.log(`The product is ${power}`);
  return power;
}

console.log(input);
// console.log(lines);

const games = lines.map(parseGameLine);
const powers = games.map(getPower);
const result = powers.reduce((n, id) => n + id, 0);

console.log(result);
