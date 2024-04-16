import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tableDates } from "../../utils/db";

export const events = pgTable("events", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  registeredBy: uuid("registered_by")
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),
  ...tableDates,
});
