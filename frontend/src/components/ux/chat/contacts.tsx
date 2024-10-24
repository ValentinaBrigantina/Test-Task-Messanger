import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getContactsQueryOptions } from '@/lib/api'
import { Contact } from './contact'
import { WsAction } from '@/utils/constants'
import { UserProfile, WsNewContactFromApi } from '@server/sharedTypes'
import { useWebSocket } from '@/utils/hooks/useWebSocket'
import { ContactSkeleton } from './skeletons/contactSkeleton'

export function Contacts() {
  const queryClient = useQueryClient()
  const contactsQuery = useQuery(getContactsQueryOptions)
  const { isConnected, subscribe } = useWebSocket()
  const isWsReady = isConnected()
  const [contacts, setContacts] = useState<UserProfile[]>([])

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: getContactsQueryOptions.queryKey,
        exact: true,
      })
    }
  }, [])

  useEffect(() => {
    if (contactsQuery.data?.length) {
      setContacts(contactsQuery.data)
    }
  }, [contactsQuery.data])

  useEffect(() => {
    if (contacts.length && isWsReady) {
      subscribe((event) => {
        const data: WsNewContactFromApi = JSON.parse(event.data)

        switch (data.eventType) {
          case WsAction.UpdateContacts:
            setContacts([...contacts, data.contact])
            break

          default:
            break
        }
      })
    }
  }, [contacts, isWsReady])

  return (
    <div className="basis-1/4 flex-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-xl leading-9 tracking-tight text-primary">
          Contacts
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
        {contacts.length === 0 && contactsQuery.isFetched && (
          <p className="text-ring m-2">Invite your friends to the app!</p>
        )}
      </ul>
    </div>
  )
}
