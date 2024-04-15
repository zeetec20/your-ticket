import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { events } from "./events";

export const guests = pgTable("guests", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
});
