const runTests = require('./runTests')

const child_process = require('../../util/child_process')

it('should exec', async () => {
  const spy = jest
    .spyOn(child_process, 'exec')
    .mockImplementationOnce(() => Promise.resolve())

  await runTests()

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('yarn test')
})
