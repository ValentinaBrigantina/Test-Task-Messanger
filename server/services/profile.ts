import { createUniqueName, getPath, getUrl, upload } from './upload'
import { db } from '../db'
import { users as usersTable } from '../db/schema/users'
import { eq } from 'drizzle-orm'
import { createHash } from './auth'
import type { UserProfile } from '../sharedTypes'
import { UploadsDir } from '../helpers/constants'

export const updatePassword = async (
  userID: number,
  newPass: string
): Promise<UserProfile> => {
  const hashPassword = await createHash(newPass)
  const [{ password, ...user }] = await update(userID, 'password', hashPassword)
  return user
}

export const uploadAvatar = async (file: File): Promise<string> => {
  const name = createUniqueName(file.name)
  const path = await getPath(name, UploadsDir.ProfileImage)
  await upload(file, path)
  return getUrl(name, UploadsDir.ProfileImage)
}

export const updateAvatar = async (
  userID: number,
  url: string
): Promise<UserProfile> => {
  const [{ password, ...user }] = await update(userID, 'avatar', url)
  return user
}

const update = (userID: number, field: string, value: unknown) =>
  db
    .update(usersTable)
    .set({ [field]: value })
    .where(eq(usersTable.id, userID))
    .returning()
