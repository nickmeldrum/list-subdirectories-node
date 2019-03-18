const getSubdirectories = require('../')

const { MoreArgumentsNeededError } = getSubdirectories

describe('getSubDirectories', () => {
  test('no arguments throws more arguments needed', async () => {
    expect.assertions(1)
    await expect(getSubdirectories()).rejects.toThrow(MoreArgumentsNeededError)
  })

  test('More Arguments Needed Error shows the required number required in the message', () => {
    expect.assertions(1)
    try {
      throw new MoreArgumentsNeededError(42)
    } catch (e) {
      expect(e.message).toEqual('More arguments needed. Required: (42)')
    }
  })
})
