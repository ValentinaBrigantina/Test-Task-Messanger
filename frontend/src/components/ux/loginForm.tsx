import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { login } from '@/lib/api'

interface ILoginFormProps {
    navigateTo: string
}

export function LoginForm({ navigateTo }: ILoginFormProps) {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      name: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const data = await login(value)
      if (data.token) {
        localStorage.setItem('Authorization', data.token)
      }
      navigate({ to: navigateTo })
    },
  })

  return (
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
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
              {isSubmitting ? '...' : 'Login'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
