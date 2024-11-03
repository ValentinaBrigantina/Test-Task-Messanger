import { getDataUsersQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_adminAuthenticated/admin')({
  component: Admin,
})

function Admin() {
  const token = localStorage.getItem('Authorization')
  const dataUsersQuery = useQuery({
    ...getDataUsersQueryOptions,
    enabled: !!token,
  })

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl leading-9 text-primary">
          Registered users in the system
        </h1>
      </div>
      <pre>
        {dataUsersQuery.isLoading
          ? 'Loading...'
          : dataUsersQuery.isError
            ? `Error: ${dataUsersQuery.error.message}`
            : JSON.stringify(dataUsersQuery.data, null, 2)}
      </pre>
    </div>
  )
}
