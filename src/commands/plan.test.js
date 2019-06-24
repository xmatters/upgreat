const fs = require('../util/fs')
jest.mock('../util/fs')
const { readFile } = jest.requireActual('../util/fs')

const Plan = require('./plan')

beforeEach(() => {
  jest.resetAllMocks()
})

xit('should handle simple stuff', async () => {
  fs.writeFilePrettyJson.mockImplementationOnce(() => Promise.resolve())
  fs.mkUpgreatDir.mockImplementationOnce(() => Promise.resolve())
  fs.readFile.mockImplementationOnce(readFile)

  const p = new Plan()
  const spy = jest.spyOn(p, 'log').mockImplementation(jest.fn())

  await p.run()

  expect(fs.mkUpgreatDir.mock.calls).toMatchSnapshot()
  expect(fs.writeFilePrettyJson.mock.calls).toMatchSnapshot()
  expect(spy.mock.calls).toMatchSnapshot()
})

xit('should handle complex stuff', async () => {
  fs.writeFilePrettyJson.mockImplementationOnce(() => Promise.resolve())
  fs.mkUpgreatDir.mockImplementationOnce(() => Promise.resolve())
  fs.readFile.mockImplementationOnce(readFile)

  const p = new Plan()
  const spy = jest.spyOn(p, 'log').mockImplementation(jest.fn())

  await p.run()

  expect(fs.mkUpgreatDir.mock.calls).toMatchSnapshot()
  expect(fs.writeFilePrettyJson.mock.calls).toMatchSnapshot()
  expect(spy.mock.calls).toMatchSnapshot()
})
