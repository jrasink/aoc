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

  const scoreCard = (card) => {
    const { id, winningNumbers, cardNumbers } = card;
    const presentNumbers = winningNumbers.filter((n) => cardNumbers.includes(n));

    if (!presentNumbers.length) {
      console.log(`Card ${id} winning numbers ${JSON.stringify(presentNumbers)}, scores 0`);
      return 0;
    }

    const score = Math.pow(2, presentNumbers.length - 1);
    console.log(`Card ${id} winning numbers ${JSON.stringify(presentNumbers)}, scores ${score}`);
    return score;
  }

  const cards = parseCardInput(input);

  const scores = cards.map(scoreCard);

  const total = scores.reduce((t, n) => t + n, 0);

  console.log(total);

  return total;
}
