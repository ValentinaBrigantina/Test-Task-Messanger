import { bearerAuth } from 'hono/bearer-auth'
import { checkValidToken } from '../services/auth'

export const authMiddleware = bearerAuth({
  verifyToken: async (token: string) => {
    try {
      await checkValidToken(token)
      return true
    } catch (error) {
      return false
    }
  },
})
