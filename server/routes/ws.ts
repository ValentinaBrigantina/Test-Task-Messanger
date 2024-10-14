import type { Hono } from 'hono'
import { upgradeWebSocket } from '../websocket'

// export const wsRoute = new Hono().get(
//   '/ws',
//   upgradeWebSocket((c) => {
//     return {
//       onMessage(event, ws) {
//         console.log(`Message from client: ${event.data}`)
//         // const messageData: MessageSchema = JSON.parse(event.data)
//         // const { text, authorID, target, channelID } = messageData
//         ws.send('Hello from server!')
//       },
//       onOpen(e, ws) {
//         console.log('Open!')
//       },
//     }
//   })
// )

export default (app: Hono) => {
  return app.get(
    '/ws',
    upgradeWebSocket((c) => ({
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`)
        ws.send('Hello from server!')
      },
      onOpen(e, ws) {
        console.log('Open!')
      },
    }))
  )
}
