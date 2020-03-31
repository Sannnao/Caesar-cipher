const options = require('./constants/options');
const { pipeline } = require('stream');
const { SHIFT, INPUT, OUTPUT, ACTION } = options;
const optionsArr = [SHIFT, INPUT, OUTPUT, ACTION];
const {
  checkRequiredCommands,
  searchDublicates,
  isProperActionValue,
  isProperShiftValue,
  extractIncomingCommands
} = require('./utils/optionValidator');
const {
  extractText,
  transformText,
  retrieveText,
} = require('./utils/streams');

const incomingCommands = process.argv.slice(2);
checkRequiredCommands(optionsArr, incomingCommands);
searchDublicates(optionsArr, incomingCommands);
const passedOptions = extractIncomingCommands(optionsArr, incomingCommands);
isProperActionValue(passedOptions);
isProperShiftValue(passedOptions);

async function executeProgramm() {
  const readable = await extractText(passedOptions);
  const transform = transformText(passedOptions);
  const writable = await retrieveText(passedOptions);

  pipeline(
    readable,
    transform,
    writable,
    (err) => {
      if (err) {
        console.error('Ciphering failed!', err);
      } else {
        console.log('Ciphering succeeded!');
      }
    }
  );
}

executeProgramm();
