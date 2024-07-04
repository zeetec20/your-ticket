import {
  date,
  pgTable,
  text,
  time,
  uuid,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { tableBasic } from "../../utils/db";
import { InferSelectModel, relations } from "drizzle-orm";
import { guests } from "./guests";

export const events = pgTable("events", {
  ...tableBasic,
  title: varchar("title", { length: 255 }).notNull(),
  organizer: varchar("organizer", { length: 225 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  registeredBy: uuid("registered_by")
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),
  date: date("date").notNull(),
  days: numeric("days").notNull(),
  timeStart: time("time_start").notNull(),
  timeEnd: time("time_end").notNull(),
});

export const eventsRelations = relations(events, ({ many, one }) => ({
  guests: many(guests, {
    relationName: "event",
  }),
  registeredByUser: one(users, {
    fields: [events.registeredBy],
    references: [users.id],
  }),
}));

export type IEvent = InferSelectModel<typeof events>;
