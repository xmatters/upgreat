const axios = require('axios')
jest.mock('axios')

const getChangelog = require('./getChangelog')

it('should return null if repo url cant be resolved', async () => {
  await expect(getChangelog('')).resolves.toMatchSnapshot()
})

it('should return CHANGELOG.md url if it exists', async () => {
  axios.get.mockImplementationOnce(() => Promise.resolve())

  await expect(
    getChangelog('https://github.com/facebook/jest'),
  ).resolves.toMatchSnapshot()
})

it('should return changelog.md url if it exists', async () => {
  axios.get.mockImplementationOnce(() => Promise.reject())
  axios.get.mockImplementationOnce(() => Promise.resolve())

  await expect(
    getChangelog('https://github.com/facebook/jest'),
  ).resolves.toMatchSnapshot()
})

it('should return null if changelog not found', async () => {
  axios.get.mockImplementation(() => Promise.reject())

  await expect(
    getChangelog('https://github.com/facebook/jest'),
  ).resolves.toMatchSnapshot()
})
