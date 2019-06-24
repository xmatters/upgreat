const chalk = require('./chalk')
const { readFile } = require('./fs')

const readJSONFile = async path => {
  let file
  try {
    file = await readFile(path)
  } catch (err) {
    throw new Error(
      `could not read ${chalk.magenta(path)}, is the repo path correct?`,
    )
  }

  try {
    return JSON.parse(file)
  } catch (err) {
    throw new Error(
      `could not parse ${chalk.magenta(path)}, is it a valid JSON file?`,
    )
  }
}

module.exports = {
  readJSONFile,
}
