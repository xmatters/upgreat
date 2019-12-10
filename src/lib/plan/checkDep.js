const { get } = require('axios')
const semver = require('semver')

const getChangelog = require('./getChangelog')

const checkDep = async ({ name, version, dev }) => {
  if (version.startsWith('file:')) {
    return {
      name,
      version,
      err: 'exotic',
      peers: [],
    }
  }

  let resp

  try {
    resp = await get(`https://registry.npmjs.org/${name}`)
  } catch (err) {
    return {
      name,
      version,
      err: err.response.status,
      peers: [],
    }
  }

  const { data } = resp

  if (data.time.unpublished) {
    return {
      name,
      version,
      err: `unpublished at ${data.time.unpublished.time}`,
      peers: [],
    }
  }

  const versions = Object.keys(data.versions)
  const maxSatisfying = semver.maxSatisfying(
    versions,
    semver.validRange(version),
  )
  const current = data.versions[maxSatisfying]
  const latest = data.versions[data['dist-tags'].latest]
  let repo, changelog
  if (data.repository && data.repository.url) {
    ;[repo, changelog] = await getChangelog(data.repository.url)
  }

  return {
    name,
    version: current.version,
    peers: Object.keys(latest.peerDependencies || {}),
    diff: semver.diff(current.version, latest.version),
    targetVersion: latest.version,
    repo,
    changelog,
    dev,
  }
}

module.exports = checkDep
