import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const sessions = pgTable("sessions", {
    id: text().notNull().primaryKey(),
    userId: text().notNull().references(() => users.id, {onDelete: "cascade"}),
    os: text().notNull(),
    browser: text(),
    createdAt: timestamp().defaultNow(),
    expiresAt: timestamp().notNull()
});

export const sessionsRelations = relations(sessions, ({one}) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    })
}));