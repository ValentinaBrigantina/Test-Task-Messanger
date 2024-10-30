import { useContext } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { sendImageInMessage, userQueryOptions } from '@/lib/api'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { messageFormSchema } from '@/utils/customValidation/messageFormSchema'
import { FileInputSendMessage } from './inputFileSendMessage'
import { CurrentContactContext } from '@/routes/_authenticated/_chatLayout'
import { createPrivateChannelId } from '@/utils/helpers.ts/createPrivateChannelId'
import { imageSchema } from '@/utils/customValidation/imageSchema'
import type { ChannelID, WsTextDataFromClient } from '@server/sharedTypes'
import { MessageType, WsAction } from '@/utils/constants'

type FormData = {
  text: string | undefined
  image: File | null
}

interface ISendMessageFormProps {
  channel?: ChannelID
}

export function SendMessageForm({ channel }: ISendMessageFormProps) {
  const { data: userData } = useQuery(userQueryOptions)
  const { isConnected, send } = useWebSocket()
  const isWsReady = isConnected()
  const targetContact = useContext(CurrentContactContext)

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

      let messageData: WsTextDataFromClient
      if (isWsReady && userData) {
        const messageDataOfUser = {
          text: value.text,
          authorID: userData?.user.id,
          type: MessageType.Text,
        }
        if (targetContact && channel) {
          const topicPrivateChannel = createPrivateChannelId(channel.id)
          messageData = {
            eventType: topicPrivateChannel,
            message: {
              ...messageDataOfUser,
              channelID: channel.id,
              targetID: targetContact.id,
            },
          }
        } else {
          messageData = {
            eventType: WsAction.UpdateChat,
            message: {
              ...messageDataOfUser,
              isChat: true,
            },
          }
        }

        if (value.image) {
          const imageValidationResult = imageSchema.safeParse(value.image)
          if (!imageValidationResult.success) {
            toast.error(imageValidationResult.error.errors[0].message)
            form.setFieldValue('image', null)
            return
          }
          const formData = new FormData()
          formData.set('image', value.image)
          try {
            const src = await sendImageInMessage(formData)
            messageData.message.src = src
            messageData.message.type = MessageType.Image
            form.setFieldValue('image', null)
          } catch (error) {
            form.setFieldValue('image', null)
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
            <FileInputSendMessage
              onChange={(file) => form.setFieldValue('image', file)}
              resetPreview={form.getFieldValue('image') === null}
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
                  className="block ring-inset"
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
