const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const cardOrder = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();

const cardValue = (s) => {
  const value = cardOrder.indexOf(s);
  if (value != -1) {
    return value;
  }
  throw `Card out of bounds: '${s}'`;
};

const countCards = (hand) => {
  const cards = hand.split('');

  const counts = {};

  for (const card of cards) {
    if (!(card in counts)) {
      counts[card] = 0;
    }
    counts[card] += 1;
  }

  const {
    'J': j,
    ...others
  } = counts;

  const result = Object.values(others).sort((a, b) => b - a);

  if (!result.length) {
    return [j];
  }

  if (j) {
    result[0] += j;
  }

  return result;
};

const compareHands = (a, b) => {
  const acs = countCards(a);
  const bcs = countCards(b);

  for (let i = 0, m = Math.min(acs.length, bcs.length); i < m; i++) {
    const d = bcs[i] - acs[i];
    if (d != 0) {
      return d;
    }
  }

  for (let i = 0, m = Math.min(a.length, b.length); i < m; i++) {
    const d = cardValue(b[i]) - cardValue(a[i]);
    if (d != 0) {
      return d;
    }
  }

  return 0;
};

const parseLine = (s) => {
  const [hand, bidString] = s.split(' ');
  const bid = parseInt(bidString, 10);
  return { hand, bid };
}

const parseInput = (s) => s.split('\n').map(parseLine);

const lines = parseInput(input);

// console.log(lines);

const sorted = lines.sort((a, b) => compareHands(a.hand, b.hand));

// console.log(sorted);

const value = sorted.reverse().map(({ bid }, i) => (i + 1) * bid).reduce((a, b) => a + b);

console.log(value)

// 248750248
