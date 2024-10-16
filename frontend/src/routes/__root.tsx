import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router'
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { UserAvatar } from '@/components/ux/userAvatar'
import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
})

function NavBar() {
  const token = localStorage.getItem('Authorization')

  const { data: userData, refetch } = useQuery({
    ...userQueryOptions,
    enabled: !!token,
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('Authorization')
    queryClient.removeQueries()
    refetch()
    navigate({ to: '/login' })
  }

  return (
    <div className="p-2 flex items-center justify-between max-w-2xl m-auto">
      <Link to="/">
        <h1 className="text-2xl font-bold">Test Task Messenger</h1>
      </Link>
      <div className="p-2 flex items-center justify-between gap-2">
        <Link to="/chat" className="[&.active]:font-bold">
          Chat
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          {userData ? <UserAvatar user={userData?.user} /> : 'Profile'}
        </Link>
        {userData && (
          <Button className="ml-auto" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </div>
  )
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <Outlet />
      <Toaster />
    </>
  )
}
