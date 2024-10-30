import { createContext, useState } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Contacts } from '@/components/ux/chat/contacts'
import type { UserProfile } from '@server/sharedTypes'

export const CurrentContactContext = createContext<UserProfile | null>(null)

const ChatLayout = () => {
  const [currentTargetContact, setCurrentTargetContact] = 
    useState<UserProfile | null>(null)

  return (
    <CurrentContactContext.Provider value={currentTargetContact}>
      <div className="p-5 max-w-7xl m-auto flex flex-row h-[830px] space-x-6 rounded-md bg-neutral-700">
        <Contacts setCurrentTargetContact={setCurrentTargetContact} />
        <Outlet />
      </div>
    </CurrentContactContext.Provider>
  )
}

export const Route = createFileRoute('/_authenticated/_chatLayout')({
  component: ChatLayout,
})
