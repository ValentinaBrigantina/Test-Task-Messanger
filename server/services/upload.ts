import { exists, mkdir } from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import { host } from '../helpers/config'

const createDirIfNotExists = async (dir: string) => {
  const isExists = await exists(dir)
  if (!isExists) {
    await mkdir(dir)
  }
}

export const createUniqueName = (name: string) => `${Date.now()}${name}`

export const getPath = async (name: string) => {
  const uploadFolder = `${process.cwd()}/uploads/`
  await createDirIfNotExists(uploadFolder)
  return `${uploadFolder}/${name}`
}

export const getUrl = (name: string) => `${host}/uploads/${name}`

export const upload = async (file: File, path: string) => {
  const buffer = await file.bytes()
  await writeFile(path, buffer)
}
