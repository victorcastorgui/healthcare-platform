export const formatToTitleCase = (sentence: string) => {
  const arrSentence = sentence.toLowerCase().split(" ");
  for (let i = 0; i < arrSentence.length; i++) {
    arrSentence[i] =
      arrSentence[i].charAt(0).toUpperCase() + arrSentence[i].slice(1);
  }
  return arrSentence.join(" ");
};
