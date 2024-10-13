import { Outlet, Link, createRootRouteWithContext } from '@tanstack/react-router'
import { type QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
})

function NavBar() {
  return (
    <div className="p-2 flex justify-between max-w-2xl m-auto items-baseline">
      <Link to="/"><h1 className="text-2xl font-bold">Test Task Messenger</h1></Link>
      <div className="p-2 flex gap-2">
      <Link to="/profile" className="[&.active]:font-bold">
        Profile
      </Link>{' '}
      <Link to="/chat" className="[&.active]:font-bold">
        Chat
      </Link>
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
