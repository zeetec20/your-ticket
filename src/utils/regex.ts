export const isWord = (string: string) => {
  const wordPattern = /^[a-zA-Z]+$/;
  return wordPattern.test(string);
};
