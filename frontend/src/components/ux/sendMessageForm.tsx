import { FormApi, ReactFormApi } from '@tanstack/react-form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface FormData {
  text: string
}

export interface ISendMessageFormProps {
  isWSReady: boolean
  sendWSdata: (data: any) => void
  form: FormApi<FormData> & ReactFormApi<FormData>
}

export function SendMessageForm({ form }: ISendMessageFormProps) {
  return (
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
            name="text"
            children={(field) => (
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
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
