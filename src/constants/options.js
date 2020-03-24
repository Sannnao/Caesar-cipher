// accepts short alias like a first argument, full option's name like a second, is required like a third:
// e.g. optionCreator('-s', '--shift', true);
const optionCreator = require('../utils/optionCreator');

const SHIFT = optionCreator('-s', '--shift', true);
const INPUT = optionCreator('-i', '--input');
const OUTPUT = optionCreator('-o', '--output');
const ACTION = optionCreator('-a', '--action', true);

module.exports = {
  SHIFT,
  INPUT,
  OUTPUT,
  ACTION,
};
