const options = require('./constants/options');
const { SHIFT, INPUT, OUTPUT, ACTION } = options;
const possibleActionValues = require('./constants/actions');
const { DECODE, ENCODE } = possibleActionValues;
const {
  checkRequiredCommands,
  searchDublicates,
  matchIncomingCommand,
  isProperActionValue,
  getCommand
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

  console.log(rangeOfSymbols.length);
  textArr.forEach((symbol, index) => {
    if (rangeOfSymbols.includes(symbol.toLowerCase())) {
      const indexOfSymbol = rangeOfSymbols.indexOf(symbol.toLowerCase());

      const overflow = (indexOfSymbol + shift) % rangeOfSymbols.length;

      const codeOfEncodedSymbol = rangeOfSymbols[overflow].charCodeAt(0);
      const difference = codeOfEncodedSymbol - symbol.toLowerCase().charCodeAt(0);

      textArr[index] = String.fromCharCode(symbol.charCodeAt(0) + difference);
    }
  });

  return textArr.join('');
};
// Content from my desktop (AMAZING!!!) z
//Dpoufou gspn nz eftlupq (BNBAJOH!!!) a
const decode = (text, shift) => {
  const textArr = text.split('');

  textArr.forEach((symbol, index) => {
    if (rangeOfSymbols.includes(symbol.toLowerCase())) {
      const indexOfSymbol = rangeOfSymbols.indexOf(symbol.toLowerCase());


      let indexOfDecodedSymbol = indexOfSymbol - shift;

      if (shift > rangeOfSymbols.length) {
        indexOfDecodedSymbol = indexOfSymbol - shift % rangeOfSymbols.length;
      }

      if (indexOfDecodedSymbol < 0) {
        indexOfDecodedSymbol = rangeOfSymbols.length - Math.abs(indexOfDecodedSymbol);
      }

      console.log(symbol, indexOfDecodedSymbol, 'indexOfDecodedSymbol', rangeOfSymbols[indexOfDecodedSymbol]);

      const codeOfDecodedSymbol = rangeOfSymbols[indexOfDecodedSymbol].charCodeAt(0);
      const difference = symbol.toLowerCase().charCodeAt(0) - codeOfDecodedSymbol;

      textArr[index] = String.fromCharCode(symbol.charCodeAt(0) - difference);
    }
  });

  return textArr.join('');
}

const extractText = () => {
  const inputOption = getCommand(passedOptions, INPUT);

  return new Promise((res, rej) => {
    if (inputOption) {
      const inputFilePath = inputOption.value;
      fs.readFile(inputFilePath, 'utf-8', (err, data) => {
        if (err) {
          rej(
            'The specified file does not exist or the path is incorrect or there is no right to read file!'
          );
        } else {
          res(data);
        }
      });
    } else {
      console.log('Write some text to encode or decode...');
      process.stdin.setEncoding('utf8');
      process.stdin.on('readable', () => {
        res(process.stdin.read());
      });
    }
  });
};

const retrieveText = text => {
  const outputOption = getCommand(passedOptions, OUTPUT);

  return new Promise((res, rej) => {
    if (outputOption) {
      const textArr = text.split(' ');
      const outputFilePath = outputOption.value;
      const file = fs.createWriteStream(outputFilePath);

      for (let i = 0; i < textArr.length; i++) {
        file.write(`${textArr[i]} `);
      }

      file.end();
    } else {
      process.stdout.write(text);
      res('The output to stdout!');
    }
  });
};

// --input C:/Users/Aliaksandr_Piskun/Desktop/input.txt
// -o C:/Users/Aliaksandr_Piskun/Desktop/output.txt

const executeProgramm = async () => {
  const inputText = await extractText();

  const shiftOption = getCommand(passedOptions, SHIFT);
  const actionOption = getCommand(passedOptions, ACTION);

  let operation;

  if (actionOption.value === ENCODE) {
    operation = encode;
  } else if (actionOption.value === DECODE) {
    operation = decode;
  }

  await retrieveText(operation(inputText, +shiftOption.value))
    .then(res => console.log(res))
    .catch(err => {
      throw new Error(err);
    });
};

executeProgramm();
