const { Command } = require('@oclif/command')
const { mapSeries } = require('bluebird')

const chalk = require('../../util/chalk')
const { writeFile } = require('../../util/fs')
const { readJSONFile } = require('../../util/json')

const runTests = require('./runTests')
const upgrade = require('./upgrade')

class Up extends Command {
  async run() {
    // const {
    //   args: { path },
    // } = this.parse(Up)

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
      await runTests()
    } catch (err) {
      await writeFile('.upgreat/initialTest.stderr.txt', err.stderr)
      this.error('your tests need to pass before attempting the upgrade! 😒')
    }

    this.log('👍  tests are fine, starting upgrades')

    const upgrades = await mapSeries(plan, upgrade(this.log))
    const errors = upgrades.filter(dep => dep.err)
    const upgraded = upgrades.filter(dep => !dep.err)

    this.log(`✅  upgraded ${upgraded.length}`)
    this.log(`❌  errors ${errors.length}`)
  }
}

Up.description = 'execute the upgrade plan'

Up.args = [
  // {
  //   name: 'path',
  //   required: true,
  //   description: 'plan path',
  //   default: '.upgreat/plan.json',
  // },
]

Up.flags = {}

module.exports = Up
