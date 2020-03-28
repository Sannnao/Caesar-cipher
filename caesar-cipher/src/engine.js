const options = require('./constants/options');
const { SHIFT, INPUT, OUTPUT, ACTION } = options;
const optionsArr = [SHIFT, INPUT, OUTPUT, ACTION];
const possibleActionValues = require('./constants/actions');
const {
  checkRequiredCommands,
  searchDublicates,
  isProperActionValue,
  extractIncomingCommands
} = require('./utils/optionValidator');
const {
  extractText,
  transformText,
  retrieveText,
} = require('./utils/streams');

const incomingCommands = process.argv.slice(2);
checkRequiredCommands(optionsArr, incomingCommands);
const passedOptions = extractIncomingCommands(optionsArr, incomingCommands);
isProperActionValue(passedOptions, possibleActionValues, ACTION);
searchDublicates(optionsArr, incomingCommands);

const readable = extractText(passedOptions);
const transform = transformText(passedOptions);
const writable = retrieveText(passedOptions);

readable.pipe(transform).pipe(writable);
