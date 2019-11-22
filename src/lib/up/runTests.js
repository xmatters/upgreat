const child_process = require('../../util/child_process')

const runTests = async flags => {
  const cmd = flags.npm ? 'npm run' : 'yarn'
  return child_process.exec(`${cmd} ${flags.testScript}`)
}

module.exports = runTests
