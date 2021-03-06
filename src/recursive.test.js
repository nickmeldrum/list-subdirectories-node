const fs = require('fs-extra')
const path = require('path')
const listSubdirectories = require('../')
const { randomString, prepareTestDirectory, cleanTestDirectory } = require('./test.helpers')

describe('recursive', () => {
  let testPath

  beforeEach(async () => {
    testPath = await prepareTestDirectory()
  })
  afterEach(async () => {
    await cleanTestDirectory(testPath)
  })

  test('when recursive option set, will return all nested subdirectories', async () => {
    const level1 = randomString()
    const anotherLevel1 = randomString()

    const level2 = randomString()
    const anotherLevel2 = randomString()

    const level3 = randomString()

    await fs.ensureDir(path.join(testPath, level1))
    await fs.ensureDir(path.join(testPath, anotherLevel1))

    await fs.ensureDir(path.join(testPath, level1, level2))
    await fs.ensureDir(path.join(testPath, level1, anotherLevel2))

    await fs.ensureDir(path.join(testPath, level1, level2, randomString()))
    await fs.ensureDir(path.join(testPath, level1, anotherLevel2, level3))

    await fs.ensureDir(path.join(testPath, level1, anotherLevel2, level3, randomString()))

    expect((await listSubdirectories({ path: testPath, recursive: true })).length).toEqual(7)
  })

  test('when maxDepth set to 1 and only 1 level of directories will return them all', async () => {
    const level1 = randomString()
    const anotherLevel1 = randomString()

    await fs.ensureDir(path.join(testPath, level1))
    await fs.ensureDir(path.join(testPath, anotherLevel1))

    expect(
      (await listSubdirectories({ path: testPath, maxDepth: 1, recursive: true })).length,
    ).toEqual(2)
  })

  test('when maxDepth set to 2, and only 2 levels of directories will return them all', async () => {
    const level1 = randomString()
    const anotherLevel1 = randomString()

    const level2 = randomString()
    const anotherLevel2 = randomString()

    await fs.ensureDir(path.join(testPath, level1))
    await fs.ensureDir(path.join(testPath, anotherLevel1))

    await fs.ensureDir(path.join(testPath, level1, level2))
    await fs.ensureDir(path.join(testPath, level1, anotherLevel2))

    expect(
      (await listSubdirectories({ path: testPath, maxDepth: 2, recursive: true })).length,
    ).toEqual(4)
  })

  test('when maxDepth set to 3, and only 3 levels of directories will return them all', async () => {
    const level1 = randomString()
    const anotherLevel1 = randomString()

    const level2 = randomString()
    const anotherLevel2 = randomString()

    await fs.ensureDir(path.join(testPath, level1))
    await fs.ensureDir(path.join(testPath, anotherLevel1))

    await fs.ensureDir(path.join(testPath, level1, level2))
    await fs.ensureDir(path.join(testPath, level1, anotherLevel2))

    await fs.ensureDir(path.join(testPath, level1, level2, randomString()))
    await fs.ensureDir(path.join(testPath, level1, anotherLevel2, randomString()))

    expect(
      (await listSubdirectories({ path: testPath, maxDepth: 3, recursive: true })).length,
    ).toEqual(6)
  })

  test('when maxDepth set to 1, and 2 levels of directories will only return directories from 1st level', async () => {
    const level1 = randomString()

    await fs.ensureDir(path.join(testPath, level1))

    await fs.ensureDir(path.join(testPath, level1, randomString()))

    expect(
      (await listSubdirectories({ path: testPath, maxDepth: 1, recursive: true })).length,
    ).toEqual(1)
  })

  test('when maxDepth set to 2, and 4 levels of directories will only return directories from 1st and 2nd levels', async () => {
    const level1 = randomString()
    const anotherLevel1 = randomString()

    const level2 = randomString()
    const anotherLevel2 = randomString()

    const level3 = randomString()
    const anotherLevel3 = randomString()

    await fs.ensureDir(path.join(testPath, level1))
    await fs.ensureDir(path.join(testPath, anotherLevel1))

    await fs.ensureDir(path.join(testPath, level1, level2, level3, randomString()))
    await fs.ensureDir(path.join(testPath, level1, anotherLevel2, anotherLevel3, randomString()))

    expect(
      (await listSubdirectories({ path: testPath, maxDepth: 2, recursive: true })).length,
    ).toEqual(4)
  })

  test('filter is applied to all levels when scanning recursively', async () => {
    await fs.ensureDir(path.join(testPath, 'foo-dir-level1'))
    await fs.ensureDir(path.join(testPath, 'bar-dir-level1'))

    await fs.ensureDir(path.join(testPath, 'foo-dir-level1', 'foo-dir-level2'))
    await fs.ensureDir(path.join(testPath, 'foo-dir-level1', 'bar-dir-level2'))

    await fs.ensureDir(path.join(testPath, 'foo-dir-level1', 'bar-dir-level2', randomString()))

    await fs.ensureDir(path.join(testPath, 'bar-dir-level1', 'foo-dir-level2'))
    await fs.ensureDir(path.join(testPath, 'bar-dir-level1', randomString()))

    expect(
      (await listSubdirectories({ path: testPath, filter: '^foo.*', recursive: true })).length,
    ).toEqual(2)
  })
})
