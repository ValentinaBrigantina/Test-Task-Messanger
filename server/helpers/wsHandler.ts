import type { WSContext, WSMessageReceive } from 'hono/ws'
import { saveMessage } from '../services/chat'

export const wsHandler = async (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  console.log(`Message from client: ${event.data}`)
  if (typeof event.data === 'string') {
    const data = JSON.parse(event.data)
    await saveMessage(data)
    ws.send(JSON.stringify({ hello: 'from server' }))
  }
}
