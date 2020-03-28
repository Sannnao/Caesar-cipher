const fs = require('fs');
const stream = require('stream');
const cipher = require('../tools/cipher');
const { getCommand } = require('./optionValidator');
const { SHIFT, INPUT, OUTPUT, ACTION } = require('../constants/options');

const extractText = (passedOptions) => {
  const inputOption = getCommand(passedOptions, INPUT);
  const actionOption = getCommand(passedOptions, ACTION);

  if (inputOption) {
    const inputFilePath = inputOption.value;
    return fs.createReadStream(inputFilePath);
  } else {
    console.log(`Write some text to ${actionOption.value}...`);
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
    const file = fs.createWriteStream(outputFilePath, { flags: 'a' });
    return file;
  } else {
    return process.stdout;
  }
};

module.exports = {
  extractText,
  transformText,
  retrieveText
};
