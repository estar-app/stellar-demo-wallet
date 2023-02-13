export const capitalizeString = (phrase) => {
    const [firstLetter, ...restOfWord] = phrase.split("");
    return firstLetter.toUpperCase() + restOfWord.join("");
};
//# sourceMappingURL=capitalizeString.js.map