// accepts short alias like a first argument, full option's name like a second:
// e.g. optionCreator('-s', '--shift');
const optionCreator = require('../utils/optionCreator');

const SHIFT = optionCreator('-s', '--shift');
const INPUT = optionCreator('-i', '--input');
const OUTPUT = optionCreator('-o', '--output');
const ACTION = optionCreator('-a', '--action');

module.exports = {
  SHIFT,
  INPUT,
  OUTPUT,
  ACTION,
};
