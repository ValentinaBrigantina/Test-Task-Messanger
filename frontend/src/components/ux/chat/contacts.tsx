import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getChannelsQueryOptions, getContactsQueryOptions } from '@/lib/api'
import { Contact } from './contact'
import { WsAction } from '@/utils/constants'
import type {
  Channel,
  UserProfile,
  WsNewChannelFromApi,
  WsNewContactFromApi,
} from '@server/sharedTypes'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { ContactSkeleton } from './skeletons/contactSkeleton'
import { ChannelOfGroup } from './channelOfGroup'

export function Contacts() {
  const queryClient = useQueryClient()
  const contactsQuery = useQuery(getContactsQueryOptions)
  const channelsQuery = useQuery(getChannelsQueryOptions)
  const { isConnected, subscribe } = useWebSocket()
  const isWsReady = isConnected()
  const [contacts, setContacts] = useState<UserProfile[]>([])
  const [channels, setChannels] = useState<Channel[]>([])

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: [
          getContactsQueryOptions.queryKey,
          getChannelsQueryOptions.queryKey,
        ],
        exact: true,
      })
    }
  }, [queryClient])

  useEffect(() => {
    if (contactsQuery.data?.length) {
      setContacts(contactsQuery.data)
    }
  }, [contactsQuery.data])

  useEffect(() => {
    if (channelsQuery.data?.length) {
      setChannels(channelsQuery.data)
    }
  }, [channelsQuery.data])

  useEffect(() => {
    if ((contacts.length || channels.length) && isWsReady) {
      subscribe((event) => {
        const data: WsNewContactFromApi | WsNewChannelFromApi = JSON.parse(
          event.data
        )

        switch (data.eventType) {
          case WsAction.UpdateContacts:
            if ('contact' in data) {
              setContacts((prevContacts) => [...prevContacts, data.contact])
            }
            break

          case WsAction.UpdateChannelsOfGroups:
            if ('channel' in data) {
              setChannels((prevChannels) => [...prevChannels, data.channel])
            }
            break

          default:
            break
        }
      })
    }
  }, [contacts, channels, isWsReady, subscribe])

  return (
    <div className="basis-1/4 flex-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-xl leading-9 tracking-tight text-primary">
          Contacts and groups
        </h1>
      </div>
      <ul className="h-[630px] rounded-md">
        {contactsQuery.isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ContactSkeleton key={index} />
          ))}
        {contactsQuery.isFetched &&
          contacts.map((contact) => {
            return <Contact contact={contact} key={contact.id} />
          })}
        {channelsQuery.isFetched &&
          channels.map((channel) => {
            return <ChannelOfGroup channel={channel} key={channel.id} />
          })}
        {contacts.length === 0 &&
          channels.length === 0 &&
          contactsQuery.isFetched &&
          channelsQuery.isFetched && (
            <p className="text-ring m-2">Invite your friends to the app!</p>
          )}
      </ul>
    </div>
  )
}
