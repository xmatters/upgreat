const { get } = require('axios')
const semver = require('semver')

const getChangelog = require('./getChangelog')

const checkDep = async ({ name, version, dev }) => {
  // starts with ~ or ^ or 1 or more digits
  // followed by a . and 1 or more digits
  // followed by a . and 1 or more digits
  // can take some - and 1 or more digits at the end
  // ends with a digit
  // eg: ^1.22.333 || ~333.1.22 || 1.2.3-555
  const isValidVersionString = /^[~^]?\d+\.\d+\.\d+(-\d+)?$/.test(version);
  if (!isValidVersionString) {
    return {
      name,
      version,
      err: 'invalid semantic versioning',
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
