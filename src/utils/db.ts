import { timestamp, uuid } from "drizzle-orm/pg-core";

export const tableDates = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

export const tableBasic = {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  ...tableDates,
};
