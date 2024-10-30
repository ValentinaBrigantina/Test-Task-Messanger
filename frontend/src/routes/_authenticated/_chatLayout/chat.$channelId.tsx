import { createFileRoute } from '@tanstack/react-router'
import { MainChannel } from '@/components/ux/chat/mainChannel'

export const Route = createFileRoute(
  '/_authenticated/_chatLayout/chat/$channelId'
)({
  component: MainChannel,
})
