const { Command, flags } = require('@oclif/command')

const chalk = require('../../util/chalk')
const { writeFilePrettyJson, mkUpgreatDir } = require('../../util/fs')
const { readJSONFile } = require('../../util/json')
const pickDeps = require('./pickDeps')
const createPlan = require('./createPlan')

class Plan extends Command {
  async run() {
    const { flags } = this.parse(Plan)

    const packageJsonPath = 'package.json'

    this.log(`👋 hi, will read ${chalk.magenta(`${packageJsonPath}`)}`)

    let packageJson
    try {
      packageJson = await readJSONFile(packageJsonPath)
    } catch (err) {
      this.error(err.message)
    }

    const list = pickDeps(packageJson, flags)
    const { plan, missingPeers, errors } = await createPlan(
      list,
      packageJson.peerDependencies,
    )

    if (missingPeers.length) {
      this.log(`you have missing peerDependencies that you will need`)
      this.log(`  ${missingPeers}`)
    }

    if (errors.length) {
      this.log(
        `unable to retrieve version info for some packages, these will be ignored in the upgrade plan`,
      )
      this.log(errors.map(e => `  ${e.name}: ${e.err}`).join('\n'))
    }

    await mkUpgreatDir()
    await writeFilePrettyJson('./.upgreat/plan.json', plan.filter(d => d.diff))

    this.log(`🗒  wrote upgrade plan to ${chalk.magenta('.upgreat/plan.json')}`)
    this.log(`run ${chalk.cyan('upgreat up')} to start the upgrades!`)
  }
}

Plan.description = 'create the upgrade plan for all dependencies'

Plan.args = []

Plan.flags = {
  include: flags.string({
    char: 'i',
    description: 'include packages by regex',
    hidden: false,
    multiple: false,
    required: false,
  }),
  exclude: flags.string({
    char: 'x',
    description: 'exclude packages by regex',
    hidden: false,
    multiple: false,
    required: false,
  }),
  packageType: flags.string({
    char: 'p',
    description: 'limit to a specific package type',
    hidden: false,
    multiple: false,
    options: ['dependencies', 'devDependencies'],
    default: '',
    required: false,
  }),
}

module.exports = Plan
