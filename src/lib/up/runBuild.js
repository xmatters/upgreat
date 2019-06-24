const child_process = require('../../util/child_process')

const runBuild = async () => {
  return child_process.exec('yarn build')
}

module.exports = runBuild
