import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { tableDates } from "../utils";

export const users = pgTable("users", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ...tableDates,
});
