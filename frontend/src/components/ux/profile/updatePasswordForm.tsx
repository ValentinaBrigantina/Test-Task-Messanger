import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Label } from '@radix-ui/react-label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { updatePassword } from '@/lib/api'

export function UpdatePasswordForm() {
  const form = useForm({
    defaultValues: {
      newPassword: '',
      currentPassword: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await updatePassword(value)
        toast.success('Password updated successfully', {
          style: {
            background: 'DarkGrey',
          },
        })
      } catch (error) {
        toast.error('Failed to update your password', {
          style: {
            background: 'IndianRed',
          },
        })
      }
    },
  })

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        className="max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form.Field
            name="newPassword"
            children={(field) => (
              <>
                <h3 className="mb-5 text-2xl leading-9 tracking-tight text-gray-100">
                  Update your password
                </h3>
                <Label htmlFor={field.name}>Your new password</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  className="mb-5 block ring-1 ring-inset ring-gray-300"
                />
              </>
            )}
          />
          <form.Field
            name="currentPassword"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Your current passwort</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  className="block ring-1 ring-inset ring-gray-300"
                />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              className="flex w-full mt-8"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? '...' : 'Update password'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
