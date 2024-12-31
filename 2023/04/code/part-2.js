export default (input) => {

  const parseCardString = (s) => parseInt(s.split(' ').slice(1).shift(), 10);

  const parseNumberString = (s) => s.split(' ').map(((s) => parseInt(s, 10)));

  const parseCardLine = (s) => {
    const u = s.replace(/\s+/g, ' ');
    const [cardString, numbersString] = u.split(': ');
    const [winningNumbersString, cardNumbersString] = numbersString.split(' | ');
    const id = parseCardString(cardString);
    const winningNumbers = parseNumberString(winningNumbersString);
    const cardNumbers = parseNumberString(cardNumbersString);
    return { id, winningNumbers, cardNumbers };
  }

  const parseCardInput = (input) => input.split('\n').map(parseCardLine);

  const cardMatches = (card) => {
    const { id, winningNumbers, cardNumbers } = card;
    const presentNumbers = winningNumbers.filter((n) => cardNumbers.includes(n));
    return presentNumbers.length;
  }

  const cards = parseCardInput(input);

  const cardCounts = cards.reduce((o, card) => ({ ...o, [card.id]: 1 }), {});

  for (const card of cards) {
    const { id } = card;
    const numberCards = cardCounts[id];
    const matches = cardMatches(card);
    if (matches) {
      for (let i = 0; i < matches; i++) {
        const k = id + i + 1;
        if (k in cardCounts) {
          cardCounts[k] += numberCards;
        }
      }
    }
  }

  console.log(cardCounts)

  const totalCardCount = Object.values(cardCounts).reduce((a, b) => a + b, 0);

  console.log(totalCardCount);

  return totalCardCount;
}
