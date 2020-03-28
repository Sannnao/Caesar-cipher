const rangeOfSymbols = require('../constants/rangeOfSymbols');
const { DECODE, ENCODE } = require('../constants/actions');

const encode = (textArr, symbol, indexOfSymbol, currentIndex, shift) => {
  const overflow = (indexOfSymbol + shift) % rangeOfSymbols.length;

  const codeOfEncodedSymbol = rangeOfSymbols[overflow].charCodeAt(0);
  const difference = codeOfEncodedSymbol - symbol.toLowerCase().charCodeAt(0);

  textArr[currentIndex] = String.fromCharCode(
    symbol.charCodeAt(0) + difference
  );
};

const decode = (textArr, symbol, indexOfSymbol, currentIndex, shift) => {
  let indexOfDecodedSymbol = indexOfSymbol - shift;

  if (shift > rangeOfSymbols.length) {
    indexOfDecodedSymbol = indexOfSymbol - (shift % rangeOfSymbols.length);
  }

  if (indexOfDecodedSymbol < 0) {
    indexOfDecodedSymbol =
      rangeOfSymbols.length - Math.abs(indexOfDecodedSymbol);
  }

  const codeOfDecodedSymbol = rangeOfSymbols[indexOfDecodedSymbol].charCodeAt(
    0
  );
  const difference = symbol.toLowerCase().charCodeAt(0) - codeOfDecodedSymbol;

  textArr[currentIndex] = String.fromCharCode(symbol.charCodeAt(0) - difference);
};

const cipher = (data, shift, action) => {
    const textArr = data.toString().split('');

    textArr.forEach((symbol, index) => {
      if (rangeOfSymbols.includes(symbol.toLowerCase())) {
        const indexOfSymbol = rangeOfSymbols.indexOf(symbol.toLowerCase());

        switch(action) {
          case ENCODE:
            encode(textArr, symbol, indexOfSymbol, index, shift);
            break;
          case DECODE:
            decode(textArr, symbol, indexOfSymbol, index, shift);
            break;
        }
      }
    });

    return textArr.join('');
};

module.exports = cipher;
