export enum WsAction {
  UpdateContacts = 'UPDATE_CONTACTS',
  UpdateChannelsOfGroups = 'UPDATE_CHANNELS_OF_GROUPS',
  PrivateMessage = 'PRIVATE_MESSAGE',
  GroupChannelMessage = 'GROUP_CHANNEL_MESSAGE',
  Auth = 'AUTH',
}

export enum MessageType {
  Text = 1,
  Image = 2,
  Video = 3,
  File = 4,
}

export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}
