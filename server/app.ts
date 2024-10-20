import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { createBunWebSocket } from 'hono/bun'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import { authRoute } from './routes/auth'
import { profileRoute } from './routes/profile'
import { chatRoute } from './routes/chat'
import { wsHandler } from './helpers/webSocket'
import { WsAction } from '../frontend/src/utils/constants'

const app = new Hono()
const { upgradeWebSocket, websocket } = createBunWebSocket()

app.use('*', cors(), logger())
app.use('/uploads/*', serveStatic({ root: './' }))

const apiRoutes = app
  .basePath('api')
  .get(
    '/ws',
    upgradeWebSocket(() => ({
      onMessage: wsHandler,
      onOpen(_, ws) {
        const rawWs = ws.raw as ServerWebSocket
        rawWs.subscribe(WsAction.UpdateChat)
        rawWs.subscribe(WsAction.UpdateContacts)
      },
    }))
  )
  .route('/', authRoute)
  .route('/profile', profileRoute)
  .route('/chat', chatRoute)
  .get('*', serveStatic({ root: './frontend/dist' }))
  .get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default { fetch: app.fetch, websocket }
export type ApiRoutes = typeof apiRoutes
