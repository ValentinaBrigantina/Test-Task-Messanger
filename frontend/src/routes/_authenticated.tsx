import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button'

const LoginOrRegistration = () => {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
          You have to login or registration
        </h1>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Button
          className="mt-5 flex w-full justify-center"
          onClick={() => navigate({ to: '/login' })}
        >
          <a>Login</a>
        </Button>
        <Button
          className="mt-5 flex w-full justify-center"
          onClick={() => navigate({ to: '/register' })}
        >
          <a>Registration</a>
        </Button>
      </div>
    </div>
  )
}

const Component = () => {
  const { user } = Route.useRouteContext()
  if (!user) {
    return <LoginOrRegistration />
  }
  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient
    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (error) {
      return { user: null }
    }
  },
  component: Component,
})
