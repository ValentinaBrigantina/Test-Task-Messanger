import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { IoIosAttach } from 'react-icons/io'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { sendImageInMessage, userQueryOptions } from '@/lib/api'
import { WsTextDataFromClient } from '@server/sharedTypes'
import { MessageType, WsAction } from '@server/helpers/constants'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { messageFormSchema } from '@/utils/customValidation/messageFormSchema'
import { imageSchema } from '@server/helpers/customValidation/imageSchema'

type FormData = {
  text: string | undefined
  image: File | null
}

export function SendMessageForm() {
  const { data: userData } = useQuery(userQueryOptions)
  const { isConnected, send } = useWebSocket()
  const isWsReady = isConnected()

  const [inputFile, setInputFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const form = useForm<FormData>({
    defaultValues: {
      text: '',
      image: null,
    },
    onSubmit: async ({ value }) => {
      const parsedResult = messageFormSchema.safeParse(value)
      if (!parsedResult.success) {
        return
      }

      if (isWsReady && userData) {
        const messageData: WsTextDataFromClient = {
          eventType: WsAction.UpdateChat,
          message: {
            text: value.text,
            type: MessageType.Text,
            isChat: true,
            authorID: userData.user.id,
          },
        }

        if (value.image) {
          const imageValidationResult = imageSchema.safeParse(value.image)
          if (!imageValidationResult.success) {
            toast.error(imageValidationResult.error.errors[0].message)
            form.setFieldValue('image', null)
            setInputFile(null)
            setImagePreviewUrl(null)
            return
          }

          const formData = new FormData()
          formData.set('image', value.image)
          try {
            const src = await sendImageInMessage(formData)
            messageData.message.src = src
            messageData.message.type = MessageType.Image

            form.setFieldValue('image', null)
            setInputFile(null)
            setImagePreviewUrl(null)
          } catch (error) {
            form.setFieldValue('image', null)
            setInputFile(null)
            setImagePreviewUrl(null)
            toast.error('Failed to send image')
          }
        }
        send(messageData)
        form.setFieldValue('text', '')
      }
    },
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return
      } else {
        form.handleSubmit()
      }
    }
  }

  const handleOnChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement
    const image = target.files?.[0]
    if (image) {
      form.setFieldValue('image', image)
      setInputFile(image)

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(image)
    }
  }

  return (
    <div className="grid w-full gap-1.5 sticky bottom-0">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="border bg-background rounded-md">
          <div className="flex items-center">
            {
            inputFile && imagePreviewUrl &&
            <div>
              <img src={imagePreviewUrl} alt="Preview" className="max-w-20 max-h-20" />
              </div>
            }
            <form.Field
              name="image"
              children={(field) => (
                <div className="w-8 h-10 relative">
                  <IoIosAttach className="w-full h-full text-ring" />
                  <Input
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    id={field.name}
                    name={field.name}
                    type="file"
                    onChange={handleOnChange}
                  />
                </div>
              )}
            />
            <form.Field
              name="text"
              children={(field) => (
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here."
                  className="block ring-inset "
                />
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                className="flex w-full justify-center"
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
