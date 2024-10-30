import { WsAction } from '../constants'

export const createPrivateChannelTopic = (channelId: number | null | undefined): string => {
    const channelPrefix = WsAction.PrivateMessage
    if (channelId) {
      return `${channelPrefix}:${channelId.toString()}`
    }
    return channelPrefix
  }

  export const createPrivateChannelId = (userIDs: number[]): string => {
    const sortedUsersIDs = userIDs.sort((a, b) => a - b)
    return sortedUsersIDs.join('')
  }
  