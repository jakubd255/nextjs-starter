import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { StoredFile } from "@/lib/upload/manifest";

export const albums = pgTable("albums", {
    userId: text("owner_id").primaryKey().references(() => users.id, {onDelete: "cascade"}),
    files: jsonb("files").$type<StoredFile[]>().notNull().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow()
});

export type Album = typeof albums.$inferSelect;