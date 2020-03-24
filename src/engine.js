const options = require('./constants/options');
const { SHIFT, INPUT, OUTPUT, ACTION } = options;
const actions = require('./constants/actions');
const {
  checkRequiredCommands,
  searchDublicates,
  matchIncomingCommand
} = require('./utils/optionValidator');

const incomingCommands = process.argv.slice(2);

const requiredCommands = [ACTION, SHIFT];

checkRequiredCommands(requiredCommands, incomingCommands);

const divideIncomingCommands = incomingCommands => {
  const dividedCommands = [];

  for (let i = 0; i < incomingCommands.length; i++) {
    const command = incomingCommands[i];
    const value = incomingCommands[i + 1];

    switch (true) {
      case matchIncomingCommand(OUTPUT, command):
        dividedCommands.push({
          option: command,
          value
        });
        break;
      case matchIncomingCommand(INPUT, command):
        dividedCommands.push({
          option: command,
          value
        });
        break;
      case matchIncomingCommand(SHIFT, command):
        dividedCommands.push({
          option: command,
          value
        });
        break;
      case matchIncomingCommand(ACTION, command):
        dividedCommands.push({
          option: command,
          value
        });
        break;
    }
  }

  return dividedCommands;
};

console.log(divideIncomingCommands(incomingCommands));

searchDublicates(options, incomingCommands);

// console.log(actions, '<===== actions');
// console.log(incomingCommands, '<===== incomingCommands');
