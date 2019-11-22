const fs = require('../../util/fs')
jest.mock('../../util/fs')
const json = require('../../util/json')
jest.mock('../../util/json')
const runTests = require('./runTests')
jest.mock('./runTests')
const upgrade = require('./upgrade')
jest.mock('./upgrade')

const Up = require('./')

describe('run', () => {
  it('should fail if plan cannot be read', async () => {
    json.readJSONFile.mockImplementationOnce(() =>
      Promise.reject(new Error('the message')),
    )

    const up = new Up([])

    await expect(up.run()).rejects.toMatchSnapshot()
    expect(json.readJSONFile.mock.calls).toMatchSnapshot()
  })

  it('should fail if initial tests dont pass', async () => {
    json.readJSONFile.mockImplementationOnce(() => Promise.resolve())
    runTests.mockImplementationOnce(() =>
      Promise.reject({
        stderr: 'stderr text',
      }),
    )

    const up = new Up([])
    const spy = jest.spyOn(up, 'log')
    spy.mockImplementation(() => {})

    await expect(up.run()).rejects.toMatchSnapshot()
    expect(spy.mock.calls).toMatchSnapshot()
  })

  it('should do upgrades in order', async () => {
    json.readJSONFile.mockImplementationOnce(() =>
      Promise.resolve([{ name: 'p1' }, { name: 'p2' }, { name: 'p3' }]),
    )
    runTests.mockImplementationOnce(() => Promise.resolve())
    const upgradeFn = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          name: 'p1',
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          name: 'p2',
          err: 'some err',
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          name: 'p3',
        }),
      )
    upgrade.mockImplementationOnce(() => upgradeFn)

    const up = new Up([])
    const spy = jest.spyOn(up, 'log')
    spy.mockImplementation(() => {})

    await up.run()

    expect(spy.mock.calls).toMatchSnapshot()
  })
})
