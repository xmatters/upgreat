it('passes', () => {
  expect(1).toBe(1)
})

it('fails if ramda version = 0.25.0', () => {
  const { version } = require('./node_modules/ramda/package.json')
  expect(version).not.toBe('0.25.0')
})
