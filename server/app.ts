import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { authRoute } from './routes/auth'
import { profileRoute } from './routes/profile'

const app = new Hono()

app.use('*', logger())
app.use(
  '/',
  cors({
    origin: '*',
    allowHeaders: ['Authorization'],
  })
)
app.use('/uploads/*', serveStatic({ root: './' }))

const apiRoutes = app
  .basePath('api')
  .route('/', authRoute)
  .route('/profile', profileRoute)
 
app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app
export type ApiRoutes = typeof apiRoutes
