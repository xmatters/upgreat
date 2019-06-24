const createPlan = require('./createPlan')

const bluebird = require('bluebird')
jest.mock('bluebird')

it('should return {plan, missingPeers, errors}', async () => {
  bluebird.map.mockImplementationOnce(() =>
    Promise.resolve([
      {
        name: '404-pkg',
        err: 404,
        peers: [],
      },
      {
        name: 'p1',
        diff: 'minor',
        peers: ['p2'],
      },
      {
        name: 'p2',
        diff: 'major',
        peers: ['nonMissingPeer'],
      },
      {
        name: 'p3',
        diff: 'patch',
        peers: ['p2', 'missingPeer'],
      },
      {
        name: 'nonMissingPeer',
        diff: null,
        peers: [],
      },
    ]),
  )

  await expect(
    createPlan(
      [
        { name: '404-pkg', version: '4.0.4' },
        { name: 'p1', version: '1.1.1' },
        { name: 'p2', version: '2.2.2' },
        { name: 'p3', version: '3.3.3' },
      ],
      {
        nonMissingPeer: '4.4.4',
      },
    ),
  ).resolves.toMatchSnapshot()
})

it('should work with no args', async () => {
  bluebird.map.mockImplementationOnce(() => Promise.resolve([]))

  await expect(createPlan()).resolves.toMatchSnapshot()
})
