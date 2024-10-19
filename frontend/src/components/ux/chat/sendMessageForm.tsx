import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { userQueryOptions } from '@/lib/api'
import { WsTextDataFromClient } from '@server/sharedTypes'
import { WsActions } from '@server/helpers/constants'
import { useWebSocket } from '@/utils/hooks/useWebSocket'

export interface ISendMessageFormProps {}

export function SendMessageForm({}: ISendMessageFormProps) {
  const { data: userData } = useQuery(userQueryOptions)
  const { isConnected, send } = useWebSocket()
  const isWsReady = isConnected()

  const form = useForm({
    defaultValues: {
      text: '',
    },
    onSubmit: ({ value }) => {
      if (isWsReady && userData) {
        const messageData: WsTextDataFromClient = {
          ...value,
          eventType: WsActions.UpdateChat,
          isChat: true,
          authorID: userData.user.id,
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
        <div>
          <form.Field
            name="text"
            children={(field) => (
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                placeholder="Type your message here."
                className="block ring-1 ring-inset ring-gray-300"
              />
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
