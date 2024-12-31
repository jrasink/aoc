export default (input) => {
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

  // '12 red cubes, 13 green cubes, and 14 blue cubes' => { red: 12, green: 13, blue: 14 }
  const parseBounds = (s) => {
    const re = new RegExp(/(\d+) (\w+) cubes/, 'g');
    const bounds = {};
    let match;
    while ((match = re.exec(s)) != null) {
      const [ns, c] = match.slice(1);
      const n = parseInt(ns, 10);
      if (!(c in bounds)) {
        bounds[c] = 0;
      }
      bounds[c] += n;
    }
    return bounds;
  }

  const createValidator = (s) => {
    const bounds = parseBounds(s);
    return ({ id, events }) => {
      for (const event of events) {
        for (const [colour, number] of Object.entries(event)) {
          if (!(colour in bounds)) {
            console.log(`Game ${id} event ${JSON.stringify(event)} out of bounds, colour does not exist`);
            return false;
          }

          if (bounds[colour] < number) {
            console.log(`Game ${id} event ${JSON.stringify(event)} out of bounds, too many ${colour} cubes`);
            return false;
          }
        }
      }
      console.log(`Game ${id} OK`);
      return true;
    }
  }

  const validate = createValidator('12 red cubes, 13 green cubes, and 14 blue cubes');

  const games = lines.map(parseGameLine);

  const valid = games.filter((game) => validate(game));

  const result = valid.map(({ id }) => id).reduce((n, id) => n + id, 0);

  return result;
}
