const runBuild = require('./runBuild')

const child_process = require('../../util/child_process')

it('should exec', async () => {
  const spy = jest
    .spyOn(child_process, 'exec')
    .mockImplementationOnce(() => Promise.resolve())

  await runBuild()

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('yarn build')
})
