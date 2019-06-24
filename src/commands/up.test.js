const Plan = require('./plan')
const Up = require('./up')

let cwd

beforeEach(() => {
  cwd = process.cwd()
  process.chdir('./test/fake-repo')
})

afterEach(() => {
  process.chdir(cwd)
})

xit('should upgrade', async () => {
  const plan = new Plan()
  const planLogSpy = jest.spyOn(plan, 'log').mockImplementation(jest.fn())
  // await plan.run()

  const up = new Up()
  const upLogSpy = jest.spyOn(up, 'log').mockImplementation(jest.fn())
  // const upErrSpy = jest.spyOn(up, 'error').mockImplementation(jest.fn())
  // await up.run()

  expect(planLogSpy.mock.calls).toMatchSnapshot()
  expect(upLogSpy.mock.calls).toMatchSnapshot()
}, 60000)
