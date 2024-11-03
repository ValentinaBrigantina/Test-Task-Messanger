import { useEffect } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { userQueryOptions } from '@/lib/api'
import { LoginForm } from '@/components/ux/loginForm'
import { Role } from '@/utils/constants'
import { useAuth } from '@/utils/hooks/useAuth'

const Component = () => {
  const { setIsAuthenticated } = useAuth()
  const { user } = Route.useRouteContext()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user || user.role !== Role.Admin) {
      localStorage.removeItem('Authorization')
      queryClient.removeQueries()
      setIsAuthenticated(false)
    }
  }, [user, queryClient, setIsAuthenticated])

  if (!user || user.role !== Role.Admin) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
            Login to admin account
          </h1>
        </div>
        <LoginForm navigateTo={'/admin'} />
      </div>
    )
  }
  return <Outlet />
}

export const Route = createFileRoute('/_adminAuthenticated')({
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
