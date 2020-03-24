const options = require('./constants/options');
const { SHIFT, INPUT, OUTPUT, ACTION } = options;
const possibleActionValues = require('./constants/actions');
const {
  checkRequiredCommands,
  searchDublicates,
  matchIncomingCommand,
  isProperActionValue,
  isOptionalCommandPassed
} = require('./utils/optionValidator');
const fs = require('fs');

const optionsArr = [SHIFT, INPUT, OUTPUT, ACTION];

const incomingCommands = process.argv.slice(2);

checkRequiredCommands(optionsArr, incomingCommands);

const extractIncomingCommands = (options, incomingCommands) => {
  const dividedCommands = [];

  for (let i = 0; i < incomingCommands.length; i++) {
    const command = incomingCommands[i];
    const value = incomingCommands[i + 1];

    for (let j = 0; j < options.length; j++) {
      const option = options[j];

      if (matchIncomingCommand(option, command)) {
        dividedCommands.push({
          option: command,
          value
        });
      }
    }
  }

  return dividedCommands;
};

const passedOptions = extractIncomingCommands(optionsArr, incomingCommands);

isProperActionValue(passedOptions, possibleActionValues, ACTION);
searchDublicates(optionsArr, incomingCommands);

console.log(extractIncomingCommands(optionsArr, incomingCommands));

// console.log(actions, '<===== actions');
// console.log(incomingCommands, '<===== incomingCommands');

const rangeOfSymbols = [];

const startSymbol = 'a'.charCodeAt(0);
const endSymbol = 'z'.charCodeAt(0);

for (let i = startSymbol; i <= endSymbol; i++) {
  rangeOfSymbols.push(String.fromCharCode(i));
}

const encode = (text, shift) => {
  const textArr = text.split('');

  textArr.forEach((symbol, index) => {
    if (rangeOfSymbols.includes(symbol.toLowerCase())) {
      const indexOfSymbol = rangeOfSymbols.indexOf(symbol.toLowerCase());

      const laps = Math.floor((indexOfSymbol + shift) / rangeOfSymbols.length);
      const overflow = indexOfSymbol + shift - laps * rangeOfSymbols.length;

      const codeOfEncodedSymbol = rangeOfSymbols[overflow].charCodeAt(0);
      const difference =
        codeOfEncodedSymbol - symbol.toLowerCase().charCodeAt(0);

      textArr[index] = String.fromCharCode(symbol.charCodeAt(0) + difference);
    }
  });

  console.log(textArr.join(''));
  return textArr.join('');
};

const getIncomingText = () => {
  const inputOption = isOptionalCommandPassed(passedOptions, INPUT);
  const shiftOption = passedOptions.find(({ option }) => {
    return Object.values(SHIFT).includes(option);
  });

  const outputOption = passedOptions.find(({ option }) => {
    return Object.values(OUTPUT).includes(option);
  });

  let textContent;

  if (inputOption) {
    const inputFilePath = inputOption.value;
    const outputFilePath = outputOption.value;

    new Promise((res, rej) => {
      fs.readFile(inputFilePath, 'utf-8', (err, data) => {
        if (err) {
          rej(
            'The specified file does not exist or the path is incorrect or there is no right to read file!'
          );
        } else {
          res(data);
        }
      });
    })
      .then(res => {
        console.log(res);

        return encode(res, +shiftOption.value);
      })
      .then(responce => {
        return new Promise((resolve, rej) => {
          fs.writeFile(outputFilePath, responce, (err) => {
            if (err) {
              rej('Can\'t write to this file!');
            } else {
              resolve('The file was successfully written!');
            }
          });
        });
      })
      .then(res => console.log(res))
      .catch(err => {
        throw new Error(err);
      });
  } else {
    textContent = 'A text from stdin';
  }
  console.log(textContent);

  return textContent;
};

console.log(getIncomingText());

console.log(rangeOfSymbols);
