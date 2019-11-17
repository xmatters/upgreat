const chalk = require('chalk')

module.exports = new chalk.Instance({
  enabled: process.env.NODE_ENV !== 'test',
})
