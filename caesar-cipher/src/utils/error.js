const { errorChalk } = require('./chalk');

const error = (text) => {
  throw new Error(errorChalk(text));
}

module.exports = error;
