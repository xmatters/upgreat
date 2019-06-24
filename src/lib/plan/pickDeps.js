const R = require('ramda')

const mapDeps = (dev = false) =>
  R.pipe(
    R.toPairs,
    R.map(([name, version]) => ({
      name,
      version,
      dev,
    })),
  )

const pickDeps = function(packageJson, { include, exclude, packageType } = {}) {
  let list = []

  if (packageType === 'dependencies') {
    list = [
      ...mapDeps()(packageJson.dependencies),
      ...mapDeps()(packageJson.peerDependencies),
    ]
  } else if (packageType === 'devDependencies') {
    list = [
      ...mapDeps(true)(packageJson.devDependencies),
      ...mapDeps()(packageJson.peerDependencies),
    ]
  } else {
    list = [
      ...mapDeps()(packageJson.dependencies),
      ...mapDeps(true)(packageJson.devDependencies),
      ...mapDeps()(packageJson.peerDependencies),
    ]
  }

  if (include) {
    const includeRegexp = new RegExp(include)
    list = list.filter(dep => includeRegexp.test(dep.name))
  }

  if (exclude) {
    const excludeRegexp = new RegExp(exclude)
    list = list.filter(dep => !excludeRegexp.test(dep.name))
  }

  return list
}

module.exports = pickDeps
