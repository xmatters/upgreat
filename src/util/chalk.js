const chalk = require('chalk')

module.exports = new chalk.constructor({
  enabled: process.env.NODE_ENV !== 'test',
})
