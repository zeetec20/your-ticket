import { pgTable, varchar } from "drizzle-orm/pg-core";
import { tableBasic } from "../../utils/db";

export const users = pgTable("users", {
  ...tableBasic,
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});
