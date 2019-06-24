const pickDeps = require('./pickDeps')

const pkgJson = {
  dependencies: {
    p1: '1.1.1',
    p2: '2.2.2',
  },
  devDependencies: {
    p3: '3.3.3',
  },
  peerDependencies: {
    p4: '4.4.4',
  },
}

it('should pick all deps', () => {
  expect(pickDeps(pkgJson)).toMatchSnapshot()
})

it('should respect packageType', () => {
  expect(pickDeps(pkgJson, { packageType: 'dependencies' })).toMatchSnapshot()

  expect(
    pickDeps(pkgJson, { packageType: 'devDependencies' }),
  ).toMatchSnapshot()
})

it('should include by regex', () => {
  expect(pickDeps(pkgJson, { include: 'p3' })).toMatchSnapshot()

  expect(pickDeps(pkgJson, { include: 'p[12]' })).toMatchSnapshot()
})

it('should exclude by regex', () => {
  expect(pickDeps(pkgJson, { exclude: 'p3' })).toMatchSnapshot()

  expect(pickDeps(pkgJson, { exclude: 'p[12]' })).toMatchSnapshot()
})
