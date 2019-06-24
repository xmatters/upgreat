const plan = require('./plan')
const up = require('./up')

it('exports plan', () => {
  expect(plan).toMatchSnapshot()
})

it('exports up', () => {
  expect(up).toMatchSnapshot()
})
