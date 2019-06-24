const Plan = require('./')

const fs = require('../../util/fs')
jest.mock('../../util/fs')

const createPlan = require('./createPlan')
jest.mock('./createPlan')

describe('run', () => {
  it('should error if path is wrong', async () => {
    const plan = new Plan([])

    const logSpy = jest.spyOn(plan, 'log')
    logSpy.mockImplementation(() => {})
    const errorSpy = jest.spyOn(plan, 'error')
    errorSpy.mockImplementation(err => {
      throw new Error(err)
    })
    fs.readFile.mockImplementation(() => Promise.reject())

    await expect(plan.run()).rejects.toMatchSnapshot()
  })

  it('should greet', async () => {
    const plan = new Plan([])

    const spy = jest.spyOn(plan, 'log')
    spy.mockImplementation(() => {})
    fs.readFile.mockImplementation(() => {
      return '{"something": "yes"}'
    })
    createPlan.mockImplementation(() => ({
      plan: [{ diff: 'major' }, {}],
      missingPeers: ['babel-plugin-long-name-transformer', 'lodash'],
      errors: [
        { name: 'some-pkg', err: 404 },
        { name: 'other-pkg', err: 'exotic' },
      ],
    }))
    fs.mkUpgreatDir.mockImplementation(() => Promise.resolve())
    fs.writeFilePrettyJson.mockImplementation(() => Promise.resolve())

    await plan.run()

    expect(spy.mock.calls).toMatchSnapshot()
  })
})
