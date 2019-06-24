const { get } = require('axios')
const { fromUrl } = require('hosted-git-info')

const getChangelog = async url => {
  const repo = fromUrl(url, { noGitPlus: true })

  if (!repo) return [null, null]

  try {
    await get(repo.file('CHANGELOG.md'))
    return [repo.https(), repo.file('CHANGELOG.md')]
  } catch (err) {
    try {
      await get(repo.file('changelog.md'))
      return [repo.https(), repo.file('changelog.md')]
    } catch (err) {
      return [repo.https(), null]
    }
  }
}

module.exports = getChangelog
