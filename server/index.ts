import type { WSContext } from 'hono/ws'
import app from './app'
import { port } from './helpers/config'
import Store from './helpers/store'

export const wsStore = new Store<WSContext>()

export const server = Bun.serve({
  port,
  ...app,
})

console.log('server running', server.port)
