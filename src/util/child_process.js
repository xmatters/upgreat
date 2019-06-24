const child_process = require('child_process')
const { promisify } = require('util')

const exec = promisify(child_process.exec)

module.exports = {
  exec,
}
