import { useContext } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MainChat } from '@/components/ux/chat/mainChat'
import { CurrentContactContext } from '../_chatLayout'
import type { UserProfile } from '@server/sharedTypes'
import { MainChannel } from '@/components/ux/chat/mainChannel'

const ChatIndex = () => {
  const targetContact: UserProfile | null = useContext(CurrentContactContext)
  if (targetContact) {
    return <MainChannel />
  }
  return <MainChat />
}

export const Route = createFileRoute('/_authenticated/_chatLayout/chat')({
  component: ChatIndex,
})
