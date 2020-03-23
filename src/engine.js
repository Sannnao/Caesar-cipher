const options = require('./constants/options');
const { SHIFT, INPUT, OUTPUT, ACTION } = options;
const actions = require('./constants/actions');
const { isDublicateOption } = require('./utils/optionValidator');

console.log(options);

const incomingCommands = process.argv.slice(2);

for (let opt in options) {
  const option = options[opt];
  console.log(options[opt]);
  if (isDublicateOption(option, incomingCommands)) {
    throw new Error(`Identical options are not accepted!`);
  }
}

// if () {
//   throw new Error('Missed required options!');
// };

console.log(actions, '<===== actions');
console.log(incomingCommands, '<===== incomingCommands');
