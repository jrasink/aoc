const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const cardOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();

const cardValue = (s) => {
  const value = cardOrder.indexOf(s);
  if (value != -1) {
    return value;
  }
  throw `Card out of bounds: '${s}'`;
};

const countCards = (cards) => {
  const counts = {};
  for (const card of cards) {
    if (!(card in counts)) {
      counts[card] = 0;
    }
    counts[card] += 1;
  }
  return Object.entries(counts).map(([card, count]) => ({ card, count })).sort((a, b) => b.count - a.count);
};

const getHighestValue = (cards) => cards.map(cardValue).reduce((a, b) => a > b ? a : b);

const compareHands = (a, b) => {
  const acs = countCards(a.cards);
  const bcs = countCards(b.cards);

  for (let i = 0, m = Math.min(acs.length, bcs.length); i < m; i++) {
    if (bcs[i].count != acs[i].count) {
      return bcs[i].count - acs[i].count;
    }
  }

  for (let i = 0, m = 5; i < m; i++) {
    const av = cardValue(a.cards[i]);
    const bv = cardValue(b.cards[i]);

    if (bv != av) {
      return bv - av;
    }
  }

  return 0;
};

const parseLine = (s) => {
  const [handString, bidString] = s.split(' ');
  const cards = handString.split('');
  const bid = parseInt(bidString, 10);
  return { bid, cards, s: handString };
}

const parseInput = (s) => s.split('\n').map(parseLine);

const hands = parseInput(input);

console.log(hands);

const sorted = hands.sort(compareHands);

console.log(sorted)

const value = sorted.reverse().map(({ bid }, i) => (i + 1) * bid).reduce((a, b) => a + b);

console.log(value)
