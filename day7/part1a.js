const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const cardOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();

const cardValue = (card) => cardOrder.indexOf(card);

const rateHandCards = (hand) => hand.map(cardValue).reduce((r, n) => cardOrder.length * r + n);

const countCards = (hand) => hand.reduce((counts, card) => ({ ...counts, [card]: (counts[card] || 0) + 1 }), {});

const rateHandType = (hand) => {
  const counts = countCards(hand);

  const profile = Object.values(counts).sort((a, b) => b - a);

  while(profile.length < hand.length) {
    profile.push(0);
  }

  return profile.reduce((r, n) => hand.length * r + n);
};

const rateHand = (hand) => Math.pow(cardOrder.length, hand.length) * rateHandType(hand) + rateHandCards(hand);

const parseLine = (s) => {
  const [handString, bidString] = s.split(' ');
  const bid = parseInt(bidString, 10);
  const hand = handString.split('');
  return { hand, bid };
};

const lines = input.split('\n');
const hands = lines.map(parseLine);
const rated = hands.map(({ hand, bid }) => ({ hand, bid, rating: rateHand(hand) }));
const sorted = rated.sort((a, b) => a.rating - b.rating);
const values = sorted.map(({ bid }, order) => (order + 1) * bid);
const sum = values.reduce((a, b) => a + b);

console.log(sum);

// 249390788
