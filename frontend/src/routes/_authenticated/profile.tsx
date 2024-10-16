import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { UpdateAvatarForm } from '@/components/ux/updateAvatarForm'
import { UpdatePasswordForm } from '@/components/ux/updatePasswordForm'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

export function Profile() {
  const { refetch } = useQuery(userQueryOptions)

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center p-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
          Setting profile
        </h1>
      </div>

      <UpdateAvatarForm refetch={refetch} />
      <UpdatePasswordForm />
    </div>
  )
}
