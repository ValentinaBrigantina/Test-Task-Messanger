import app from './app'
import { port } from './helpers/config'

const server = Bun.serve({
  port,
  ...app,
})

console.log('server running', server.port)
