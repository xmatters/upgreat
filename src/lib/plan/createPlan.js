const { map } = require('bluebird')
const R = require('ramda')

const topologicalSort = require('./topologicalSort')
const checkDep = require('./checkDep')

const diffOrder = [
  null,
  'prepatch',
  'patch',
  'preminor',
  'minor',
  'premajor',
  'major',
  'prerelease',
]

const createPlan = async function(list = [], peerDependencies = {}) {
  const errors = []
  const upgrades = (await map(list, checkDep))
    .filter(d => {
      if (d.err) errors.push(d)
      return !d.err
    })
    .sort((a, b) => diffOrder.indexOf(a.diff) - diffOrder.indexOf(b.diff))

  const peers = R.pipe(
    R.map(d => d.peers),
    R.flatten,
    R.uniq,
  )(upgrades)

  const missingPeers = peers.filter(
    d =>
      !upgrades.find(dd => dd.name === d) &&
      !Object.keys(peerDependencies).find(dd => dd === d),
  )

  const plan = topologicalSort(
    upgrades.map(dep => ({
      ...dep,
      peers: dep.peers.filter(peer => !missingPeers.includes(peer)),
    })),
  )

  return { plan, missingPeers, errors }
}

module.exports = createPlan
