const checkRequiredCommands = (options, incomingCommands) => {
  const requiredCommands = options.filter(({ isRequired }) => isRequired);

  requiredCommands.forEach(command => {
    const { alias, full } = command;
    if (!(incomingCommands.includes(alias) || incomingCommands.includes(full))) {
      const commandName = full.slice(2);
      throw new Error(`Missed required command! ====> ${commandName}`);
    }
  })
};

const isDublicateOption = (option, incomingCommands) => {
  const optionsCache = {};

  incomingCommands.forEach(item => {
    if (optionsCache[item]) {
      optionsCache[item]++;
    } else {
      optionsCache[item] = 1;
    }
  });

  isThereDublication = Object.keys(optionsCache)
    .some(item => optionsCache[item] > 1);

  return incomingCommands.includes(option.alias) &&
   (incomingCommands.includes(option.full) || isThereDublication);
};

const searchDublicates = (options, incomingCommands) => {
  for (let opt of options) {
    if (isDublicateOption(opt, incomingCommands)) {
      throw new Error(`Identical options are not accepted!`);
    }
  }
}

const matchIncomingCommand = (option, command) => {
  return option.alias === command || option.full === command;
}

const isProperActionValue = (passedOptions, possibleValues, actionCommand) => {
  const actionOption = passedOptions.find(({ option }) => {
    return Object.values(actionCommand).includes(option);
  });

  const possibleActionValues = Object.values(possibleValues);

  if (!possibleActionValues.includes(actionOption.value)) {
    throw new Error(
      `Invalid action value! Possible values is:
       ${possibleActionValues[0]}/${possibleActionValues[1]}`
    );
  };
}

const isOptionalCommandPassed = (passedOptions, command) => {
  const checkOption = passedOptions.find(({ option }) => {
    return Object.values(command).includes(option);
  })

  return checkOption;
}

module.exports = {
  isDublicateOption,
  searchDublicates,
  matchIncomingCommand,
  checkRequiredCommands,
  isProperActionValue,
  isOptionalCommandPassed
}
