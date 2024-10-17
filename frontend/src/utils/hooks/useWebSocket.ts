import { api } from '@/lib/api'
import { useCallback, useEffect, useRef, useState } from 'react'

interface iUseWebSocket {
  isConnected: boolean
  send: (data: Record<string, any>) => void
  close: () => void
  connection: undefined | WebSocket
}

export const useWebSocket = (): iUseWebSocket => {
  const [connection, setConnection] = useState<undefined | WebSocket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      const ws = api.ws.$ws()
      setConnection(ws)

      ws.addEventListener('open', () => {
        if (ws.readyState === ws.OPEN) {
          setIsConnected(true)
        }
      })
    }

    initialized.current = true
  }, [])

  const send = useCallback(
    (data: Record<string, any>) => {
      if (!connection) {
        console.warn('Can not send websocket message. Its not connected')
        return
      }

      connection.send(JSON.stringify(data))
    },
    [connection]
  )

  const close = () => {
    connection?.addEventListener('close', () => {
      setIsConnected(false)
    })
    connection?.close()
  }

  return { isConnected, send, close, connection }
}
