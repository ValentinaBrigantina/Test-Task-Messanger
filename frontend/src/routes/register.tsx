import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registration } from '@/lib/api'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      name: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await registration(value)
      navigate({ to: '/login' })
    },
  })
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
          Registration
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form.Field
              name="name"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      className="block ring-1 ring-inset ring-gray-300"
                    />
                  </>
                )
              }}
            />
          </div>
          <div>
            <form.Field
              name="password"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Password</Label>
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
                className="flex w-full justify-center"
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? '...' : 'Registration'}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  )
}
