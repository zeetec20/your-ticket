import { date, pgTable, text, time, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tableBasic } from "../../utils/db";
import { InferSelectModel } from "drizzle-orm";

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
  timeStart: time("time_start").notNull(),
  timeEnd: time("time_end").notNull(),
});

export type IEvent = InferSelectModel<typeof events>;
