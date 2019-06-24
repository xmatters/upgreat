const child_process = require('../../util/child_process')

const runTests = async () => {
  return child_process.exec('yarn test')
}

module.exports = runTests
