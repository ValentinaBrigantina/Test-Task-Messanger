import { createContext, useState } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Contacts } from '@/components/ux/chat/contacts'
import type { Channel } from '@server/sharedTypes'

export interface ICurrentChannelContext {
  currentTargetChannel: Channel | null
  setCurrentTargetChannel: (channel: Channel | null) => void
}

export const CurrentChannelContext =
  createContext<ICurrentChannelContext | null>(null)

const ChatLayout = () => {
  const [currentTargetChannel, setCurrentTargetChannel] =
    useState<Channel | null>(null)

  return (
    <CurrentChannelContext.Provider
      value={{ currentTargetChannel, setCurrentTargetChannel }}
    >
      <div className="p-5 max-w-7xl m-auto flex flex-row h-[830px] space-x-6 rounded-md bg-neutral-700">
        <Contacts />
        <Outlet />
      </div>
    </CurrentChannelContext.Provider>
  )
}

export const Route = createFileRoute('/_authenticated/_chatLayout')({
  component: ChatLayout,
})
