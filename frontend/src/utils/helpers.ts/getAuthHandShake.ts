import type { AuthMessagePayloadApi } from '@server/sharedTypes'
import { WsAction } from '../constants'

export const getAuthHandshake = ():
  | { payload: AuthMessagePayloadApi; eventType: WsAction }
  | undefined => {
  const bearerToken = localStorage.getItem('Authorization')
  if (!bearerToken) {
    return
  }
  const token = bearerToken.split(' ')[1]
  return { eventType: WsAction.Auth, payload: { token } }
}
