const options = require('./constants/options');
const { SHIFT, INPUT, OUTPUT, ACTION } = options;
const possibleActionValues = require('./constants/actions');
const {
  checkRequiredCommands,
  searchDublicates,
  matchIncomingCommand,
  isProperActionValue,
  getCommand
} = require('./utils/optionValidator');
const fs = require('fs');
const cipher = require('./tools/cipher');

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

  retrieveText(cipher(inputText, +shiftOption.value, actionOption.value))
    .then(res => console.log(res))
    .catch(err => {
      throw new Error(err);
    });
};

executeProgramm();
