import { z } from 'zod';

export const messageFormSchema = z.object({
  text: z.string().nullable(),
  image: z.instanceof(File).nullable(),
}).refine((data) => data.text?.trim() || data.image, {
  message: "message is empty",
});