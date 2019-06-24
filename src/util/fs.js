const fs = require('fs')
const { promisify } = require('util')

const R = require('ramda')

const readFile = R.partialRight(promisify(fs.readFile), ['utf-8'])
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const prettyJson = R.partialRight(JSON.stringify, [null, 2])
const writeFilePrettyJson = (path, data) => writeFile(path, prettyJson(data))

const mkUpgreatDir = async () => {
  try {
    await mkdir('./.upgreat')
  } catch (e) {
    if (e.code !== 'EEXIST') throw e
  }
}

module.exports = {
  readFile,
  writeFile,
  writeFilePrettyJson,
  mkUpgreatDir,
}
