import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { tokens } from "./tokens";

export const emails = pgTable("emails", {
    id: text().notNull().primaryKey(),
    email: text().notNull().unique(),
    verified: boolean().notNull().default(false),
    primary: boolean().notNull().default(false),
    userId: text().notNull().references(() => users.id, {onDelete: "cascade"})
});

export const emailsRelations = relations(emails, ({one, many}) => ({
    user: one(users, {
        fields: [emails.userId],
        references: [users.id],
    }),
    tokens: many(tokens)
}));