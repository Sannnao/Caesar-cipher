const cipher = (text, shift, action) => {
  const textArr = text.split('');

  const encode = (symbol, indexOfSymbol, currentIndex) => {
    const overflow = (indexOfSymbol + shift) % rangeOfSymbols.length;

    const codeOfEncodedSymbol = rangeOfSymbols[overflow].charCodeAt(0);
    const difference = codeOfEncodedSymbol - symbol.toLowerCase().charCodeAt(0);

    textArr[currentIndex] = String.fromCharCode(
      symbol.charCodeAt(0) + difference
    );
  };

  const decode = (symbol, indexOfSymbol, currentIndex) => {
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

  textArr.forEach((symbol, index) => {
    if (rangeOfSymbols.includes(symbol.toLowerCase())) {
      const indexOfSymbol = rangeOfSymbols.indexOf(symbol.toLowerCase());

      switch(action) {
        case ENCODE:
          encode(symbol, indexOfSymbol, index);
          break;
        case DECODE:
          decode(symbol, indexOfSymbol, index);
          break;
      }
    }
  });

  return textArr.join('');
};

module.exports = cipher;
