import { createFileRoute } from '@tanstack/react-router'
import { Contacts } from '@/components/ux/chat/contacts'
import { MainChat } from '@/components/ux/chat/mainChat'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

export function Chat() {
  return (
    <div className="p-5 max-w-7xl m-auto flex flex-row h-[830px] space-x-6 rounded-md bg-neutral-700">
      <Contacts />
      <MainChat />
    </div>
  )
}
