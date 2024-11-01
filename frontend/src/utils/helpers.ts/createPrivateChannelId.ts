import { WsAction } from '../constants'

export const createTopicPrivateChannel = (channelId: number): string => {
  const channelPrefix = WsAction.PrivateMessage
  return `${channelPrefix}:${channelId.toString()}`
}
