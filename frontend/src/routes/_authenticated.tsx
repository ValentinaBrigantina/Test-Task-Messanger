import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { AuthenticatedForm } from '@/components/ux/authenticatedForm'

const Component = () => {
  const { user } = Route.useRouteContext()
  if (!user) {
    return <AuthenticatedForm />
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
