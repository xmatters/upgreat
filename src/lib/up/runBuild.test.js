const runBuild = require('./runBuild')

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
  await runBuild({ npm: false, testScipt: 'test', buildScript: 'build' })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('yarn build')
})

it('should exec if npm and custom script', async () => {
  await runBuild({
    npm: true,
    testScript: 'customTest',
    buildScript: 'customBuild',
  })

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('npm run customBuild')
})
