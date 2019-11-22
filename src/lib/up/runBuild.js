const child_process = require('../../util/child_process')

const runBuild = async flags => {
  const cmd = flags.npm ? 'npm run' : 'yarn'
  return child_process.exec(`${cmd} ${flags.buildScript}`)
}

module.exports = runBuild
