import { useEffect, useState, useCallback, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { HeaderProfile } from '@/components/ux/headerProfile'
import { api, userQueryOptions } from '@/lib/api'
import { UserProfile } from '@server/sharedTypes'

export const Route = createFileRoute('/_authenticated/chat')({
  component: Chat,
})

const useWebSocket = (): [
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

export function Chat() {
  const { isPending, error, data } = useQuery(userQueryOptions)
  const [isWSReady, sendWSdata, close] = useWebSocket()

  if (isPending) return 'loading'
  if (error) return 'not logged in'

  const user: UserProfile = data?.user

  return (
    <>
      <HeaderProfile {...user} />
      <form id="form">
        <input type="text" id="data" placeholder="send message" />
        <button type="submit" id="send">
          Send ᯓ✉︎
        </button>
      </form>

      <button
        onClick={() => {
          if (isWSReady) {
            sendWSdata({ hello: 1 })
          }
        }}
      >
        Send test
      </button>

      <br />
      <button
        onClick={() => {
          close()
        }}
      >
        Finish
      </button>
    </>
  )
}
