const isDublicateOption = (option, incomingCommands) => {
  const optionsCache = {};

  console.log(option);

  incomingCommands.forEach(item => {
    if (optionsCache[item]) {
      optionsCache[item]++;
    } else {
      optionsCache[item] = 1;
    }
  });

  isThereDublication = Object.keys(optionsCache).some(item => optionsCache[item] > 1);

  console.log(optionsCache, incomingCommands.includes(option.alias) && incomingCommands.includes(option.full));
  console.log(option.alias, option.full);

  return incomingCommands.includes(option.alias) && incomingCommands.includes(option.full) || isThereDublication;
}

module.exports = {
  isDublicateOption
}
