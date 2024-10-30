import { WsAction } from '../constants'

export const createPrivateChannelId = (channelId: number): string => {
    const channelPrefix = WsAction.PrivateMessage
    return `${channelPrefix}:${channelId.toString()}`
  }