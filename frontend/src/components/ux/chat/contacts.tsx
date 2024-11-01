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
import { ContactSelectionModal } from './contactSelectionModal'

export function Contacts() {
  const queryClient = useQueryClient()
  const contactsQuery = useQuery(getContactsQueryOptions)
  const channelsQuery = useQuery(getChannelsQueryOptions)
  const { isConnected, subscribe } = useWebSocket()
  const isWsReady = isConnected()
  const [contacts, setContacts] = useState<UserProfile[]>([])
  const [groupChannels, setGroupChannels] = useState<Channel[]>([])

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
      setGroupChannels(channelsQuery.data)
    }
  }, [channelsQuery.data])

  useEffect(() => {
    if ((contacts.length || groupChannels.length) && isWsReady) {
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
              setGroupChannels((prevChannels) => [
                ...prevChannels,
                data.channel,
              ])
            }
            break

          default:
            break
        }
      })
    }
  }, [contacts, groupChannels, isConnected(), subscribe])

  return (
    <div className="basis-1/4 flex-none">
      <div className="flex items-center justify-between sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-lg leading-9 tracking-tight text-ring">Contacts</h1>

        {contacts.length && (
          <div>
            <ContactSelectionModal contacts={contacts} />
          </div>
        )}
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
        {}
        <h1 className="text-lg leading-9 tracking-tight text-ring">
          {groupChannels.length !== 0 && 'Group channels'}
        </h1>
        {channelsQuery.isFetched &&
          groupChannels.map((channel) => {
            return <ChannelOfGroup channel={channel} key={channel.id} />
          })}
        {contacts.length === 0 &&
          groupChannels.length === 0 &&
          contactsQuery.isFetched &&
          channelsQuery.isFetched && (
            <p className="text-ring m-2">Invite your friends to the app!</p>
          )}
      </ul>
    </div>
  )
}
