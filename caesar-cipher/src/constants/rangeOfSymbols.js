const rangeOfSymbols = [];

const startSymbol = 'a'.charCodeAt(0);
const endSymbol = 'z'.charCodeAt(0);

for (let i = startSymbol; i <= endSymbol; i++) {
  rangeOfSymbols.push(String.fromCharCode(i));
}

module.exports = rangeOfSymbols;
