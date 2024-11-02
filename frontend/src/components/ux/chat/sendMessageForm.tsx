import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  getTargetContactByChannelIdQueryOptions,
  sendImageInMessage,
  userQueryOptions,
} from '@/lib/api'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { messageFormSchema } from '@/utils/customValidation/messageFormSchema'
import { FileInputSendMessage } from './inputFileSendMessage'
import { imageSchema } from '@/utils/customValidation/imageSchema'
import type {
  ChannelID,
  GroupChannelMessagePayloadApi,
  PrivateMessagePayloadApi,
  WsMessageTypeApi,
} from '@server/sharedTypes'
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
  const targetContactQuery =
    channel && useQuery(getTargetContactByChannelIdQueryOptions(channel))

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

      if (isWsReady && userData && channel) {
        const messageData:
          | PrivateMessagePayloadApi
          | GroupChannelMessagePayloadApi = {
          text: value.text,
          authorID: userData?.user.id,
          type: MessageType.Text,
          channelID: channel.id,
        }
        if (targetContactQuery?.data) {
          messageData.targetID = targetContactQuery.data.id
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
            messageData.src = src
            messageData.type = MessageType.Image
            form.setFieldValue('image', null)
          } catch (error) {
            form.setFieldValue('image', null)
            toast.error('Failed to send image')
          }
        }
        const wsMessage: WsMessageTypeApi = messageData.targetID
          ? { eventType: WsAction.PrivateMessage, payload: messageData }
          : { eventType: WsAction.GroupChannelMessage, payload: messageData }
        send(wsMessage)
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
