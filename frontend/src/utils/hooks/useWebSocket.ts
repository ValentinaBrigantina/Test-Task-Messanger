import { api } from '@/lib/api'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useWebSocket = (): [
    boolean,
    (data: Record<string, any>) => void,
    () => void,
  ] => {
    const [connection, setConnection] = useState<undefined | WebSocket>()
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const initialized = useRef(false)
  
    useEffect(() => {
      let ws: WebSocket
  
      if (!initialized.current) {
        ws = api.ws.$ws()
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
  
    const close = () => connection?.close()
  
    return [isConnected, send, close]
  }