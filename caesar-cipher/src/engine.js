const fs = require('fs');
const cipher = require('./tools/cipher');
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
const { writeToStream } = require('./utils/streamUtils');

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

const extractText = action => {
  const inputOption = getCommand(passedOptions, INPUT);

  return new Promise((res, rej) => {
    if (inputOption) {
      const inputFilePath = inputOption.value;
      const readable = fs.createReadStream(inputFilePath);

      const dataArr = [];

      readable.on('data', (data) => {
        dataArr.push(data);
      });

      readable.on('end', () => {
        res(dataArr);
      })
      // fs.readFile(inputFilePath, 'utf-8', (err, data) => {
      //   if (err) {
      //     process.stderr.write(
      //       'The specified file does not exist or the path is incorrect or there are no rights to read file!\n',
      //       () => process.exit(214)
      //     );
      //   } else {
      //     res(data);
      //   }
      // });
    } else {
      console.log(`Write some text to ${action}...`);
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', data => {
        res(data);
      });
    }
  });
};

const retrieveText = textArr => {
  const outputOption = getCommand(passedOptions, OUTPUT);

  return new Promise((res, rej) => {
    if (outputOption) {
      // const chunk = 'Hello, world! '.repeat(5).concat('\n');
      const outputFilePath = outputOption.value;
      const file = fs.createWriteStream(outputFilePath, { flags: 'a' });

      // file.on('close');

      function start(n) {
        if (n === textArr.length - 1) {
          return file.end(textArr[textArr.length - 1]);
        } else {
          writeToStream(file, textArr[n], () => start(++n));
        }
      }

      start(0);

      // file.write('\n');
      // file.end();
    } else {
      process.stdout.write(text);
    }
  });
};

// --input C:/Users/Aliaksandr_Piskun/Desktop/input.txt
// -o C:/Users/Aliaksandr_Piskun/Desktop/output.txt

const executeProgramm = async () => {
  const shiftOption = getCommand(passedOptions, SHIFT);
  const actionOption = getCommand(passedOptions, ACTION);

  const inputDataArr = await extractText(actionOption.value);
  console.log(inputDataArr.length);
  const ciphred = await cipher(inputDataArr, +shiftOption.value, actionOption.value);

  console.log(ciphred.length);

  retrieveText(ciphred)
    .then(res => console.log(res))
    .catch(err => {
      throw new Error(err);
    });

  // executeProgramm();
};

executeProgramm();
