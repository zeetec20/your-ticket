import { date, pgTable, text, time, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tableDates } from "../../utils/db";

export const events = pgTable("events", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  registered_by: uuid("registered_by")
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),
  date: date("date").notNull(),
  time_start: time("time_start").notNull(),
  time_end: time("time_end").notNull(),
  ...tableDates,
});
