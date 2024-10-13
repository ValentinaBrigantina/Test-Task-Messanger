import { HeaderProfile } from '@/components/ux/headerProfile'
import { userQueryOptions } from '@/lib/api'
import { UserProfile } from '@server/sharedTypes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

export function Chat() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return 'loading'
  if (error) return 'not logged in'

  const user: UserProfile = data?.user

  return (
    <HeaderProfile {...user}/>
  )
}