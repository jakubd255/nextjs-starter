import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const albums = pgTable("albums", {
    userId: text("owner_id").primaryKey().references(() => users.id, {onDelete: "cascade"}),
    images: text("images").array().notNull().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow()
});

export type Album = typeof albums.$inferSelect;