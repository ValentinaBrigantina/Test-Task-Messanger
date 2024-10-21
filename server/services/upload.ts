import { exists, mkdir } from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import { host } from '../helpers/config'
import type { UploadsDir } from '../helpers/constants'

const createDirIfNotExists = async (dir: string) => {
  const isExists = await exists(dir)
  if (!isExists) {
    await mkdir(dir, { recursive: true })
  }
}

export const createUniqueName = (name: string) => `${Date.now()}${name}`

export const getPath = async (name: string, target: UploadsDir) => {
  const uploadFolder = `${process.cwd()}/uploads/${target}`
  await createDirIfNotExists(uploadFolder)
  return `${uploadFolder}/${name}`
}

export const getUrl = (name: string, target: UploadsDir) => `${host}/uploads/${target}/${name}`

export const upload = async (file: File, path: string) => {
  const buffer = await file.bytes()
  await writeFile(path, buffer)
}
