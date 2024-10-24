import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { users } from './users'
import { channels } from './channels'
import { relations } from 'drizzle-orm';

export const usersToChannels = pgTable('users_to_channels', {
  userID: integer('user_id')
    .notNull()
    .references(() => users.id),
  channelID: integer('channel_id')
    .notNull()
    .references(() => channels.id),
},
(t) => ({
    pk: primaryKey({ columns: [t.userID, t.channelID] }),
  }),
)

export const usersToChannelsRelations = relations(usersToChannels, ({ one }) => ({
    channel: one(channels, {
      fields: [usersToChannels.channelID],
      references: [channels.id],
    }),
    user: one(users, {
      fields: [usersToChannels.userID],
      references: [users.id],
    }),
  }));
