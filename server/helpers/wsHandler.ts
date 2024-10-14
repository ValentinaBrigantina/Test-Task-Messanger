import type { WSContext, WSMessageReceive } from 'hono/ws'

export const wsHandler = (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext
) => {
  console.log(`Message from client: ${event.data}`)
  ws.send(JSON.stringify({ hello: 'from server' }))
}
