import { WsAction } from '../constants'

export const createPrivateChannelTopic = (channelId: number | null | undefined): string => {
    const channelPrefix = WsAction.PrivateMessage
    if (channelId) {
      return `${channelPrefix}:${channelId.toString()}`
    }
    return channelPrefix
  }
  