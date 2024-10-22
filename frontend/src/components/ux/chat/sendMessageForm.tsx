import { useRef } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { sendImageInMessage, userQueryOptions } from '@/lib/api'
import { WsTextDataFromClient } from '@server/sharedTypes'
import { MessageType, WsAction } from '@server/helpers/constants'
import { useWebSocket } from '@/utils/hooks/useWebSocket'

type FormData = {
  text: string | undefined
  image: File | null
}

export function SendMessageForm() {
  const { data: userData } = useQuery(userQueryOptions)
  const { isConnected, send } = useWebSocket()
  const isWsReady = isConnected()

  const inputFileRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormData>({
    defaultValues: {
      text: '',
      image: null,
    },
    onSubmit: async ({ value }) => {
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
          const formData = new FormData()
          formData.set('image', value.image)
          try {
            const src = await sendImageInMessage(formData)
            messageData.message.src = src
            messageData.message.type = MessageType.Image

            form.setFieldValue('image', null)
            if (inputFileRef.current) {
              inputFileRef.current.value = ''
            }
          } catch (error) {
            form.setFieldValue('image', null)
            if (inputFileRef.current) {
              inputFileRef.current.value = ''
            }
            toast.error('Failed to send image', {
              style: {
                background: 'IndianRed',
              },
            })
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
        <div>
          <form.Field
            name="text"
            children={(field) => (
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here."
                className="block  ring-inset ring-background"
              />
            )}
          />
          <form.Field
            name="image"
            children={(field) => (
              <>
                <Input
                  className="block ring-1 ring-inset ring-gray-300"
                  id={field.name}
                  name={field.name}
                  type="file"
                  onChange={handleOnChange}
                  ref={inputFileRef}
                />
              </>
            )}
          />
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
