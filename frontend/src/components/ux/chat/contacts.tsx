import { useQuery } from '@tanstack/react-query'
import { contactsQueryOptions } from '@/lib/api'
import { Contact } from './contact'

export function Contacts() {
  const { data: contacts = [], isFetched: isContactsFetched } =
    useQuery(contactsQueryOptions)

  return (
    <div className="basis-1/4 flex-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-xl leading-9 tracking-tight text-gray-100">
          Contacts
        </h1>
      </div>
      <ul>
        {isContactsFetched &&
          contacts.map((contact) => {
            return <Contact contact={contact} key={contact.id} />
          })}
      </ul>
    </div>
  )
}
