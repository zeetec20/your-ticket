import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { tableDates } from "../../utils/db";

export const users = pgTable("users", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  ...tableDates,
});
