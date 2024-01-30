export const capitalizeFirstChar = (sentence: string) => {
  return sentence.toLowerCase().charAt(0).toUpperCase() + sentence.slice(1);
};
