import { createContext, useState } from 'react'
import {
  Outlet,
  Link,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { useQuery, type QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { UserAvatar } from '@/components/ux/userAvatar'
import { userQueryOptions } from '@/lib/api'
import { LogoutButton } from '@/components/ux/logoutButton'
import { Role } from '@/utils/constants'
import { useAuth } from '@/utils/hooks/useAuth'

interface IMyRouterContext {
  queryClient: QueryClient
}

interface IAuthContext {
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const Route = createRootRouteWithContext<IMyRouterContext>()({
  component: Root,
})

function NavBar() {
  const { isAuthenticated } = useAuth()
  const token = localStorage.getItem('Authorization')

  const { data: userData, refetch } = useQuery({
    ...userQueryOptions,
    enabled: !!token,
  })

  if (!isAuthenticated && token) {
    refetch()
  }

  return (
    <div className="p-2 flex items-center justify-between max-w-7xl m-auto">
      <Link to="/">
        <h1 className="text-2xl font-bold">Test Task Messenger</h1>
      </Link>
      <div className="p-2 flex items-center justify-between gap-2">
        {userData && userData.user.role === Role.Admin && (
          <Link to="/admin" className="[&.active]:font-bold mx-2">
            Admin Panel
          </Link>
        )}
        <Link to="/chat" className="[&.active]:font-bold">
          Messenger
        </Link>
        <Link to="/profile" className="[&.active]:font-bold mx-2">
          {userData ? <UserAvatar user={userData?.user} /> : 'Profile'}
        </Link>
        {userData && <LogoutButton refetch={refetch} />}
      </div>
    </div>
  )
}

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('Authorization')
  )
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <NavBar />
      <Outlet />
      <Toaster />
    </AuthContext.Provider>
  )
}
