const fs = require('node:fs/promises')
const path = require('node:path')

// Ejercicio 2
async function writeFile (filePath, data, callback) {
  try {
    await fs.writeFile(filePath, data)
    callback()
  } catch (error) {
    // If the folder does not exist, create it
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      // Now that the folder exists, try again
      writeFile(filePath, data, callback)
      return
    }
    callback(error)
  }
}

// Ejercicio 3
async function readFileAndCount (word, callback) {
  // If no word specified, return error
  if (!word) {
    callback(new Error('No se ha especificado la palabra a buscar'))
    return
  }

  const filePath = process.argv[2]
  // If no path specified, return error
  if (!filePath) {
    callback(new Error('No se ha especificado el path del archivo'))
    return
  }

  // If file does not exist, return 0
  try {
    await fs.access(filePath)
  } catch (error) {
    callback(undefined, 0)
    return
  }

  // If file exists, read it and count the number of times the word appears
  try {
    const text = await fs.readFile(filePath, 'utf-8')
    const count = text.split(word).length - 1
    callback(null, count)
  } catch (error) {
    callback(error)
  }
}

module.exports = {
  writeFile,
  readFileAndCount
}
