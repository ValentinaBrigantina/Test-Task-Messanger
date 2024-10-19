import { hc } from 'hono/client'
import { queryOptions } from '@tanstack/react-query'
import { type ApiRoutes } from '@server/app'
import {
  type AuthSchema,
  DataUpdatePassword,
  JwtToken,
  MessageSchema,
  UserProfile,
} from '@server/sharedTypes'
import { apiHost } from '@/utils/config'

const client = hc<ApiRoutes>(apiHost)

export const api = client.api

const getAuthHeaders = () => {
  const token = localStorage.getItem('Authorization')
  if (!token) {
    throw new Error('Authorization token is missing')
  }
  return {
    headers: {
      ...(token && { Authorization: token }),
    },
  }
}

async function getCurrentUser(): Promise<{ user: UserProfile }> {
  const headers = getAuthHeaders()
  const res = await api.me.$get({}, headers)
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})

async function getContacts(): Promise<UserProfile[]> {
  const headers = getAuthHeaders()
  const res = await api.chat.contacts.$get({}, headers)
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export const getContactsQueryOptions = queryOptions({
  queryKey: ['get-contacts'],
  queryFn: getContacts,
  staleTime: Infinity,
})

export async function updateAvatar(formData: FormData) {
  const token = localStorage.getItem('Authorization')

  const res = await fetch(`${apiHost}/api/profile/avatar`, {
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
  const headers = getAuthHeaders()
  const res = await api.profile.password.$put({ json: value }, headers)
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

export async function getMessages(): Promise<MessageSchema[]> {
  const headers = getAuthHeaders()
  const res = await api.chat.messages.$get({}, headers)
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export const getMessagesQueryOptions = queryOptions({
  queryKey: ['get-messages'],
  queryFn: getMessages,
  staleTime: Infinity,
})
