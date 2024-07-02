import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { tableBasic } from "../../utils/db";
import { InferSelectModel } from "drizzle-orm";

export const guests = pgTable("guests", {
  ...tableBasic,
  code: varchar("code", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  isAttended: boolean("is_attended").default(false).notNull(),
  attendedAt: timestamp("attended_at"),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
});

export type IGuest = InferSelectModel<typeof guests>;
