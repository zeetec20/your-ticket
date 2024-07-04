import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { tableBasic } from "../../utils/db";
import { InferSelectModel, relations } from "drizzle-orm";

export const guests = pgTable("guests", {
  ...tableBasic,
  code: varchar("code", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  attendedAt: timestamp("attended_at"),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
});

export const guestsRelations = relations(guests, ({ one }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id],
    relationName: "event",
  }),
}));

export type IGuest = InferSelectModel<typeof guests>;
