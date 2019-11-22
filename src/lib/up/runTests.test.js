const runTests = require('./runTests')

const child_process = require('../../util/child_process')

let spy

beforeEach(() => {
  spy = jest
    .spyOn(child_process, 'exec')
    .mockImplementationOnce(() => Promise.resolve())
})

afterEach(() => {
  spy.mockRestore()
})

it('should exec', async () => {
  await runTests({ npm: false, testScript: 'test', buildScript: 'build' })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('yarn test')
})

it('should exec if npm and custom script', async () => {
  await runTests({
    npm: true,
    testScript: 'customTest',
    buildScript: 'customBuild',
  })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('npm run customTest')
})
