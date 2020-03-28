const fs = require('fs');
const stream = require('stream');
const { errorChalk, instructionChalk } = require('./chalk');
const cipher = require('../tools/cipher');
const { getCommand } = require('./optionValidator');
const { SHIFT, INPUT, OUTPUT, ACTION } = require('../constants/options');

const extractText = (passedOptions) => {
  const inputOption = getCommand(passedOptions, INPUT);
  const actionOption = getCommand(passedOptions, ACTION);

  if (inputOption) {
    const inputFilePath = inputOption.value;

    return new Promise((res, rej) => {
      fs.access(inputFilePath, (err) => {
        if (err) {
          process.stderr.write(errorChalk(`The specified path: "${inputFilePath}" is incorrect or there are no rights to read this file!!\n`));
          process.exit(453);
        }

        res(fs.createReadStream(inputFilePath));
      })
    });
  } else {
    console.log(instructionChalk(`Write some text to ${actionOption.value}...`));
    return process.stdin;
  }
};

const transformText = (passedOptions) => {
  const shiftOption = getCommand(passedOptions, SHIFT);
  const actionOption = getCommand(passedOptions, ACTION);

  class CipherTransformer extends stream.Transform {
    _transform(data, encoding, callback) {
      const ciphred = cipher(data, +shiftOption.value, actionOption.value);
      this.push(ciphred);
      callback();
    }
  }

  return new CipherTransformer();
};

const retrieveText = (passedOptions) => {
  const outputOption = getCommand(passedOptions, OUTPUT);
  if (outputOption) {
    const outputFilePath = outputOption.value;

    return new Promise((res, rej) => {
      fs.access(outputFilePath, (err) => {
        if (err) {
          process.stderr.write(errorChalk(`The specified path: "${outputFilePath}" is incorrect or there are no rights to write to this file!!\n`));
          process.exit(453);
        }

        res(fs.createWriteStream(outputFilePath, { flags: 'a' }));
      })
    })
  } else {
    return process.stdout;
  }
};

module.exports = {
  extractText,
  transformText,
  retrieveText
};
