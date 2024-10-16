import type { MessageSchemaInsert, MessageSchemaSelect } from './db/schema/messages'
import { insertUserSchema, selectUserSchema } from './db/schema/users'
import { z } from 'zod'

export const authUserData = insertUserSchema.pick({
  name: true,
  password: true,
})
export type AuthSchema = z.infer<typeof authUserData>

export const dataUpdatePassword = z.object({
  newPassword: z.string().min(2).max(20),
  currentPassword: z.string().min(2).max(20),
})
export type DataUpdatePassword = z.infer<typeof dataUpdatePassword>

export type JwtToken = {
  token: string
}

const userProfile = selectUserSchema.pick({
  id: true,
  name: true,
  avatar: true,
  role: true,
})
export type UserProfile = z.infer<typeof userProfile>

const payloadData = insertUserSchema.pick({
    id: true,
    name: true,
  })
export type PayloadUserData = z.infer<typeof payloadData>

export const fileSchema = z
.instanceof(File)
.refine(
  (file) => {
    return (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/svg'
    )
  },
  { message: 'File must be in JPEG, PNG, GIF or SVG format' }
)
.refine(
  (file) => {
    const maxFileSize = 5 * 1024 * 1024
    return file.size <= maxFileSize
  },
  { message: 'File size must not exceed 5 MB' }
)
export type ValidFile = z.infer<typeof fileSchema>

export type MessageSchema = Omit<MessageSchemaInsert, 'authorID'> & {
  authorID: UserProfile
}
