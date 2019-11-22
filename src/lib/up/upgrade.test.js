const child_process = require('../../util/child_process')
jest.mock('../../util/child_process')
const fs = require('../../util/fs')
jest.mock('../../util/fs')
const runTests = require('./runTests')
jest.mock('./runTests')
const runBuild = require('./runBuild')
jest.mock('./runBuild')

const upgrade = require('./upgrade')

const mockDep = {
  name: 'dep',
  version: '1.1.1',
  targetVersion: '2.2.2',
  diff: 'major',
}

//
;[true, false].map(isNpm => {
  describe(`${isNpm ? 'npm' : 'yarn'}`, () => {
    let upgradeFn
    const log = jest.fn()

    beforeEach(() => {
      log.mockClear()
      child_process.exec.mockClear()
      upgradeFn = upgrade(log, {
        npm: isNpm,
        testScipt: 'test',
        buildScript: 'build',
      })
    })

    it(`should return null if upgrade fails`, async () => {
      child_process.exec.mockImplementationOnce(() => Promise.reject())

      const ret = await upgradeFn(mockDep)

      expect(ret).toMatchSnapshot()
      expect(log.mock.calls).toMatchSnapshot()
    })

    it(`should runTests if not dev dep`, async () => {
      child_process.exec.mockImplementationOnce(() => Promise.resolve())
      runTests.mockImplementationOnce(() => Promise.resolve())

      const ret = await upgradeFn(mockDep)

      expect(ret).toMatchSnapshot()
      expect(log.mock.calls).toMatchSnapshot()
    })

    it(`${isNpm ? 'npm' : 'yarn'}: should runBuild if dev dep`, async () => {
      child_process.exec.mockImplementationOnce(() => Promise.resolve())
      runBuild.mockImplementationOnce(() => Promise.resolve())

      const ret = await upgradeFn({ ...mockDep, dev: true })

      expect(ret).toMatchSnapshot()
      expect(log.mock.calls).toMatchSnapshot()
    })

    it(`should write test error to file and roll back if test fails`, async () => {
      child_process.exec.mockImplementation(() => Promise.resolve())
      runBuild.mockImplementationOnce(() =>
        Promise.reject({
          stderr: 'stderr string',
        }),
      )

      const ret = await upgradeFn({ ...mockDep, dev: true })

      expect(ret).toMatchSnapshot()
      expect(log.mock.calls).toMatchSnapshot()
      expect(child_process.exec.mock.calls).toMatchSnapshot()
    })

    it(`should write test error to file and error out if rollback fails`, async () => {
      child_process.exec.mockImplementationOnce(() => Promise.resolve())
      child_process.exec.mockImplementationOnce(() =>
        Promise.reject({
          stderr: 'exec stderr',
        }),
      )
      runBuild.mockImplementationOnce(() =>
        Promise.reject({
          stderr: 'stderr string',
        }),
      )

      const ret = await upgradeFn({ ...mockDep, dev: true })

      expect(ret).toMatchSnapshot()
      expect(log.mock.calls).toMatchSnapshot()
      expect(child_process.exec.mock.calls).toMatchSnapshot()
    })
  })
})
