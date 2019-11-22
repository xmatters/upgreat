const { Command, flags } = require('@oclif/command')
const { mapSeries } = require('bluebird')

const chalk = require('../../util/chalk')
const { writeFile } = require('../../util/fs')
const { readJSONFile } = require('../../util/json')

const runTests = require('./runTests')
const upgrade = require('./upgrade')

class Up extends Command {
  async run() {
    const { flags } = this.parse(Up)

    const path = '.upgreat/plan.json'

    let plan
    try {
      plan = await readJSONFile(path)
    } catch (err) {
      this.error(err.message)
    }

    this.log(`got plan from ${chalk.magenta(path)}`)
    this.log('running tests before starting upgrades...')

    try {
      await runTests(flags)
    } catch (err) {
      await writeFile('.upgreat/initialTest.stderr.txt', err.stderr)
      this.error('your tests need to pass before attempting the upgrade! 😒')
    }

    this.log('👍  tests are fine, starting upgrades')

    const upgrades = await mapSeries(plan, upgrade(this.log, flags))
    const errors = upgrades.filter(dep => dep.err)
    const upgraded = upgrades.filter(dep => !dep.err)

    this.log(`✅  upgraded ${upgraded.length}`)
    this.log(`❌  errors ${errors.length}`)
  }
}

Up.description = 'execute the upgrade plan'

Up.args = []

Up.flags = {
  npm: flags.boolean({
    default: false,
    description: 'use npm',
    hidden: false,
    multiple: false,
    required: false,
  }),
  testScript: flags.string({
    char: 't',
    description: 'test script to use from package.json',
    default: 'test',
    hidden: false,
    multiple: false,
    required: false,
  }),
  buildScript: flags.string({
    char: 'b',
    description: 'build script to use from package.json',
    default: 'build',
    hidden: false,
    multiple: false,
    required: false,
  }),
}

module.exports = Up
