import { z } from 'zod'

export const imageSchema = z
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

export type ValidImage = z.infer<typeof imageSchema>
