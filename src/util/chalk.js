const chalk = require('chalk')

module.exports = new chalk.Instance({
  level: process.env.NODE_ENV !== 'test' ? 3 : 0,
})
