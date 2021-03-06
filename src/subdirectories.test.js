const fs = require('fs-extra')
const path = require('path')
const listSubdirectories = require('../')
const { randomString, prepareTestDirectory, cleanTestDirectory } = require('./test.helpers')

describe('subdirectories', () => {
  let testPath

  beforeEach(async () => {
    testPath = await prepareTestDirectory()
  })
  afterEach(async () => {
    await cleanTestDirectory(testPath)
  })

  test('returns an array', async () => {
    expect(await listSubdirectories({ path: testPath })).toEqual([])
  })

  test('returns a subdirectory if one exists', async () => {
    await fs.ensureDir(path.join(testPath, randomString()))
    expect((await listSubdirectories({ path: testPath })).length).toEqual(1)
  })

  test('returns the full path to a subdirectory', async () => {
    const subDirectoryName = randomString()

    await fs.ensureDir(path.join(testPath, subDirectoryName))
    expect((await listSubdirectories({ path: testPath }))[0]).toEqual(
      path.join(testPath, subDirectoryName),
    )
  })

  test('returns many subdirectories if they exist', async () => {
    await fs.ensureDir(path.join(testPath, randomString()))
    await fs.ensureDir(path.join(testPath, randomString()))
    await fs.ensureDir(path.join(testPath, randomString()))
    expect((await listSubdirectories({ path: testPath })).length).toEqual(3)
  })

  test('does not return files', async () => {
    await fs.ensureDir(path.join(testPath, randomString()))
    await fs.ensureFile(path.join(testPath, randomString()))
    expect((await listSubdirectories({ path: testPath })).length).toEqual(1)
  })

  test('does not return subdirectories of subdirectories', async () => {
    const subDirectoryName = randomString()

    await fs.ensureDir(path.join(testPath, subDirectoryName))
    await fs.ensureDir(path.join(testPath, subDirectoryName, randomString()))
    expect((await listSubdirectories({ path: testPath })).length).toEqual(1)
  })

  test('throws error if directory passed in is not found', async () => {
    expect.assertions(1)
    try {
      await listSubdirectories({ path: path.join(__dirname, 'NOTADIRECTORY') })
    } catch (e) {
      expect(e.errno).toEqual(-2)
    }
  })
})
