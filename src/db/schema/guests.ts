import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { events } from "./events";

export const guests = pgTable("guests", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  is_attended: boolean("is_attended").default(false).notNull(),
  event_id: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
});
