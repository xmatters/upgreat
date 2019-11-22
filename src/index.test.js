const cli = require('./')

it('should export cli', () => {
  expect(cli).toMatchSnapshot()
})
