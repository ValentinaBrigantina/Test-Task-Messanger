import { hc } from 'hono/client'
import { queryOptions } from '@tanstack/react-query'
import type { ApiRoutes } from '@server/app'
import type {
  AuthSchema,
  Channel,
  ChannelID,
  CreateChannelOfGroupData,
  DataUpdatePassword,
  JwtToken,
  MessageSchemaWithAuthorData,
  UserID,
  UserProfile,
} from '@server/sharedTypes'
import { apiHost } from '@/utils/config'
import { getAuthHeaders } from './utils'

const client = hc<ApiRoutes>(apiHost)

export const api = client.api

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

async function getChannels(): Promise<Channel[]> {
  const headers = getAuthHeaders()
  const res = await api.chat['channels-of-groups'].$get({}, headers)
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export const getChannelsQueryOptions = queryOptions({
  queryKey: ['get-channels-of-groups'],
  queryFn: getChannels,
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

export async function sendImageInMessage(formData: FormData): Promise<string> {
  const token = localStorage.getItem('Authorization')

  const res = await fetch(`${apiHost}/api/chat/message`, {
    method: 'POST',
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

async function getOrCreatePrivateChannel(value: UserID): Promise<Channel> {
  const headers = getAuthHeaders()
  const res = await api.chat['private-channel'].$post(
    { query: { contact: value.id.toString() } },
    headers
  )
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export function getChannelQueryOptions(id: UserID) {
  return queryOptions({
    queryKey: ['get-channel', id],
    queryFn: () => getOrCreatePrivateChannel(id),
    staleTime: Infinity,
  })
}

export async function getChannelMessages(
  channel: ChannelID
): Promise<MessageSchemaWithAuthorData[]> {
  const headers = getAuthHeaders()
  const res = await api.chat.channel[':id{[0-9]+}'].$get(
    { param: { id: channel.id.toString() } },
    headers
  )
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export function getChannelMessagesQueryOptions(channel: ChannelID) {
  return queryOptions({
    queryKey: ['get-channel-messages', channel],
    queryFn: () => getChannelMessages(channel),
    staleTime: Infinity,
  })
}

export async function getTargetContactByChannelId(
  channel: ChannelID
): Promise<UserProfile> {
  const headers = getAuthHeaders()
  const res = await api.chat['target-contact'][':id{[0-9]+}'].$get(
    { param: { id: channel.id.toString() } },
    headers
  )
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export function getTargetContactByChannelIdQueryOptions(channel: ChannelID) {
  return queryOptions({
    queryKey: ['get-target-contact', channel],
    queryFn: () => getTargetContactByChannelId(channel),
    staleTime: Infinity,
  })
}

export async function createGroupChat(
  data: CreateChannelOfGroupData
): Promise<Channel> {
  const headers = getAuthHeaders()
  const res = await api.chat['channels-of-groups'].$post(
    { json: data },
    headers
  )
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export async function getDataUsers():Promise<UserProfile[]> {
  const headers = getAuthHeaders()
  const res = await api.admin.$get({}, headers)
  if (!res.ok) {
    throw new Error('server error')
  }
  return res.json()
}

export const getDataUsersQueryOptions = queryOptions({
  queryKey: ['get-data-users'],
  queryFn: getDataUsers,
  staleTime: Infinity,
})
