import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { HeaderProfile } from '@/components/ux/headerProfile'
import { userQueryOptions } from '@/lib/api'
import { UserProfile } from '@server/sharedTypes'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { useForm } from '@tanstack/react-form'
import { Label } from '@radix-ui/react-label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

export function Chat() {
  const { isPending, error, data } = useQuery(userQueryOptions)
  const [isWSReady, sendWSdata, close] = useWebSocket()

  if (isPending) return 'loading'
  if (error) return 'not logged in'

  const user: UserProfile = data?.user

  const form = useForm({
    defaultValues: {
      message: '',
    },
    onSubmit: async ({ value }) => {
      if (isWSReady) {
        sendWSdata(value)
        form.setFieldValue('message', '')
      }
    },
  })

  return (
    <>
      <HeaderProfile {...user} />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
            Chat
          </h1>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <ul></ul>
          </div>
          <div className="grid w-full gap-1.5">
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
                  name="message"
                  children={(field) => (
                    <>
                      <Label htmlFor={field.name}>Your message</Label>
                      <Textarea
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                        placeholder="Type your message here."
                        className="block ring-1 ring-inset ring-gray-300"
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
        </div>
      </div>
    </>
  )
}
