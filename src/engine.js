const options = require('./constants/options');
const {
  SHIFT,
  INPUT,
  OUTPUT,
  ACTION,
} = options;
const possibleActionValues = require('./constants/actions');
const {
  checkRequiredCommands,
  searchDublicates,
  matchIncomingCommand,
  isProperActionValue
} = require('./utils/optionValidator');

const optionsArr = [SHIFT,
INPUT,
OUTPUT,
ACTION];

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

console.log(extractIncomingCommands(optionsArr, incomingCommands));

searchDublicates(optionsArr, incomingCommands);

// console.log(actions, '<===== actions');
// console.log(incomingCommands, '<===== incomingCommands');
