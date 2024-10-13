import { createFileRoute } from '@tanstack/react-router'
import { Chat } from './chat'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

function Index() {
  return <Chat/>
}
