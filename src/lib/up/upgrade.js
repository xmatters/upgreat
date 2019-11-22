const chalk = require('../../util/chalk')
const { exec } = require('../../util/child_process')
const { writeFile } = require('../../util/fs')
const runTests = require('./runTests')
const runBuild = require('./runBuild')

const diffColor = {
  prepatch: chalk.green,
  patch: chalk.green,
  preminor: chalk.yellow,
  minor: chalk.yellow,
  premajor: chalk.red,
  major: chalk.red,
  prerelease: chalk.red,
}

const upgrade = (log, flags) => async dep => {
  log(
    `  - ${dep.name}: ${dep.version} -> ${dep.targetVersion} (${diffColor[
      dep.diff
    ](dep.diff)})`,
  )

  const upgradeCmd = flags.npm ? 'npm install' : 'yarn upgrade'

  try {
    await exec(`${upgradeCmd} ${dep.name}@${dep.targetVersion}`)
  } catch (e) {
    log('    failed upgrade')
    return null
  }

  try {
    if (dep.dev) {
      log('      devDependency, running build')
      await runBuild(flags)
    } else {
      log('      dependency, running tests')
      await runTests(flags)
    }
    return dep
  } catch (testErr) {
    const errlogPath = `.upgreat/${dep.name}@${dep.version}->${dep.targetVersion}.txt`

    log(
      `      tests/build failed after upgrade, rolling back.. (failure details in ${chalk.magenta(
        errlogPath,
      )})`,
    )

    await writeFile(errlogPath, testErr.stderr)

    try {
      await exec(`${upgradeCmd} ${dep.name}@${dep.version}`)
      return { ...dep, err: testErr }
    } catch (rollbackErr) {
      log('      failed rolling back!')
      return { ...dep, err: rollbackErr }
    }
  }
}

module.exports = upgrade
