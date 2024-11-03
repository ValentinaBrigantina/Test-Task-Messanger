import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/ux/loginForm'

export const Route = createFileRoute('/login')({
  component: Login,
})

export function Login() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
          Login to your account
        </h1>
      </div>
      <LoginForm navigateTo={'/chat'} />
    </div>
  )
}
