const axios = require('axios')
jest.mock('axios')

const getChangelog = require('./getChangelog')
jest.mock('./getChangelog')

const checkDep = require('./checkDep')

it('should return if unrecognizable semVer', async () => {
  await expect(
    checkDep({
      name: 'some-exotic',
      version: 'file://../../hard/path',
      dev: false,
    }),
  ).resolves.toMatchSnapshot()
})

it('should return error if get npm fails', async () => {
  axios.get.mockImplementationOnce(() =>
    Promise.reject({
      response: {
        status: 404,
      },
    }),
  )

  await expect(
    checkDep({
      name: '404-pkg',
      version: '3.4.5',
    }),
  ).resolves.toMatchSnapshot()
})

it('should return error if package is unpublished', async () => {
  axios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        time: {
          unpublished: {
            time: 'some date',
          },
        },
      },
    }),
  )

  await expect(
    checkDep({
      name: 'unpublished-pkg',
      version: '3.4.5',
    }),
  ).resolves.toMatchSnapshot()
})

it('should return dependency details if no errors', async () => {
  axios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        versions: {
          '1.2.3': {},
          '1.2.4': { version: '1.2.4' },
          '2.0.0': { version: '2.0.0' },
        },
        'dist-tags': {
          latest: '2.0.0',
        },
        repository: {
          url: 'repo-url.com',
        },
        time: {},
      },
    }),
  )
  getChangelog.mockImplementationOnce(() =>
    Promise.resolve([
      'http://readme.address.here',
      'http://changelog.address.here',
    ]),
  )

  await expect(
    checkDep({
      name: 'my-pkg',
      version: '^1.2.3',
      dev: true,
    }),
  ).resolves.toMatchSnapshot()
})

it('should return dependency details if no repo url', async () => {
  axios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        versions: {
          '1.2.3': {},
          '1.2.4': { version: '1.2.4' },
          '2.0.0': { version: '2.0.0' },
        },
        'dist-tags': {
          latest: '2.0.0',
        },
        time: {},
      },
    }),
  )
  getChangelog.mockImplementationOnce(() =>
    Promise.resolve([
      'http://readme.address.here',
      'http://changelog.address.here',
    ]),
  )

  await expect(
    checkDep({
      name: 'my-pkg',
      version: '^1.2.3',
      dev: true,
    }),
  ).resolves.toMatchSnapshot()
})
