import { hc } from 'hono/client'
import { type ApiRoutes } from '@server/app'
import { queryOptions } from '@tanstack/react-query'
import { type AuthSchema, DataUpdatePassword, JwtToken } from '@server/sharedTypes'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
  const token = localStorage.getItem('Authorization')

  const res = await api.me.$get(
    {},
    {
      headers: {
        ...(token && { Authorization: token }),
      },
    }
  )
  if (!res.ok) {
    throw new Error('server error')
  }
  return await res.json()
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})

export async function updateAvatar(formData: FormData) {
  const token = localStorage.getItem('Authorization')

  const res = await fetch('api/profile/avatar', {
    method: 'PUT',
    headers: {
      ...(token && { Authorization: token }),
    },
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Server error')
  }
  return res.json()
}

export async function updatePassword(value: DataUpdatePassword) {
  const token = localStorage.getItem('Authorization')

  const res = await api.profile.password.$put({ json: value },
    {
      headers: {
        ...(token && { Authorization: token }),
      },
    })

  if (!res.ok) {
    throw new Error('Server error')
  }
  return res.json()
}

export async function login(value: AuthSchema): Promise<JwtToken> {
  const res = await api.login.$post({ json: value })
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export async function registration(value: AuthSchema): Promise<void> {
  const res = await api.register.$post({ json: value })
  if (!res.ok) {
    throw new Error('server error')
  }
}