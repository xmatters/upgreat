const fs = require('./fs')
jest.mock('./fs')

const json = require('./json')

describe('readJSONFile', () => {
  it('should throw error if path is wrong', async () => {
    fs.readFile.mockImplementationOnce(() => Promise.reject())

    await expect(json.readJSONFile('fake.json')).rejects.toMatchSnapshot()
  })

  it('should throw error if json parse fails', async () => {
    fs.readFile.mockImplementationOnce(() => Promise.resolve('lol'))

    await expect(json.readJSONFile('notjson.txt')).rejects.toMatchSnapshot()
  })

  it('should return parsed json', async () => {
    fs.readFile.mockImplementationOnce(() => Promise.resolve('{"hello": true}'))

    await expect(json.readJSONFile('notjson.txt')).resolves.toMatchSnapshot()
  })
})
