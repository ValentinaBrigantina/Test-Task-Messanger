import { api } from '@/lib/api'
import { useEffect } from 'react'

export type ConnectionCb = (event: MessageEvent<any>) => void

interface IUseWebSocket {
  isConnected: () => boolean
  send: (data: Record<string, any>) => void
  close: () => void
  subscribe: (cb: ConnectionCb) => void
}

let ws: WebSocket | null = null

export const useWebSocket = (): IUseWebSocket => {
  useEffect(() => {
    if (!ws) {
      ws = api.ws.$ws()

      ws.addEventListener('close', () => {
        ws = null
      })
    }
  }, [])

  return {
    send: <T extends any>(data: Record<string, T>) =>
      ws?.send(JSON.stringify(data)),
    close: () => ws?.close(),
    subscribe: (cb: ConnectionCb) => ws?.addEventListener('message', cb),
    isConnected: () => {
      if (!ws) {
        return false
      }
      return ws?.readyState === ws.OPEN
    },
  }
}
